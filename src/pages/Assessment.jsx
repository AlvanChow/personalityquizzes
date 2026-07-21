import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { baselineQuestions, likertOptions } from '../data/baselineQuestions';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { computeBaselineScores } from '../utils/scoring';
import { track } from '../utils/analytics';
import { usePageTitle } from '../hooks/usePageTitle';
import { safeJsonParse } from '../utils/security';
import { lighten } from '../utils/vectorQuiz';
import { getQuizFactsLine } from '../data/quizInfo';
import CoreIntroBreakdown from '../components/CoreIntroBreakdown';
import './narutoQuiz.css';

// The baseline Big Five assessment, dressed in the ink-scroll (.nq) shell the
// vector quizzes use: seal-dark ambient background, one statement at a time,
// sized-dot Likert control with auto-advance. Everything it measures is
// untouched — question text/order, 1–5 option values, the answers map shape
// ({ [id]: { trait, value } }), computeBaselineScores, completeBaseline,
// analytics events, the pq_progress_baseline session store, and the
// /dashboard redirect are identical to the previous QuizShell version.

const AURA = '#35b58e';
const AURA_VARS = { '--aura': AURA, '--aura-l': lighten(AURA, 0.4) };

const REDUCE = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Visual treatment per Likert value (1–5): large seal-red dots on the
// disagree side, gold on the agree side, small neutral core in the middle.
const DOT_LOOK = [
  { size: 'lg', side: 'l' },
  { size: 'md', side: 'l' },
  { size: 'sm', side: 'c' },
  { size: 'md', side: 'r' },
  { size: 'lg', side: 'r' },
];

// ─── In-progress answer persistence (same key + shape QuizShell used) ───────
const PROGRESS_KEY = 'pq_progress_baseline';

function readProgress() {
  try {
    const parsed = safeJsonParse(sessionStorage.getItem(PROGRESS_KEY), null);
    if (!parsed || typeof parsed !== 'object') return null;
    // Only restore answers whose question ids still exist.
    const validIds = new Set(baselineQuestions.map((q) => String(q.id)));
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

export default function Assessment() {
  usePageTitle('Big Five Assessment — My Personality Quizzes');
  const navigate = useNavigate();
  const { completeBaseline } = useBigFive();
  const { user } = useAuth();
  const startTimeRef = useRef(null);

  const [restored] = useState(readProgress);
  const [screen, setScreen] = useState('intro');
  const [answers, setAnswers] = useState(() => restored?.answers ?? {});
  const [idx, setIdx] = useState(() => {
    // Resume at the first unanswered statement (also copes gracefully with
    // progress saved by the old paged UI, whose index meant "page").
    if (!restored) return 0;
    const firstOpen = baselineQuestions.findIndex((q) => restored.answers[q.id] == null);
    return firstOpen === -1 ? baselineQuestions.length - 1 : firstOpen;
  });
  const [pulseValue, setPulseValue] = useState(null);
  const advanceTimerRef = useRef(null);
  const lockRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => clearTimeout(advanceTimerRef.current);
  }, []);

  // Fire quiz_started once on mount (startedRef guards StrictMode re-runs),
  // exactly as QuizShell did before the restyle.
  const startedRef = useRef(false);
  const userId = user?.id ?? null;
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('quiz_started', { quiz: 'baseline' }, userId);
  }, [userId]);

  // Keep in-progress answers across accidental refreshes.
  useEffect(() => {
    if (screen !== 'quiz') return;
    writeProgress(answers, idx);
  }, [screen, answers, idx]);

  const handleComplete = useCallback((finalAnswers) => {
    clearProgress();
    const scores = computeBaselineScores(finalAnswers, baselineQuestions);
    completeBaseline(scores);
    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('baseline_completed', { duration_ms }, user?.id ?? null);
    navigate('/dashboard');
  }, [completeBaseline, navigate, user]);

  const pick = useCallback((value) => {
    if (lockRef.current) return;
    lockRef.current = true;
    const q = baselineQuestions[idx];
    const next = { ...answers, [q.id]: { trait: q.trait, value } };
    setAnswers(next);
    setPulseValue(value);
    advanceTimerRef.current = setTimeout(() => {
      lockRef.current = false;
      setPulseValue(null);
      if (idx < baselineQuestions.length - 1) setIdx(idx + 1);
      else handleComplete(next);
    }, REDUCE ? 60 : 340);
  }, [idx, answers, handleComplete]);

  const goBack = useCallback(() => {
    clearTimeout(advanceTimerRef.current);
    lockRef.current = false;
    setPulseValue(null);
    if (idx === 0) setScreen('intro');
    else setIdx(idx - 1);
  }, [idx]);

  const answeredCount = Object.keys(answers).length;
  const total = baselineQuestions.length;

  let body = null;

  if (screen === 'intro') {
    body = (
      <section className="intro">
        <p className="eyebrow solo">The Core Instrument</p>
        <h1>Chart your <span className="em">Big&nbsp;Five</span></h1>
        <p className="lede">
          Twenty-five quick statements. Rate how true each one feels — first
          instinct is the right instinct — and your five trait spectra light up
          on your dashboard.
        </p>
        <CoreIntroBreakdown quizKey="big5" />
        <div className="cta">
          <button className="btn btn-primary" onClick={() => setScreen('quiz')}>
            {answeredCount > 0 ? 'Continue' : 'Begin'}
          </button>
          <p className="fine">{getQuizFactsLine('big5')}</p>
          <p className="fine">
            <b>5</b> traits <span className="dot" /> <b>{total}</b> statements <span className="dot" /> about 3 minutes
          </p>
        </div>
        <button className="linkbtn" onClick={() => navigate('/')}>← All quizzes</button>
      </section>
    );
  }

  if (screen === 'quiz') {
    const q = baselineQuestions[idx];
    const pct = (idx / total) * 100;
    body = (
      <section className="quiz">
        <div className="progress-row">
          <div className="ptrack"><div className="pfill" style={{ width: `${pct}%` }} /></div>
          <div className="pcount"><b>{String(idx + 1).padStart(2, '0')}</b> / {total}</div>
        </div>
        <p className="qnum">Statement {idx + 1}</p>
        <h2 className="qtext" key={idx}>{q.text}</h2>
        <div className="likert">
          <div className="likert-labels">
            <span className="l">Disagree</span><span>Neutral</span><span className="r">Agree</span>
          </div>
          <div className="dots" role="radiogroup" aria-label="How well does this describe you?">
            {likertOptions.map((opt, i) => (
              <button
                key={opt.value}
                className={pulseValue === opt.value ? 'dot pulse' : 'dot'}
                data-size={DOT_LOOK[i].size}
                data-side={DOT_LOOK[i].side}
                role="radio"
                aria-checked={answers[q.id]?.value === opt.value}
                aria-label={opt.label}
                onClick={() => pick(opt.value)}
              >
                <span className="core" />
              </button>
            ))}
          </div>
        </div>
        <div className="quiz-nav" style={{ gap: 10 }}>
          <button className="back" onClick={goBack}>← {idx === 0 ? 'Intro' : 'Previous'}</button>
          <button className="back" onClick={() => navigate('/')} aria-label="Exit quiz">Exit ✕</button>
        </div>
      </section>
    );
  }

  return (
    <div className="nq no-seal" style={AURA_VARS}>
      <div className="bg" aria-hidden="true">
        <div className="glow g1" />
        <div className="glow g2" />
        <div className="grain" />
        <div className="vignette" />
      </div>
      <main className="wrap">{body}</main>
    </div>
  );
}
