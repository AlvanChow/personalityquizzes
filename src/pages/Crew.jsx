import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Check, X, Share2, Trash2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { usePageTitle } from '../hooks/usePageTitle';
import { getMyResultFor, computeCompatibility } from '../utils/compatibility';
import { cakeResults } from '../data/cakeResults';

const FRAMEWORKS = [
  { key: 'mbti', label: 'MBTI' },
  { key: 'enneagram', label: 'Enneagram' },
  { key: 'cake', label: 'Cake' },
  { key: 'house', label: 'House' },
];

// Map a friend's stored quiz_results entries to the type identity the
// compatibility engine expects for each framework.
function friendTypeFor(types, framework) {
  if (!types) return null;
  if (framework === 'mbti') {
    return types.mbti_deep?.resultKey ?? types.mbti?.resultKey ?? null;
  }
  if (framework === 'enneagram') {
    const k = types.enneagram_deep?.resultKey ?? types.enneagram?.resultKey;
    return k != null ? String(k) : null;
  }
  if (framework === 'cake') {
    const k = types.cake?.resultKey;
    return k ? (cakeResults[k]?.trait ?? null) : null;
  }
  if (framework === 'house') {
    return types.house?.resultKey ?? null;
  }
  return null;
}

function CompatChips({ friendTypes }) {
  const chips = FRAMEWORKS.map(({ key, label }) => {
    const theirs = friendTypeFor(friendTypes, key);
    const mine = getMyResultFor(key);
    if (!theirs || !mine) return null;
    const compat = computeCompatibility(key, theirs, mine.type);
    if (!compat) return null;
    return { key, label, score: compat.score, emoji: compat.emoji };
  }).filter(Boolean);

  if (chips.length === 0) {
    return (
      <p className="text-xs text-gray-400 mt-2">
        Take the same quizzes to unlock your match scores.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {chips.map((c) => (
        <span key={c.key} className="inline-flex items-center gap-1 text-xs font-bold bg-coral-50 text-coral-600 border border-coral-100 px-2 py-0.5 rounded-full">
          {c.label} {c.score}%
        </span>
      ))}
    </div>
  );
}

function TypeBadges({ friendTypes }) {
  const entries = Object.entries(friendTypes ?? {})
    .filter(([, v]) => v && (v.name || v.resultKey))
    .slice(0, 4);
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {entries.map(([k, v]) => (
        <span key={k} className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full">
          <span>{v.emoji}</span>
          {(v.name ?? v.resultKey ?? '').toString().split(' — ')[0].slice(0, 22)}
        </span>
      ))}
    </div>
  );
}

export default function Crew() {
  usePageTitle('My Crew — My Personality Quizzes');
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [rows, setRows] = useState(null);   // null = loading
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const viewedRef = useRef(false);

  const load = useCallback(async () => {
    if (!supabase || !user) return;
    const { data, error: err } = await supabase.rpc('list_crew');
    if (err) {
      console.error('[crew] list failed:', err);
      setError('Could not load your crew. Please try again.');
      setRows([]);
      return;
    }
    setError(null);
    setRows(data ?? []);
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  useEffect(() => {
    if (viewedRef.current || !user) return;
    viewedRef.current = true;
    track('crew_viewed', {}, user.id);
  }, [user]);

  async function respond(row, accept) {
    setBusyId(row.connection_id);
    try {
      const { error: err } = await supabase.rpc('respond_connection', {
        p_connection_id: row.connection_id,
        p_accept: accept,
      });
      if (err) throw err;
      track(accept ? 'crew_request_accepted' : 'crew_request_declined', {}, user.id);
      await load();
    } catch (err) {
      console.error('[crew] respond failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(row) {
    setBusyId(row.connection_id);
    try {
      const { error: err } = await supabase.rpc('remove_connection', {
        p_connection_id: row.connection_id,
      });
      if (err) throw err;
      track('crew_member_removed', {}, user.id);
      setConfirmRemove(null);
      await load();
    } catch (err) {
      console.error('[crew] remove failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setBusyId(null);
    }
  }

  // ── Signed-out gate ──
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-xl bg-coral-50 border border-coral-200 flex items-center justify-center mb-4">
          <Users className="w-7 h-7 text-coral-400" />
        </div>
        <h1 className="text-xl font-extrabold text-gray-800 mb-2">Your Crew</h1>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          Sign in to keep your matches — see how you and your friends compare, all in one place.
        </p>
        <button
          onClick={() => signInWithGoogle('/crew').catch((e) => setError(e?.message ?? 'Sign-in failed.'))}
          className="px-6 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold shadow-md transition-colors"
        >
          Sign in with Google
        </button>
        {error && <p className="text-xs text-red-500 mt-3" role="alert">{error}</p>}
        <button onClick={() => navigate('/')} className="mt-6 text-sm font-semibold text-gray-400 hover:text-gray-600">
          ← Back to quizzes
        </button>
      </div>
    );
  }

  if (authLoading || rows === null) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  const incoming = rows.filter((r) => r.status === 'pending' && r.direction === 'incoming');
  const outgoing = rows.filter((r) => r.status === 'pending' && r.direction === 'outgoing');
  const crew = rows.filter((r) => r.status === 'accepted');

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quizzes
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-coral-50 border border-coral-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-coral-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">My Crew</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Friends you&apos;ve matched with — and how your personalities line up.
        </p>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5 mb-5" role="alert">{error}</p>
        )}

        {/* ── Incoming requests ── */}
        {incoming.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Wants to join your crew
            </h2>
            <div className="space-y-3">
              {incoming.map((r) => (
                <div key={r.connection_id} className="bg-white rounded-xl border border-coral-200 shadow-sm p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-gray-800 truncate">{r.friend_name}</p>
                      <TypeBadges friendTypes={r.friend_types} />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => respond(r, true)}
                        disabled={busyId === r.connection_id}
                        aria-label={`Accept ${r.friend_name}`}
                        className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center disabled:opacity-50 transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => respond(r, false)}
                        disabled={busyId === r.connection_id}
                        aria-label={`Decline ${r.friend_name}`}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center disabled:opacity-50 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── The crew ── */}
        {crew.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Crew · {crew.length}
            </h2>
            <div className="space-y-3">
              {crew.map((r) => (
                <div key={r.connection_id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-gray-800 truncate">{r.friend_name}</p>
                      <TypeBadges friendTypes={r.friend_types} />
                      <CompatChips friendTypes={r.friend_types} />
                    </div>
                    {confirmRemove === r.connection_id ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setConfirmRemove(null)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                        <button
                          onClick={() => remove(r)}
                          disabled={busyId === r.connection_id}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRemove(r.connection_id)}
                        aria-label={`Remove ${r.friend_name} from crew`}
                        className="shrink-0 p-1.5 text-gray-200 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          incoming.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-7">
              <span className="text-4xl block mb-3">🫶</span>
              <h2 className="text-base font-extrabold text-gray-800 mb-1.5">No crew yet</h2>
              <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
                Share a quiz result with a friend — when they compare with you, they can ask to join your crew.
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-bold shadow-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Take a quiz to share
              </button>
            </motion.div>
          )
        )}

        {/* ── Outgoing pending ── */}
        {outgoing.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Waiting on</h2>
            <div className="space-y-2">
              {outgoing.map((r) => (
                <div key={r.connection_id} className="bg-white/70 rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Clock className="w-4 h-4 text-gray-300 shrink-0" />
                    <p className="text-sm font-semibold text-gray-500 truncate">{r.friend_name}</p>
                  </div>
                  <button
                    onClick={() => remove(r)}
                    disabled={busyId === r.connection_id}
                    className="text-xs font-semibold text-gray-400 hover:text-red-400 shrink-0 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
