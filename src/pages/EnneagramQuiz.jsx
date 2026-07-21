import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { enneagramQuestions } from '../data/enneagramQuestions';
import { getEnneagramResult } from '../data/enneagramResults';
import { computeEnneagramScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';
import { allowQuizSave } from '../utils/rateLimiter';
import { usePageTitle } from '../hooks/usePageTitle';
import { lighten } from '../utils/vectorQuiz';
import { getQuizFactsLine } from '../data/quizInfo';
import CoreIntroBreakdown from '../components/CoreIntroBreakdown';
import { safeJsonParse } from '../utils/security';
import './narutoQuiz.css';

// Presentation-only restyle: the Enneagram flow now renders through the
// site's immersive .nq ink-scroll design system — intro screen, one question
// at a time, auto-advancing sized-dot Likert control. Everything the quiz
// *measures* is untouched: question data/order, answer shape
// ({ [id]: { trait, value } }), scoring, the personalens_enneagram storage
// write, the pq_progress_enneagram session persistence, analytics events,
// and completion navigation all match the previous QuizShell version.

const AURA = '#a983d6';
const AURA_VARS = { '--aura': AURA, '--aura-l': lighten(AURA, 0.4) };

const REDUCE = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// The instrument's 4-point scale mapped onto the sized-dot control.
// Even scale → no neutral center dot; values stay exactly 1..4.
const DOT_STYLE = [
  { size: 'lg', side: 'l' },
  { size: 'md', side: 'l' },
  { size: 'md', side: 'r' },
  { size: 'lg', side: 'r' },
];

// ─── In-progress answer persistence ─────────────────────────────────────────
// Same key + { answers, index } shape QuizShell used, so an accidental
// refresh (even across this redesign) keeps the user's answers.

const PROGRESS_KEY = 'pq_progress_enneagram';

function readProgress() {
  try {
    const parsed = safeJsonParse(sessionStorage.getItem(PROGRESS_KEY), null);
    if (!parsed || typeof parsed !== 'object') return null;
    // Only restore answers whose question ids still exist.
    const validIds = new Set(enneagramQuestions.map((q) => String(q.id)));
    const answers = {};
    for (const [id, a] of Object.entries(parsed.answers ?? {})) {
      if (validIds.has(String(id)) && a && typeof a === 'object') answers[id] = a;
    }
    return { answers };
  } catch {
    return null;
  }
}

function writeProgress(answers, index) {
  try {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ answers, index }));
  } catch { /* storage full/unavailable — persistence is best-effort */ }
}

function clearProgress() {
  try { sessionStorage.removeItem(PROGRESS_KEY); } catch { /* ignore */ }
}

// Resume at the first unanswered question so completion always carries a
// full answer set (old paged sessions stored a page index, not a question
// index, so the stored index is not trusted for position).
function resumeIndex(answers) {
  const first = enneagramQuestions.findIndex((q) => answers[q.id] == null);
  return first === -1 ? enneagramQuestions.length - 1 : first;
}

export default function EnneagramQuiz() {
  usePageTitle('Enneagram Quiz — My Personality Quizzes');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // quiz_started fires once on mount, exactly as QuizShell did. startedRef
  // guards against StrictMode's double-invocation in development.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('quiz_started', { quiz: 'enneagram' }, user?.id ?? null);
  }, [user?.id]);

  const submittingRef = useRef(false);

  const handleComplete = useCallback(async (answers) => {
    // Guard against double submission
    if (submittingRef.current) return;
    submittingRef.current = true;

    const scores = computeEnneagramScores(answers);
    const result = getEnneagramResult(scores);

    localStorage.setItem('personalens_enneagram', JSON.stringify({ scores, result }));

    if (user && supabase && allowQuizSave()) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'enneagram',
          p_result: {
            resultKey: result.typeNumber,
            name: result.name,
            emoji: result.emoji,
            trait: result.nickname,
            quizName: 'Enneagram',
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save Enneagram quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        submittingRef.current = false;
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'enneagram', result_key: result.typeNumber, duration_ms }, user?.id ?? null);

    // Replace the quiz in browser history so the back button skips it.
    navigate('/quiz/enneagram/result', { replace: true });
  }, [navigate, user]);

  // ─── presentation state ───
  const [restored] = useState(() => readProgress());
  const hasRestored = restored != null && Object.keys(restored.answers).length > 0;
  const [screen, setScreen] = useState(() => (hasRestored ? 'quiz' : 'intro'));
  const [answers, setAnswers] = useState(() => restored?.answers ?? {});
  const [idx, setIdx] = useState(() => (hasRestored ? resumeIndex(restored.answers) : 0));
  const [pulse, setPulse] = useState(null);
  const advanceRef = useRef(null);

  useEffect(() => () => clearTimeout(advanceRef.current), []);

  // Keep in-progress answers across accidental refreshes.
  useEffect(() => {
    writeProgress(answers, idx);
  }, [answers, idx]);

  const total = enneagramQuestions.length;
  const question = enneagramQuestions[idx];

  const pick = useCallback((value) => {
    const next = { ...answers, [question.id]: { trait: question.trait, value } };
    setAnswers(next);
    setPulse(value);
    clearTimeout(advanceRef.current);
    advanceRef.current = setTimeout(() => {
      setPulse(null);
      if (idx < total - 1) {
        setIdx(idx + 1);
      } else {
        clearProgress();
        handleComplete(next);
      }
    }, REDUCE ? 60 : 340);
  }, [answers, question, idx, total, handleComplete]);

  const goBack = useCallback(() => {
    clearTimeout(advanceRef.current);
    setPulse(null);
    if (idx === 0) navigate('/');
    else setIdx(idx - 1);
  }, [idx, navigate]);

  // ─── screens ───
  let body = null;

  if (screen === 'intro') {
    body = (
      <section className="intro">
        <div className="seal-mark"><span className="ring" /><span className="ring r2" /><span className="kanji">9</span></div>
        <p className="eyebrow solo">The Enneagram</p>
        <h1>What <span className="em">drives</span> you?</h1>
        <p className="lede">
          Nine core types, nine different engines running under the surface.
          Twenty-seven honest reflections reveal which one is quietly steering yours.
        </p>
        <CoreIntroBreakdown quizKey="enneagram" />
        <div className="cta">
          <button className="btn btn-primary" onClick={() => setScreen('quiz')}>Begin</button>
          <p className="fine">{getQuizFactsLine('enneagram')}</p>
          <p className="fine"><b>27</b> questions <span className="dot" /> about 3 minutes <span className="dot" /> <b>9</b> types</p>
        </div>
        <button className="linkbtn" onClick={() => navigate('/')}>← All quizzes</button>
      </section>
    );
  }

  if (screen === 'quiz') {
    const pct = (idx / total) * 100;
    body = (
      <section className="quiz">
        <div className="progress-row">
          <div className="ptrack"><div className="pfill" style={{ width: `${pct}%` }} /></div>
          <div className="pcount"><b>{String(idx + 1).padStart(2, '0')}</b> / {total}</div>
        </div>
        <p className="qnum">Question {idx + 1}</p>
        <h2 className="qtext" key={idx}>{question.text}</h2>
        <div className="likert">
          <div className="likert-labels"><span className="l">Not me</span><span className="r">Totally me</span></div>
          <div className="dots" role="radiogroup" aria-label="How much is this like you?">
            {question.options.map((o, i) => (
              <button
                key={o.value}
                className={pulse === o.value ? 'dot pulse' : 'dot'}
                data-size={DOT_STYLE[i].size}
                data-side={DOT_STYLE[i].side}
                role="radio"
                aria-checked={answers[question.id]?.value === o.value}
                aria-label={o.label}
                onClick={() => pick(o.value)}
              >
                <span className="core" />
              </button>
            ))}
          </div>
        </div>
        {saveError && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <button className="btn btn-primary" onClick={() => handleComplete(answers)}>
              Try saving again
            </button>
          </div>
        )}
        <div className="quiz-nav">
          <button className="back" onClick={goBack}>
            {idx === 0 ? '← Exit' : '← Previous'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {saveError && (
        <p role="alert" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-3 rounded-2xl shadow-md z-50">
          {saveError}
        </p>
      )}
      <div className="nq no-seal" style={AURA_VARS}>
        <div className="bg" aria-hidden="true">
          <div className="glow g1" />
          <div className="glow g2" />
          <div className="grain" />
          <div className="vignette" />
        </div>
        <main className="wrap">{body}</main>
      </div>
    </>
  );
}
