import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SharePanel from './SharePanel';
import FeedbackWidget from './FeedbackWidget';
import NextQuizBanner from './NextQuizBanner';
import CompareBanner from './CompareBanner';
import { emblem } from '../data/vectorQuizzes/glyphs';
import { lighten, userVector, ranked, matchPct } from '../utils/vectorQuiz';
import { getQuizFactsLine } from '../data/quizInfo';
import { storageKeyFor } from '../data/quizzes';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';
import { allowQuizSave } from '../utils/rateLimiter';
import { safeLocalStorageRead } from '../utils/security';
import '../pages/narutoQuiz.css';

// The shared five-screen vector-quiz experience: seal intro → auto-advancing
// Likert dots → aura-themed result (emblem, tier badge, match %, spectra,
// kindred/foil, clickable close matches) → full roster gallery → per-result
// profiles. Every vector quiz renders through this component with its own
// data module (see src/data/vectorQuizzes/) driving copy, theme, and roster.
//
// THEME: this immersive "ink" experience (styles in narutoQuiz.css) follows the
// site's light/dark toggle — dark sumi-ink grounds by default, a warm-paper
// palette under html:not(.dark). The per-quiz aura accent is set inline.

const LIKERT = [
  { v: -1, size: 'lg', side: 'l', label: 'Strongly disagree' },
  { v: -0.5, size: 'md', side: 'l', label: 'Disagree' },
  { v: 0, size: 'sm', side: 'c', label: 'Neutral' },
  { v: 0.5, size: 'md', side: 'r', label: 'Agree' },
  { v: 1, size: 'lg', side: 'r', label: 'Strongly agree' },
];
const REDUCE = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Optional per-quiz display fonts (naruto's CJK set), injected once.
function ensureFonts(id, href) {
  if (!href || document.getElementById(id)) return;
  for (const [rel, h, cross] of [
    ['preconnect', 'https://fonts.googleapis.com', false],
    ['preconnect', 'https://fonts.gstatic.com', true],
  ]) {
    const l = document.createElement('link');
    l.rel = rel; l.href = h;
    if (cross) l.crossOrigin = 'anonymous';
    document.head.appendChild(l);
  }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Emblem SVG comes from our own static data — no user input reaches it.
function Emblem({ ch, size, noSpin = false, reveal = false }) {
  const html = useMemo(() => emblem(ch, size, noSpin, REDUCE), [ch, size, noSpin]);
  return (
    <span
      className={reveal && !REDUCE ? 'reveal-emblem' : undefined}
      style={{ display: 'inline-flex' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function TierBadge({ tier, labels, className = '' }) {
  return tier === 'cut'
    ? <span className={`badge badge-cut ${className}`}>{labels.cut}</span>
    : <span className={`badge badge-front ${className}`}>{labels.front}</span>;
}

// Lowercase a tier label and naively pluralise it for the intro count line
// ("14 main characters", "6 core values"), so a count never reads "1 characters".
function pluralizeLabel(word, n) {
  const w = String(word).toLowerCase();
  return n === 1 ? w : `${w}s`;
}

function RelBlock({ chars, charKey, label }) {
  const c = chars[charKey];
  if (!c) return null;
  return (
    <div className="rel">
      <span className="rdot" style={{ background: c.aura }} />
      <div>
        <div className="rlabel">{label}</div>
        <div className="rname">{c.name}</div>
      </div>
    </div>
  );
}

// Spectrum bars; marks slide from center to position after mount.
function Spectra({ spectra, vector, heading }) {
  const [placed, setPlaced] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPlaced(true)));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="spectra">
      <h3>{heading}</h3>
      {spectra.map((sp, ax) => {
        const pos = ((vector[ax] + 1) / 2) * 100;
        return (
          <div className="spec" key={sp.l}>
            <div className="spec-ends">
              <span className={vector[ax] < -0.08 ? 'on' : ''}>{sp.l}</span>
              <span className={vector[ax] > 0.08 ? 'on' : ''}>{sp.r}</span>
            </div>
            <div className="spec-bar">
              <span className="spec-mark" style={{ left: `${placed ? pos : 50}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function VectorQuizExperience({ def }) {
  const { key: QUIZ_KEY, CHARS, Q, AXMAX, SPECTRA } = def;
  const tierLabels = def.tierLabels ?? { front: 'Front Line', cut: 'Deep Cut' };
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const onResultRoute = location.pathname.endsWith('/result');

  const stored = useMemo(
    () => safeLocalStorageRead(storageKeyFor(QUIZ_KEY), null),
    // Re-read whenever we land on the result route.
    [QUIZ_KEY, onResultRoute], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [screen, setScreen] = useState(onResultRoute ? 'result' : 'intro');
  const [answers, setAnswers] = useState(() => new Array(Q.length).fill(null));
  const [idx, setIdx] = useState(0);
  const [focusKey, setFocusKey] = useState(stored?.resultKey ?? null);
  const [detailKey, setDetailKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const startRef = useRef(null);
  const viewedRef = useRef(false);
  const submittingRef = useRef(false);

  const nChars = Object.keys(CHARS).length;
  const nFront = Object.values(CHARS).filter((c) => c.tier === 'front').length;

  // The user vector driving the result screen: fresh answers if we just
  // finished, otherwise the stored one from a previous run.
  const uv = useMemo(() => {
    if (answers.some((a) => a !== null)) return userVector(answers, Q, AXMAX);
    if (Array.isArray(stored?.uv) && stored.uv.length === AXMAX.length) return stored.uv;
    return null;
  }, [answers, stored, Q, AXMAX]);
  const list = useMemo(() => (uv ? ranked(uv, CHARS) : null), [uv, CHARS]);

  useEffect(() => {
    ensureFonts(`vq-fonts-${QUIZ_KEY}`, def.fontsHref);
    document.title = `${def.title.pre}${def.title.em}${def.title.post} · My Personality Quizzes`.replace(/\s+/g, ' ');
    return () => { document.title = 'My Personality Quizzes'; };
  }, [QUIZ_KEY, def]);

  // Route → screen sync (supports back/forward + deep links).
  useEffect(() => {
    if (onResultRoute) {
      if (!stored?.resultKey && !list) {
        navigate(`/quiz/${QUIZ_KEY}`, { replace: true });
        return;
      }
      setFocusKey((k) => k ?? stored?.resultKey ?? list?.[0]?.k ?? null);
      setScreen('result');
    } else if (screen === 'result') {
      setScreen('intro');
    }
  }, [onResultRoute]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (screen !== 'result' || viewedRef.current) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: QUIZ_KEY }, user?.id ?? null);
  }, [screen, user?.id, QUIZ_KEY]);

  const begin = useCallback(() => {
    startRef.current = Date.now();
    setAnswers(new Array(Q.length).fill(null));
    setIdx(0);
    setScreen('quiz');
    track('quiz_started', { quiz: QUIZ_KEY }, user?.id ?? null);
  }, [user?.id, QUIZ_KEY, Q.length]);

  const finish = useCallback(async (finalAnswers) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const vec = userVector(finalAnswers, Q, AXMAX);
    const rankedList = ranked(vec, CHARS);
    const top = rankedList[0];
    const emoji = top.c.emoji ?? def.shareEmoji;

    const result = {
      key: top.k,
      name: top.c.name,
      emoji,
      tagline: top.c.tag,
      description: top.c.desc,
      strengths: top.c.traits,
      // Compat contracts (e.g. cake's trait letter) ride along per-character.
      ...(top.c.store ?? {}),
    };
    // Short-keyed integer scores so the share snapshot keeps them
    // (keys must match ^[A-Za-z0-9]{1,4}$, values finite).
    const scores = Object.fromEntries(vec.map((v, i) => [`a${i}`, Math.round(v * 100)]));
    localStorage.setItem(storageKeyFor(QUIZ_KEY), JSON.stringify({
      quizKey: QUIZ_KEY,
      resultKey: top.k,
      result,
      scores,
      uv: vec,
      overallPct: null,
      completedAt: new Date().toISOString(),
    }));

    if (user && supabase && allowQuizSave()) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: QUIZ_KEY,
          p_result: { resultKey: top.k, name: top.c.name, emoji, tagline: top.c.tag, quizName: def.quizName },
        });
        if (error) throw error;
      } catch (err) {
        console.error(`Failed to save ${QUIZ_KEY} quiz result:`, err);
      }
    }

    const duration_ms = startRef.current ? Date.now() - startRef.current : null;
    track('quiz_completed', { quiz: QUIZ_KEY, result_key: top.k, duration_ms }, user?.id ?? null);

    setFocusKey(top.k);
    submittingRef.current = false;
    navigate(`/quiz/${QUIZ_KEY}/result`, { replace: true });
  }, [user, navigate, QUIZ_KEY, Q, AXMAX, CHARS, def]);

  const pick = useCallback((val) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = val;
      setTimeout(() => {
        if (idx < Q.length - 1) setIdx(idx + 1);
        else finish(next);
      }, REDUCE ? 60 : 340);
      return next;
    });
  }, [idx, finish, Q.length]);

  // ── aura follows the focused screen ──
  const focusChar = focusKey ? CHARS[focusKey] : null;
  const detailChar = detailKey ? CHARS[detailKey] : null;
  const baseAura = def.theme?.baseAura ?? '#cba24a';
  const aura = screen === 'result' && focusChar ? focusChar.aura
    : screen === 'detail' && detailChar ? detailChar.aura
    : baseAura;
  const rootVars = {
    ...(def.theme?.vars ?? {}),
    '--aura': aura,
    '--aura-l': lighten(aura, 0.4),
  };

  const galleryOrder = useMemo(() =>
    Object.keys(CHARS).slice().sort((a, b) => {
      if (CHARS[a].tier !== CHARS[b].tier) return CHARS[a].tier === 'front' ? -1 : 1;
      return 0;
    }), [CHARS]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' });

  // ─── screens ───
  let body = null;

  if (screen === 'intro') {
    body = (
      <section className="intro">
        <div className="seal-mark"><span className="ring" /><span className="ring r2" /><span className="kanji">{def.seal.char}</span></div>
        <p className="eyebrow solo">{def.eyebrow}</p>
        <h1>{def.title.pre}<span className="em">{def.title.em}</span>{def.title.post}</h1>
        <p className="lede">{def.lede}</p>
        <div className="cta">
          <button className="btn btn-primary" onClick={begin}>{def.beginLabel ?? 'Begin'}</button>
          <button className="btn btn-ghost" onClick={() => setScreen('gallery')}>Meet all {nChars} {def.rosterNoun}</button>
          <p className="fine">{getQuizFactsLine(QUIZ_KEY)}</p>
          <p className="fine"><b>{nChars}</b> possible results <span className="dot" /> {nFront} {pluralizeLabel(tierLabels.front, nFront)}{nChars - nFront > 0 && <> <span className="dot" /> {nChars - nFront} {pluralizeLabel(tierLabels.cut, nChars - nFront)}</>}</p>
        </div>
        <button className="linkbtn" onClick={() => navigate('/')}>← All quizzes</button>
      </section>
    );
  }

  if (screen === 'quiz') {
    const q = Q[idx];
    const pct = (idx / Q.length) * 100;
    body = (
      <section className="quiz">
        <div className="progress-row">
          <div className="ptrack"><div className="pfill" style={{ width: `${pct}%` }} /></div>
          <div className="pcount"><b>{String(idx + 1).padStart(2, '0')}</b> / {Q.length}</div>
        </div>
        <p className="qnum">Question {idx + 1}</p>
        <h2 className="qtext" key={idx}>{q.t}</h2>
        <div className="likert">
          <div className="likert-labels"><span className="l">Disagree</span><span>Neutral</span><span className="r">Agree</span></div>
          <div className="dots" role="radiogroup" aria-label="How much do you agree?">
            {LIKERT.map((o) => (
              <button
                key={o.v}
                className="dot"
                data-size={o.size}
                data-side={o.side}
                role="radio"
                aria-checked={answers[idx] === o.v}
                aria-label={o.label}
                onClick={() => pick(o.v)}
              >
                <span className="core" />
              </button>
            ))}
          </div>
        </div>
        <div className="quiz-nav">
          {idx > 0 && (
            <button className="back" onClick={() => setIdx(Math.max(0, idx - 1))}>← Previous</button>
          )}
        </div>
      </section>
    );
  }

  if (screen === 'result' && list && focusChar) {
    const entry = list.find((r) => r.k === focusKey) ?? list[0];
    const top = entry.c;
    const match = matchPct(entry.sim);
    const others = list.filter((r) => r.k !== entry.k).slice(0, 6);
    const shareResult = {
      key: entry.k,
      name: top.name,
      emoji: top.emoji ?? def.shareEmoji,
      tagline: top.tag,
      description: top.desc,
      // Compat contract fields (e.g. cake's trait code) must ride into the
      // share snapshot too, or a shared result computes null compatibility.
      ...(top.store ?? {}),
    };
    const shareScores = uv ? Object.fromEntries(uv.map((v, i) => [`a${i}`, Math.round(v * 100)])) : null;
    // Human labels for the a0..aN axes so the story-card bars read as real
    // spectra (e.g. "Bold", "Analytical") instead of a blank section.
    const shareScoreMeta = Object.fromEntries(SPECTRA.map((sp, i) => [`a${i}`, sp.r]));

    body = (
      <section className="result">
        <p className="eyebrow">Your Match</p>
        <div className="emblem-stage"><Emblem ch={top} size={220} reveal /></div>
        <div className="res-head stagger">
          <div>
            <div className="res-tag">{top.tag}</div>
            <h2 className="res-name">{top.name}</h2>
          </div>
          <div className="res-meta">
            <TierBadge tier={top.tier} labels={tierLabels} />
            <span className="match"><b>{match}%</b> alignment</span>
          </div>
          <div className="res-card">
            <p className="res-desc">{top.desc}</p>
            <div className="traits">{top.traits.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            <div className="relations">
              <RelBlock chars={CHARS} charKey={top.kindred} label="Kindred spirit" />
              <RelBlock chars={CHARS} charKey={top.rival} label="Your foil" />
            </div>
          </div>
          {uv && <Spectra spectra={SPECTRA} vector={uv} heading="Where you landed" />}
          <div className="res-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                track('quiz_retaken', { quiz: QUIZ_KEY }, user?.id ?? null);
                viewedRef.current = false;
                navigate(`/quiz/${QUIZ_KEY}`);
                setScreen('intro');
              }}
            >
              Take it again
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                const txt = def.copyLine(top.name, top.tag, match);
                const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
                if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(done).catch(done);
                else done();
              }}
            >
              {copied ? 'Copied ✓' : 'Copy my result'}
            </button>
            <SharePanel quizType={QUIZ_KEY} result={shareResult} scores={shareScores} scoreMeta={shareScoreMeta} btnColor={def.shareGradient} />
          </div>
          <div className="also">
            <h3 className="also-title">Other close matches</h3>
            <p className="also-hint">Tap any card to see how you line up</p>
            <div className="also-list">
              {others.map((r) => (
                <div
                  key={r.k}
                  className="also-item"
                  role="button"
                  tabIndex={0}
                  aria-label={`See ${r.c.name}`}
                  onClick={() => { setFocusKey(r.k); scrollTop(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFocusKey(r.k); scrollTop(); } }}
                >
                  <Emblem ch={r.c} size={66} noSpin />
                  <div className="an">{r.c.name}</div>
                  <div className="ap">{matchPct(r.sim)}% match</div>
                </div>
              ))}
            </div>
            <button className="linkbtn" onClick={() => { setScreen('gallery'); scrollTop(); }}>Browse all {nChars} {def.rosterNoun} →</button>
          </div>
          <div style={{ marginTop: 28, textAlign: 'left' }}>
            {/* If the visitor arrived from a friend's shared cake/house result and
                just took the quiz, invite them back to see compatibility. */}
            <CompareBanner quizType={QUIZ_KEY} />
            <FeedbackWidget quizKey={QUIZ_KEY} />
            <NextQuizBanner currentQuizKey={QUIZ_KEY} />
          </div>
          <button className="linkbtn" onClick={() => navigate('/dashboard')}>← Back to my results</button>
        </div>
        <p className="footer">{def.disclaimer}</p>
      </section>
    );
  }

  if (screen === 'gallery') {
    body = (
      <section className="gallery">
        <div className="gallery-head">
          <p className="eyebrow solo">The Roster</p>
          <h2 className="gtitle">All {nChars} {def.rosterNoun.charAt(0).toUpperCase() + def.rosterNoun.slice(1)}</h2>
          <p className="gsub">Tap anyone to read their profile and see where they land on each spectrum.</p>
        </div>
        <div className="ggrid">
          {galleryOrder.map((k) => {
            const c = CHARS[k];
            return (
              <button
                key={k}
                className="gcard"
                style={{ '--aura': c.aura, '--aura-l': lighten(c.aura, 0.4) }}
                onClick={() => { setDetailKey(k); setScreen('detail'); scrollTop(); }}
              >
                <Emblem ch={c} size={92} noSpin />
                <div className="gname">{c.name}</div>
                <div className="gtag">{c.tag}</div>
                <TierBadge tier={c.tier} labels={tierLabels} className="gbadge" />
              </button>
            );
          })}
        </div>
        <div className="gallery-nav">
          <button className="btn btn-ghost" onClick={() => { setScreen(onResultRoute ? 'result' : 'intro'); scrollTop(); }}>
            ← Back
          </button>
        </div>
      </section>
    );
  }

  if (screen === 'detail' && detailChar) {
    const c = detailChar;
    body = (
      <section className="result">
        <p className="eyebrow">Profile</p>
        <div className="emblem-stage"><Emblem ch={c} size={210} reveal /></div>
        <div className="res-head stagger">
          <div>
            <div className="res-tag">{c.tag}</div>
            <h2 className="res-name">{c.name}</h2>
          </div>
          <div className="res-meta"><TierBadge tier={c.tier} labels={tierLabels} /></div>
          <div className="res-card">
            <p className="res-desc">{c.desc}</p>
            <div className="traits">{c.traits.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            <div className="relations">
              <RelBlock chars={CHARS} charKey={c.kindred} label="Kindred spirit" />
              <RelBlock chars={CHARS} charKey={c.rival} label="Their foil" />
            </div>
          </div>
          <Spectra spectra={SPECTRA} vector={c.v} heading="Where they land" key={detailKey} />
          <div className="res-actions">
            <button className="btn btn-primary" onClick={() => { setScreen('gallery'); scrollTop(); }}>← All {def.rosterNoun}</button>
            <button className="btn btn-ghost" onClick={begin}>Take the quiz</button>
          </div>
        </div>
      </section>
    );
  }

  // Deep-linked to /quiz/<key>/result with nothing to show: the route→screen
  // effect above is already redirecting to the quiz. Render nothing rather than
  // flashing an empty themed shell for a frame (matches catalog/MBTI behaviour).
  if (onResultRoute && !stored?.resultKey && !list) return null;

  return (
    <div className="nq" style={rootVars}>
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
