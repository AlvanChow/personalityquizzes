import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Share2 } from 'lucide-react';
import { hotTakes } from '../data/hotTakes';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track, getSessionId } from '../utils/analytics';
import { safeLocalStorageRead } from '../utils/security';
import { usePageTitle } from '../hooks/usePageTitle';

const VOTES_KEY = 'personalens_hottakes';

function readSavedVotes() {
  const stored = safeLocalStorageRead(VOTES_KEY, null);
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  // Only keep entries for known debates with valid choices.
  const votes = {};
  for (const take of hotTakes) {
    const choice = stored[take.key];
    if (choice === 'a' || choice === 'b') votes[take.key] = choice;
  }
  return votes;
}

// The RPC returns rows like [{ choice: 'a', votes: 123 }, { choice: 'b', votes: 456 }].
// Also tolerates an object shape like { a: 123, b: 456 }. Returns null if unusable.
function normalizeTally(data) {
  if (Array.isArray(data)) {
    const tally = { a: 0, b: 0 };
    for (const row of data) {
      if (row && (row.choice === 'a' || row.choice === 'b')) {
        tally[row.choice] = Number(row.votes) || 0;
      }
    }
    return tally;
  }
  if (data && typeof data === 'object') {
    return { a: Number(data.a) || 0, b: Number(data.b) || 0 };
  }
  return null;
}

function TakeBar({ label, pct, isPick, delay }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className={`text-sm font-semibold flex items-center gap-2 min-w-0 ${isPick ? 'text-gray-800' : 'text-gray-500'}`}>
          <span className="truncate">{label}</span>
          {isPick && (
            <span className="text-[10px] font-extrabold uppercase tracking-wide bg-coral-100 text-coral-500 px-2 py-0.5 rounded-full shrink-0">
              Your take
            </span>
          )}
        </span>
        {pct != null && (
          <span className={`text-sm font-bold shrink-0 ${isPick ? 'text-gray-700' : 'text-gray-400'}`}>{pct}%</span>
        )}
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isPick ? 'bg-coral-400' : 'bg-gray-300'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct ?? (isPick ? 100 : 0)}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function HotTakes() {
  usePageTitle('Hot Takes — My Personality Quizzes');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [votes, setVotes] = useState(readSavedVotes);
  // { [debateKey]: { a: n, b: n } } — missing entry = no live counts available.
  const [tallies, setTallies] = useState({});
  const [copied, setCopied] = useState(false);

  const initialVotesRef = useRef(votes);
  const copiedTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(copiedTimerRef.current);
  }, []);

  // Re-fetch live percentages for debates voted on a previous visit.
  // p_choice: null returns counts without recording a vote.
  useEffect(() => {
    if (!supabase) return;
    const savedKeys = Object.keys(initialVotesRef.current);
    if (savedKeys.length === 0) return;

    let cancelled = false;
    savedKeys.forEach(async (key) => {
      try {
        const { data, error } = await supabase.rpc('vote_hot_take', {
          p_debate: key,
          p_choice: null,
          p_session: getSessionId(),
        });
        if (error) throw error;
        const tally = normalizeTally(data);
        if (tally && !cancelled) {
          setTallies((prev) => ({ ...prev, [key]: tally }));
        }
      } catch {
        // Fetch failed — the saved pick still renders highlighted, just without percentages.
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleVote = useCallback(async (take, choice) => {
    if (votes[take.key]) return;

    const nextVotes = { ...votes, [take.key]: choice };
    setVotes(nextVotes);
    try {
      localStorage.setItem(VOTES_KEY, JSON.stringify(nextVotes));
    } catch { /* storage unavailable — the vote still counts for this visit */ }

    track('hot_take_voted', { debate: take.key, choice }, user?.id ?? null);

    // If the RPC fails, fall back to the user's own vote so the UI never breaks.
    const fallback = { a: 0, b: 0, [choice]: 1 };

    if (!supabase) {
      setTallies((prev) => ({ ...prev, [take.key]: fallback }));
      return;
    }

    try {
      const { data, error } = await supabase.rpc('vote_hot_take', {
        p_debate: take.key,
        p_choice: choice,
        p_session: getSessionId(),
      });
      if (error) throw error;
      const tally = normalizeTally(data);
      setTallies((prev) => ({ ...prev, [take.key]: tally ?? fallback }));
    } catch {
      setTallies((prev) => ({ ...prev, [take.key]: fallback }));
    }
  }, [votes, user?.id]);

  async function handleShare() {
    const lines = hotTakes
      .filter((take) => votes[take.key])
      .map((take) => {
        const pick = take.options.find((opt) => opt.value === votes[take.key]);
        return `${take.emoji} ${take.question} ${pick?.label ?? ''}`;
      })
      .join('\n');
    const text = `My hot takes:\n${lines}\n\nWhat are yours? mypersonalityquizzes.com/hot-takes`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        if (navigator.share) {
          await navigator.share({ title: 'My Hot Takes', text });
        }
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  }

  const answeredCount = hotTakes.filter((take) => votes[take.key]).length;
  const allAnswered = answeredCount === hotTakes.length;

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to all quizzes"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All Quizzes
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Hot Takes 🔥</h1>
          <p className="text-gray-500 mt-1">The internet&rsquo;s greatest debates. Pick your side.</p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {hotTakes.map((take, i) => {
            const pick = votes[take.key];
            const tally = tallies[take.key];
            const total = tally ? tally.a + tally.b : 0;
            const pctA = tally && total > 0 ? Math.round((tally.a / total) * 100) : null;
            const pctB = pctA != null ? 100 - pctA : null;

            return (
              <motion.div
                key={take.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl shrink-0">{take.emoji}</span>
                  <h2 className="text-base font-extrabold text-gray-800 leading-snug">{take.question}</h2>
                </div>

                {!pick ? (
                  <div className="grid grid-cols-2 gap-3">
                    {take.options.map((opt) => (
                      <motion.button
                        key={opt.value}
                        onClick={() => handleVote(take, opt.value)}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-4 rounded-2xl font-bold text-gray-700 bg-white border-2 border-gray-200 hover:border-coral-300 hover:bg-coral-50 shadow-sm transition-all duration-150"
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div>
                    {take.options.map((opt) => (
                      <TakeBar
                        key={opt.value}
                        label={opt.label}
                        pct={opt.value === 'a' ? pctA : pctB}
                        isPick={pick === opt.value}
                        delay={0.1}
                      />
                    ))}
                    {/* Social proof: how many OTHER people have weighed in (the
                        live tally includes the visitor's own vote, so subtract it). */}
                    {tally && total > 0 && (
                      <p className="text-xs font-semibold text-gray-400 mt-2">
                        {total - 1 === 0
                          ? "You're the first to vote 🎉"
                          : `${(total - 1).toLocaleString()} ${total - 1 === 1 ? 'other has' : 'others have'} voted`}
                      </p>
                    )}
                    <p className="text-xs italic text-gray-400 leading-relaxed mt-3">💡 {take.fact}</p>
                  </div>
                )}
              </motion.div>
            );
          })}

          {allAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-6 border border-orange-200 text-center"
            >
              <p className="text-4xl mb-3">🔥</p>
              <h2 className="text-lg font-extrabold text-gray-800 mb-1">You&rsquo;ve picked every side 🔥</h2>
              <p className="text-sm text-gray-500 mb-5">8 debates. 8 opinions. Zero regrets.</p>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleShare}
                  aria-label="Copy your hot takes to share"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 py-3.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Share your takes'}
                </motion.button>
                <motion.button
                  onClick={() => navigate('/')}
                  aria-label="Browse all quizzes"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 text-sm font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Take a real quiz
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
