import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowLeft, RotateCcw, LogOut, Calendar, ChevronRight, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBigFive } from '../contexts/BigFiveContext';
import { supabase } from '../lib/supabase';
import { cakeResults } from '../data/cakeResults';
import ScoreBar from '../components/ScoreBar';

const quizResultMaps = {
  cake: { results: cakeResults, route: '/quiz/cake/result' },
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
  const { scores, hasCompleted, resetScores } = useBigFive();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  function handleReset() {
    resetScores();
    navigate('/');
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-6 py-4 border-b border-gray-100 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
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
            className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Personality Profile</h2>
              {!loadingProfile && profile?.updated_at && (
                <span className="text-xs text-gray-300">Updated {formatDate(profile.updated_at)}</span>
              )}
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
            className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-8 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-sky-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">No assessment yet</h2>
            <p className="text-sm text-gray-400 mb-6">Take the Big 5 personality assessment to see your trait scores here.</p>
            <button
              onClick={() => navigate('/assessment')}
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              Take Assessment
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quiz History</h2>
          {completedQuizzes.length > 0 ? (
            <div className="grid gap-3">
              {completedQuizzes.map(([quizKey, result]) => {
                const quizMap = quizResultMaps[quizKey];
                const fullData = quizMap?.results?.[result.resultKey];
                const isClickable = !!(quizMap?.route && hasCompleted);
                return (
                  <button
                    key={quizKey}
                    onClick={() => {
                      if (isClickable) navigate(quizMap.route);
                    }}
                    aria-disabled={!isClickable}
                    className={`bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 w-full text-left transition-all
                      ${isClickable
                        ? 'hover:shadow-md hover:border-gray-200 cursor-pointer'
                        : 'opacity-60 cursor-default'
                      }`}
                  >
                    <span className="text-3xl">{fullData?.emoji || result.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{result.name}</p>
                      <p className="text-xs text-gray-400">{result.quizName} &middot; {result.trait}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 text-center">
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
          transition={{ duration: 0.5, delay: 0.45 }}
          className="space-y-3"
        >
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-400 font-semibold text-sm hover:border-red-200 hover:text-red-500 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Personality Data
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-400 font-semibold text-sm hover:border-gray-200 hover:text-gray-600 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </main>
    </div>
  );
}
