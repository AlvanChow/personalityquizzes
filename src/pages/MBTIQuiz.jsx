import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mbtiQuestions } from '../data/mbtiQuestions';
import { getMBTIResult } from '../data/mbtiResults';
import { computeMBTIScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';
import { allowQuizSave } from '../utils/rateLimiter';
import { usePageTitle } from '../hooks/usePageTitle';
import { safeJsonParse } from '../utils/security';
import { lighten } from '../utils/vectorQuiz';
import { getQuizFactsLine } from '../data/quizInfo';
import CoreIntroBreakdown from '../components/CoreIntroBreakdown';
import './narutoQuiz.css';

// Presentation-only rebuild: the MBTI instrument now renders through the
// ink-scroll (.nq) design system used by the vector quizzes. Question data,
// answer shape ({ [id]: { trait, value } }), scoring, storage keys, analytics
// payloads, and completion navigation are identical to the QuizShell version.

const AURA = '#7fb2d9';
const REDUCE = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// ─── In-progress answer persistence (same key + shape as QuizShell) ─────────
// Answers live in sessionStorage while the quiz is underway so an accidental
// refresh doesn't discard everything. Cleared on submit.
const PROGRESS_KEY = 'pq_progress_mbti';

function readProgress() {
  try {
    const parsed = safeJsonParse(sessionStorage.getItem(PROGRESS_KEY), null);
    if (!parsed || typeof parsed !== 'object') return null;
    // Only restore answers whose question ids still exist.
    const validIds = new Set(mbtiQuestions.map((q) => String(q.id)));
    const answers = {};
    for (const [id, a] of Object.entries(parsed.answers ?? {})) {
      if (validIds.has(String(id)) && a && typeof a === 'object') answers[id] = a;
    }
    const index = Number.isInteger(parsed.index) ? Math.max(0, parsed.index) : 0;
    return { answers, index };
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

// Washi option buttons live only on this page; hover/selected states need
// pseudo-classes, so they ride along as a scoped style block (no new files).
const OPTION_CSS = `
.nq .mbti-opts{display:flex; flex-direction:column; gap:12px; max-width:640px; margin:0 auto;}
.nq .mbti-opt{position:relative; display:flex; align-items:flex-start; gap:14px; width:100%; text-align:left;
  padding:16px 18px; border:none; border-radius:var(--r-sm); cursor:pointer;
  background:linear-gradient(180deg, var(--ink-2), var(--ink-3));
  color:var(--paper-dim); font-family:var(--body); font-weight:600; font-size:.98rem; line-height:1.5;
  box-shadow:inset 0 0 0 1px var(--line);
  transition:transform .18s ease, box-shadow .22s ease, color .2s ease, background .2s ease;}
.nq .mbti-opt:hover{transform:translateY(-2px); color:var(--paper);
  box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--aura) 55%, var(--line)), 0 14px 30px -18px rgba(0,0,0,.8), 0 0 30px -12px var(--aura);}
.nq .mbti-opt:active{transform:translateY(0);}
.nq .mbti-opt[aria-checked="true"]{color:var(--paper);
  background:linear-gradient(180deg, color-mix(in srgb, var(--aura) 16%, var(--ink-2)), color-mix(in srgb, var(--aura) 8%, var(--ink-3)));
  box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--aura) 70%, transparent), 0 0 26px -8px var(--aura);}
.nq .mbti-opt .oletter{flex:none; width:26px; height:26px; margin-top:1px; border-radius:50%; display:grid; place-items:center;
  font-family:var(--disp); font-size:.72rem; font-weight:700; letter-spacing:.04em;
  color:var(--paper-mute); box-shadow:inset 0 0 0 1px var(--line-strong); transition:all .2s ease;}
.nq .mbti-opt:hover .oletter{color:var(--aura-l); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--aura) 60%, transparent);}
.nq .mbti-opt[aria-checked="true"] .oletter{color:var(--ink); background:var(--aura); box-shadow:0 0 14px -2px var(--aura);}
.nq .mbti-opt.pulse{animation:mbtiPulse .34s ease;}
@keyframes mbtiPulse{0%{transform:scale(.985);}55%{transform:scale(1.012);}100%{transform:scale(1);}}
@media (prefers-reduced-motion: reduce){.nq .mbti-opt.pulse{animation:none;}}
`;

export default function MBTIQuiz() {
  usePageTitle('MBTI Quiz — My Personality Quizzes');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  const [restored] = useState(() => readProgress());
  const [screen, setScreen] = useState('intro');
  const [answers, setAnswers] = useState(() => restored?.answers ?? {});
  const [idx, setIdx] = useState(() =>
    Math.min(restored?.index ?? 0, Math.max(0, mbtiQuestions.length - 1)));
  const [picked, setPicked] = useState(null);
  const advancingRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Fire quiz_started once on mount (as QuizShell did). startedRef guards
  // against React StrictMode's double-invocation of effects in development.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('quiz_started', { quiz: 'mbti' }, user?.id ?? null);
  }, [user?.id]);

  // Keep in-progress answers across accidental refreshes.
  useEffect(() => {
    writeProgress(answers, idx);
  }, [answers, idx]);

  const submittingRef = useRef(false);

  const handleComplete = useCallback(async (answers) => {
    // Guard against double submission
    if (submittingRef.current) return;
    submittingRef.current = true;

    const scores = computeMBTIScores(answers);
    const result = getMBTIResult(scores);

    localStorage.setItem('personalens_mbti', JSON.stringify({ scores, result }));

    if (user && supabase && allowQuizSave()) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'mbti',
          p_result: {
            resultKey: result.name,
            name: `${result.name} — ${result.nickname}`,
            emoji: result.emoji,
            trait: result.nickname,
            quizName: 'MBTI (16 Types)',
            scores,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save MBTI quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        submittingRef.current = false;
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'mbti', result_key: result.name, duration_ms }, user?.id ?? null);

    // Replace the quiz in browser history so the back button skips it.
    navigate('/quiz/mbti/result', { replace: true });
  }, [navigate, user]);

  const handleAnswer = useCallback((question, value) => {
    if (advancingRef.current) return;
    const newAnswers = { ...answers, [question.id]: { trait: question.trait, value } };
    setAnswers(newAnswers);
    setPicked(value);
    advancingRef.current = true;
    setTimeout(() => {
      if (idx < mbtiQuestions.length - 1) {
        setIdx(idx + 1);
        setPicked(null);
        advancingRef.current = false;
      } else {
        clearProgress();
        Promise.resolve(handleComplete(newAnswers)).finally(() => {
          // If the save failed we stay on the last question so it can be retried.
          advancingRef.current = false;
          setPicked(null);
        });
      }
    }, REDUCE ? 60 : 340);
  }, [answers, idx, handleComplete]);

  const handleBack = useCallback(() => {
    if (advancingRef.current) return;
    if (idx === 0) setScreen('intro');
    else setIdx(idx - 1);
  }, [idx]);

  const resuming = Boolean(restored && Object.keys(restored.answers).length > 0);

  let body = null;

  if (screen === 'intro') {
    body = (
      <section className="intro">
        <p className="eyebrow solo">The Sixteen Types</p>
        <h1>Which of the <span className="em">16 types</span> are you?</h1>
        <p className="lede">
          28 everyday scenarios — no trick questions. Pick the answer that sounds
          most like you and watch your four letters take shape.
        </p>
        <CoreIntroBreakdown quizKey="mbti" />
        <div className="cta">
          <button className="btn btn-primary" onClick={() => setScreen('quiz')}>
            {resuming ? 'Continue' : 'Begin'}
          </button>
          <p className="fine">{getQuizFactsLine('mbti')}</p>
          <p className="fine">
            <b>28</b> questions <span className="dot" /> <b>16</b> types <span className="dot" /> ~6 minutes
          </p>
        </div>
        <button className="linkbtn" onClick={() => navigate('/')}>← All quizzes</button>
      </section>
    );
  }

  if (screen === 'quiz') {
    const question = mbtiQuestions[idx];
    const pct = (idx / mbtiQuestions.length) * 100;
    body = (
      <section className="quiz">
        <div className="progress-row">
          <div className="ptrack"><div className="pfill" style={{ width: `${pct}%` }} /></div>
          <div className="pcount"><b>{String(idx + 1).padStart(2, '0')}</b> / {mbtiQuestions.length}</div>
        </div>
        <p className="qnum">Question {idx + 1}</p>
        <h2 className="qtext" key={idx}>{question.text}</h2>
        <div className="mbti-opts" role="radiogroup" aria-label="Answer choices">
          {question.options.map((opt, i) => {
            const selected = answers[question.id]?.value === opt.value;
            return (
              <button
                key={opt.value}
                className={`mbti-opt${picked === opt.value ? ' pulse' : ''}`}
                role="radio"
                aria-checked={selected}
                onClick={() => handleAnswer(question, opt.value)}
              >
                <span className="oletter" aria-hidden="true">{OPTION_LETTERS[i]}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
        <div className="quiz-nav">
          <button className="back" onClick={handleBack}>
            {idx === 0 ? '← Back' : '← Previous'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="nq no-seal" style={{ '--aura': AURA, '--aura-l': lighten(AURA, 0.4) }}>
      <style>{OPTION_CSS}</style>
      <div className="bg" aria-hidden="true">
        <div className="glow g1" />
        <div className="glow g2" />
        <div className="grain" />
        <div className="vignette" />
      </div>
      {saveError && (
        <p
          role="alert"
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 50, maxWidth: '90vw', background: '#2a1512',
            boxShadow: 'inset 0 0 0 1px rgba(217,58,43,.55), 0 12px 30px -12px rgba(0,0,0,.8)',
            color: '#f2c1b8', fontSize: '.9rem', fontWeight: 600,
            padding: '12px 20px', borderRadius: 16,
          }}
        >
          {saveError}
        </p>
      )}
      <main className="wrap">{body}</main>
    </div>
  );
}
