import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { enneagramDeepQuestions } from '../data/enneagramDeepQuestions';
import { getEnneagramResult } from '../data/enneagramResults';
import { computeEnneagramDeepScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';
import { allowQuizSave } from '../utils/rateLimiter';
import { usePageTitle } from '../hooks/usePageTitle';
import { safeJsonParse } from '../utils/security';
import { lighten } from '../utils/vectorQuiz';
import './narutoQuiz.css';

// Presentation-only restyle: the 36-item inventory now renders through the
// site's immersive .nq (ink-scroll) design system — ambient aura background,
// one statement at a time, sized-dot Likert control, auto-advance. Question
// data, answer shapes, scoring, storage contracts, analytics events, and
// navigation are unchanged from the QuizShell version.

const AURA = '#9572c9';

const REDUCE = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// The instrument's 1–5 accuracy scale, untouched — size/side only shape the
// dot control. Labels mirror the option labels in enneagramDeepQuestions.
const LIKERT = [
  { value: 1, size: 'lg', side: 'l', label: 'Very Inaccurate' },
  { value: 2, size: 'md', side: 'l', label: 'Moderately Inaccurate' },
  { value: 3, size: 'sm', side: 'c', label: 'Neutral' },
  { value: 4, size: 'md', side: 'r', label: 'Moderately Accurate' },
  { value: 5, size: 'lg', side: 'r', label: 'Very Accurate' },
];

// ─── In-progress answer persistence ─────────────────────────────────────────
// Same sessionStorage contract QuizShell used (same key, same {answers,index}
// shape) so an accidental refresh mid-quiz keeps every collected answer.

const PROGRESS_KEY = 'pq_progress_enneagram_deep';

function readProgress(questions) {
  try {
    const parsed = safeJsonParse(sessionStorage.getItem(PROGRESS_KEY), null);
    if (!parsed || typeof parsed !== 'object') return null;
    // Only restore answers whose question ids still exist.
    const validIds = new Set(questions.map((q) => String(q.id)));
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

// First statement without a collected answer. Resuming here guarantees the
// inventory is complete before scoring — the same guarantee the old paged
// view enforced with its per-page checks.
function resumeIndex(answers, questions) {
  const i = questions.findIndex((q) => answers[q.id] == null);
  return i === -1 ? questions.length - 1 : i;
}

export default function EnneagramDeepQuiz() {
  usePageTitle('Enneagram Deep Quiz — My Personality Quizzes');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const submittingRef = useRef(false);

  const [restored] = useState(() => readProgress(enneagramDeepQuestions));
  const [screen, setScreen] = useState('intro');
  const [answers, setAnswers] = useState(() => restored?.answers ?? {});
  const [idx, setIdx] = useState(() => resumeIndex(restored?.answers ?? {}, enneagramDeepQuestions));
  const [pulseVal, setPulseVal] = useState(null);

  // Fire quiz_started once on mount (as QuizShell did). startedRef guards
  // against React StrictMode's double-invocation of effects in development.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('quiz_started', { quiz: 'enneagram_deep' }, user?.id ?? null);
  }, [user?.id]);

  useEffect(() => {
    if (screen !== 'quiz') return;
    writeProgress(answers, idx);
  }, [screen, answers, idx]);

  useEffect(() => {
    setPulseVal(null);
  }, [idx]);

  const handleComplete = useCallback(async (answers) => {
    // Guard against double submission
    if (submittingRef.current) return;
    submittingRef.current = true;

    const scores = computeEnneagramDeepScores(answers, enneagramDeepQuestions);
    const result = getEnneagramResult(scores);

    localStorage.setItem('personalens_enneagram', JSON.stringify({ scores, result, quizKey: 'enneagram_deep', quizName: 'Enneagram Deep (36-item)' }));

    if (user && supabase && allowQuizSave()) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'enneagram_deep',
          p_result: {
            resultKey: result.typeNumber,
            name: result.name,
            emoji: result.emoji,
            trait: result.nickname,
            quizName: 'Enneagram Deep (36-item)',
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save Enneagram deep quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        submittingRef.current = false;
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'enneagram_deep', result_key: result.typeNumber, duration_ms }, user?.id ?? null);

    navigate('/quiz/enneagram/result', { replace: true });
  }, [navigate, user]);

  const pick = useCallback((question, value) => {
    const next = { ...answers, [question.id]: { trait: question.trait, value } };
    setAnswers(next);
    setPulseVal(value);
    window.setTimeout(() => {
      if (idx < enneagramDeepQuestions.length - 1) {
        setIdx(idx + 1);
      } else {
        clearProgress();
        handleComplete(next);
      }
    }, REDUCE ? 60 : 340);
  }, [answers, idx, handleComplete]);

  const goBack = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);

  // ─── screens ───
  let body = null;

  if (screen === 'intro') {
    const started = Object.keys(answers).length > 0;
    body = (
      <section className="intro">
        <p className="eyebrow solo">Core Instrument · Enneagram</p>
        <h1>What <span className="em">drives</span> you?</h1>
        <p className="lede">
          Nine core types, each built around a hidden fear and a driving desire.
          Thirty-six statements reach beneath your habits to find yours. Answer
          as you are — not as you wish to be.
        </p>
        <div className="cta">
          <button className="btn btn-primary" onClick={() => setScreen('quiz')}>
            {started ? 'Resume' : 'Begin'}
          </button>
          <p className="fine">
            <b>36</b> statements <span className="dot" /> <b>9</b> core types <span className="dot" /> about 5 minutes
          </p>
        </div>
        <button className="linkbtn" onClick={() => navigate('/')}>← All quizzes</button>
      </section>
    );
  }

  if (screen === 'quiz') {
    const q = enneagramDeepQuestions[idx];
    const total = enneagramDeepQuestions.length;
    const pct = (idx / total) * 100;
    body = (
      <section className="quiz">
        <div className="progress-row">
          <div className="ptrack"><div className="pfill" style={{ width: `${pct}%` }} /></div>
          <div className="pcount"><b>{String(idx + 1).padStart(2, '0')}</b> / {total}</div>
        </div>
        <p className="qnum">Statement {idx + 1}</p>
        <h2 className="qtext" key={q.id}>{q.text}</h2>
        <div className="likert">
          <div className="likert-labels">
            <span className="l">Inaccurate</span><span>Neutral</span><span className="r">Accurate</span>
          </div>
          <div className="dots" role="radiogroup" aria-label="How accurately does this describe you?">
            {LIKERT.map((o) => {
              const checked = answers[q.id]?.value === o.value;
              return (
                <button
                  key={o.value}
                  className={checked && pulseVal === o.value ? 'dot pulse' : 'dot'}
                  data-size={o.size}
                  data-side={o.side}
                  role="radio"
                  aria-checked={checked}
                  aria-label={o.label}
                  onClick={() => pick(q, o.value)}
                >
                  <span className="core" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="quiz-nav" style={{ gap: '14px' }}>
          {idx > 0 && (
            <button className="back" onClick={goBack}>← Previous</button>
          )}
          <button className="back" onClick={() => navigate('/')}>Exit quiz</button>
        </div>
      </section>
    );
  }

  return (
    <div className="nq no-seal" style={{ '--aura': AURA, '--aura-l': lighten(AURA, 0.4) }}>
      <div className="bg" aria-hidden="true">
        <div className="glow g1" />
        <div className="glow g2" />
        <div className="grain" />
        <div className="vignette" />
      </div>
      <main className="wrap">{body}</main>
      {saveError && (
        <p role="alert" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-3 rounded-2xl shadow-md z-50">
          {saveError}
        </p>
      )}
    </div>
  );
}
