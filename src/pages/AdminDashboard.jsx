import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { allowAdminFetch } from '../utils/rateLimiter';
import UserMenu from '../components/UserMenu';
import {
  Users, Activity, BarChart2, CheckCircle,
  RefreshCw, ChevronLeft, Shield,
} from 'lucide-react';

// ─── helpers ─────────────────────────────────────────────────────────────────

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function fmtTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function quizCompletedCount(quizResults, key) {
  if (!quizResults) return false;
  return !!quizResults[key];
}

const EVENT_COLORS = {
  page_view: 'bg-blue-100 text-blue-700',
  quiz_started: 'bg-yellow-100 text-yellow-700',
  quiz_completed: 'bg-green-100 text-green-700',
  baseline_completed: 'bg-emerald-100 text-emerald-700',
  auth_sign_in_completed: 'bg-purple-100 text-purple-700',
  auth_sign_out: 'bg-gray-100 text-gray-600',
  hero_cta_clicked: 'bg-orange-100 text-orange-700',
  quiz_retaken: 'bg-pink-100 text-pink-700',
};

function EventBadge({ event }) {
  const cls = EVENT_COLORS[event] ?? 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {event.replace(/_/g, ' ')}
    </span>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [eventCounts, setEventCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    if (!supabase) return;
    // Rate limit admin dashboard refreshes (max 5 per 30s)
    if (!allowAdminFetch()) {
      setError('Too many refreshes. Please wait a moment before trying again.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const todayStr = startOfToday();

      const [
        totalUsersRes,
        todayUsersRes,
        baselineRes,
        eventsTodayRes,
        recentEventsRes,
        recentUsersRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayStr),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('baseline_completed', true),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).gte('created_at', todayStr),
        supabase.from('analytics_events').select('id, session_id, user_id, event, properties, created_at').order('created_at', { ascending: false }).limit(200),
        supabase.from('profiles').select('id, display_name, avatar_url, baseline_completed, quiz_results, created_at').order('created_at', { ascending: false }).limit(30),
      ]);

      // Compute active users today from recent events
      const todayEvents = (recentEventsRes.data ?? []).filter(e => e.created_at >= todayStr);
      const activeToday = new Set(todayEvents.map(e => e.user_id).filter(Boolean)).size;

      // Event type breakdown from last 200 events
      const counts = {};
      for (const e of recentEventsRes.data ?? []) {
        counts[e.event] = (counts[e.event] ?? 0) + 1;
      }
      const sortedCounts = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([event, count]) => ({ event, count }));

      setStats({
        totalUsers: totalUsersRes.count ?? 0,
        todayUsers: todayUsersRes.count ?? 0,
        baselineCompleted: baselineRes.count ?? 0,
        eventsToday: eventsTodayRes.count ?? 0,
        activeToday,
      });
      setEvents(recentEventsRes.data ?? []);
      setUsers(recentUsersRes.data ?? []);
      setEventCounts(sortedCounts);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message ?? 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      fetchData();
    }
  }, [adminLoading, isAdmin, fetchData]);

  // ── guards ──────────────────────────────────────────────────────────────────

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Shield className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 font-medium">Sign in to access the admin dashboard.</p>
        <UserMenu />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Shield className="w-12 h-12 text-red-300" />
        <p className="text-xl font-semibold text-gray-800">Access Denied</p>
        <p className="text-gray-500 text-sm">Your account doesn't have admin privileges.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Go home
        </button>
      </div>
    );
  }

  // ── layout ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Go home"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-500" />
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                Updated {fmtTime(lastRefresh.toISOString())}
              </span>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Overview stats */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats?.totalUsers}
              sub={`+${stats?.todayUsers ?? 0} today`}
              color="bg-blue-50 text-blue-500"
            />
            <StatCard
              icon={Activity}
              label="Active Today"
              value={stats?.activeToday}
              sub="unique logged-in users"
              color="bg-emerald-50 text-emerald-500"
            />
            <StatCard
              icon={BarChart2}
              label="Events Today"
              value={stats?.eventsToday}
              sub="all event types"
              color="bg-orange-50 text-orange-500"
            />
            <StatCard
              icon={CheckCircle}
              label="Baselines Done"
              value={stats?.baselineCompleted}
              sub={`of ${stats?.totalUsers ?? 0} users`}
              color="bg-purple-50 text-purple-500"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent events feed */}
          <section className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Recent Activity
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {loading && events.length === 0 ? (
                <div className="py-12 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No events yet.</p>
              ) : (
                events.slice(0, 100).map((ev) => (
                  <div key={ev.id} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <EventBadge event={ev.event} />
                        {ev.properties?.path && (
                          <span className="text-xs text-gray-400 font-mono truncate max-w-[160px]">
                            {ev.properties.path}
                          </span>
                        )}
                        {ev.properties?.quiz_type && (
                          <span className="text-xs text-gray-400">{ev.properties.quiz_type}</span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                        <span title={ev.user_id ?? 'anonymous'}>
                          {ev.user_id ? `user …${ev.user_id.slice(-6)}` : 'anonymous'}
                        </span>
                        <span>·</span>
                        <span title={ev.created_at}>{fmtTime(ev.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Sidebar: event breakdown + quiz funnel */}
          <aside className="space-y-6">
            {/* Event type breakdown */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Event Breakdown
                <span className="ml-1 font-normal normal-case text-gray-400">(last 200)</span>
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2.5">
                {loading && eventCounts.length === 0 ? (
                  <div className="py-4 flex justify-center">
                    <div className="w-5 h-5 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
                  </div>
                ) : eventCounts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No events.</p>
                ) : (
                  (() => {
                    const max = eventCounts[0]?.count ?? 1;
                    return eventCounts.map(({ event, count }) => (
                      <div key={event}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 truncate">{event.replace(/_/g, ' ')}</span>
                          <span className="font-semibold text-gray-800 ml-2">{count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-400 rounded-full"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ));
                  })()
                )}
              </div>
            </section>

            {/* Quiz completion funnel */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quiz Funnel</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
                {[
                  { label: 'Big Five (baseline)', key: 'baseline', isBaseline: true },
                  { label: 'MBTI', key: 'mbti' },
                  { label: 'Enneagram', key: 'enneagram' },
                  { label: 'Cake.me', key: 'cake' },
                ].map(({ label, key, isBaseline }) => {
                  const completed = isBaseline
                    ? stats?.baselineCompleted ?? 0
                    : users.filter(u => quizCompletedCount(u.quiz_results, key)).length;
                  const total = stats?.totalUsers ?? 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{label}</span>
                        <span className="font-semibold text-gray-800">
                          {isBaseline ? completed : `${completed}+`}
                          <span className="font-normal text-gray-400 ml-1">/ {total}</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>

        {/* Recent users */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Users</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-center">Big 5</th>
                    <th className="px-4 py-3 text-center">MBTI</th>
                    <th className="px-4 py-3 text-center">Enneagram</th>
                    <th className="px-4 py-3 text-center">Cake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <div className="inline-block w-6 h-6 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">No users yet.</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            {u.avatar_url ? (
                              <img
                                src={u.avatar_url}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                                <Users className="w-3.5 h-3.5 text-sky-400" />
                              </div>
                            )}
                            <span className="font-medium text-gray-800 truncate max-w-[140px]">
                              {u.display_name || <span className="text-gray-400 font-normal">Anonymous</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {fmtTime(u.created_at)}
                        </td>
                        <Dot done={u.baseline_completed} />
                        <Dot done={quizCompletedCount(u.quiz_results, 'mbti')} />
                        <Dot done={quizCompletedCount(u.quiz_results, 'enneagram')} />
                        <Dot done={quizCompletedCount(u.quiz_results, 'cake')} />
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Dot({ done }) {
  return (
    <td className="px-4 py-3 text-center">
      {done ? (
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" title="Completed" />
      ) : (
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-200" title="Not completed" />
      )}
    </td>
  );
}
