import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowLeft, LogOut, Calendar, ChevronRight, Trophy, Sparkles, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBigFive } from '../contexts/BigFiveContext';
import { supabase } from '../lib/supabase';
import { cakeResults } from '../data/cakeResults';
import { mbtiResults } from '../data/mbtiResults';
import { enneagramResults } from '../data/enneagramResults';
import ScoreBar from '../components/ScoreBar';
import { generateProfileSummary } from '../utils/generateSummary';

// For each quiz type: the result lookup table, the result-page route, a function
// to extract the lookup key from the stored result object, and whether the result
// page requires the Big Five baseline to have been completed first.
const quizResultMaps = {
  cake: { results: cakeResults, route: '/quiz/cake/result', getResultKey: (r) => r.resultKey, requiresBaseline: true },
  mbti: { results: mbtiResults, route: '/quiz/mbti/result', getResultKey: (r) => r.resultKey, requiresBaseline: false },
  enneagram: { results: enneagramResults, route: '/quiz/enneagram/result', getResultKey: (r) => r.resultKey, requiresBaseline: false },
};

const traitOrder = ['O', 'C', 'E', 'A', 'N'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { scores, hasCompleted, resetBaseline } = useBigFive();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  // Tracks which item is pending confirmation: a quiz key ('cake'/'mbti'/'enneagram')
  // or 'baseline' for the Big Five reset.
  const [confirmReset, setConfirmReset] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('created_at, updated_at, quiz_results')
        .eq('id', user.id)
        .maybeSingle();

      if (!cancelled) {
        setProfile(data);
        setLoadingProfile(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, navigate]);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  const quizResults = profile?.quiz_results || {};
  const completedQuizzes = Object.entries(quizResults);

  const quizLocalKeys = {
    cake: 'personalens_cake',
    mbti: 'personalens_mbti',
    enneagram: 'personalens_enneagram',
  };

  async function handleQuizReset(quizKey) {
    localStorage.removeItem(quizLocalKeys[quizKey]);
    const newResults = { ...quizResults };
    delete newResults[quizKey];
    await supabase.from('profiles').update({ quiz_results: newResults }).eq('id', user.id);
    setProfile((prev) => ({ ...prev, quiz_results: newResults }));
    setConfirmReset(null);
  }

  function handleBaselineReset() {
    resetBaseline();
    setConfirmReset(null);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(hasCompleted ? '/dashboard' : '/')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-xl font-extrabold tracking-tight text-gray-800">
            My Personality <span className="text-sky-500">Quizzes</span>
          </span>
          <div className="w-16" />
        </div>
      </header>

      <main className="px-6 py-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${displayName}'s avatar`}
              className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white mb-4"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center shadow-lg border-4 border-white mb-4">
              <User className="w-10 h-10 text-sky-500" />
            </div>
          )}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{displayName}</h1>
          <p className="text-sm text-gray-400 mb-2">{user.email}</p>
          {!loadingProfile && profile?.created_at && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              Member since {formatDate(profile.created_at)}
            </div>
          )}
        </motion.div>

        {hasCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 mb-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Personality Profile</h2>
              <div className="flex items-center gap-3">
                {confirmReset === 'baseline' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmReset(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBaselineReset}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset('baseline')}
                    className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                  >
                    Reset
                  </button>
                )}
                {!loadingProfile && profile?.updated_at && (
                  <span className="text-xs text-gray-300">Updated {formatDate(profile.updated_at)}</span>
                )}
              </div>
            </div>
            {traitOrder.map((trait, i) => (
              <ScoreBar key={trait} trait={trait} value={scores[trait]} delay={i * 0.08} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8 text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-sky-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">No assessment yet</h2>
            <p className="text-sm text-gray-400 mb-6">Take the Big 5 personality assessment to see your trait scores here.</p>
            <button
              onClick={() => navigate('/assessment')}
              className="px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors"
            >
              Take Assessment
            </button>
          </motion.div>
        )}

        {(() => {
          const summary = generateProfileSummary({
            scores,
            hasCompleted,
            quizResults,
          });
          if (!summary) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-violet-200">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-violet-700 uppercase tracking-wider leading-none">Personality Mosaic</h2>
                    <p className="text-[11px] text-violet-400 mt-0.5">Based on {summary.sourceCount} frameworks</p>
                  </div>
                </div>

                {/* Body */}
                <p className="text-sm text-gray-700 leading-relaxed mb-5">{summary.body}</p>

                {/* Strengths */}
                {summary.strengths.length > 0 && (
                  <div className="space-y-2.5 mb-5">
                    {summary.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-snug">{s}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Watch out */}
                {summary.watchOut && (
                  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-snug">{summary.watchOut}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mb-8"
        >
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quiz History</h2>

          {completedQuizzes.length > 0 ? (
            <div className="grid gap-3">
              {completedQuizzes.map(([quizKey, result]) => {
                const quizMap = quizResultMaps[quizKey];
                const fullData = quizMap ? quizMap.results[quizMap.getResultKey(result)] : null;
                const isClickable = !!(quizMap?.route && (!quizMap.requiresBaseline || hasCompleted));
                const isConfirming = confirmReset === quizKey;
                return (
                  <div
                    key={quizKey}
                    className="bg-white rounded-lg border border-gray-200 flex items-center gap-4 px-5 py-4 transition-all hover:border-gray-300 hover:shadow-sm"
                  >
                    {/* Clickable navigation area */}
                    <button
                      onClick={() => { if (isClickable) navigate(quizMap.route); }}
                      disabled={!isClickable}
                      className={`flex items-center gap-4 flex-1 min-w-0 text-left ${isClickable ? 'cursor-pointer' : 'opacity-60 cursor-default'}`}
                    >
                      <span className="text-3xl flex-shrink-0">{fullData?.emoji || result.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{result.name}</p>
                        <p className="text-xs text-gray-400">{result.quizName} &middot; {result.trait}</p>
                      </div>
                      {isClickable && !isConfirming && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                    </button>

                    {/* Per-quiz reset control */}
                    {isConfirming ? (
                      <div className="flex items-center gap-2 flex-shrink-0 pl-2 border-l border-gray-100">
                        <button
                          onClick={() => setConfirmReset(null)}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleQuizReset(quizKey)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmReset(quizKey)}
                        className="flex-shrink-0 p-1 text-gray-200 hover:text-red-400 transition-colors"
                        aria-label={`Remove ${result.quizName} result`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
              <p className="text-sm text-gray-400">No quizzes completed yet. Head to the Dashboard to explore.</p>
              {hasCompleted && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg border border-gray-300 text-gray-500 font-semibold text-sm hover:border-gray-400 hover:text-gray-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </main>
    </div>
  );
}
