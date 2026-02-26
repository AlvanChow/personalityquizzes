import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BigFiveProvider } from './contexts/BigFiveContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';
import { track } from './utils/analytics';

// Landing is loaded eagerly since it's the entry point for most users.
import Landing from './pages/Landing';

// All other pages are lazy-loaded so the initial bundle stays small.
const Assessment = lazy(() => import('./pages/Assessment'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CakeQuiz = lazy(() => import('./pages/CakeQuiz'));
const CakeResult = lazy(() => import('./pages/CakeResult'));
const MBTIQuiz = lazy(() => import('./pages/MBTIQuiz'));
const MBTIResult = lazy(() => import('./pages/MBTIResult'));
const EnneagramQuiz = lazy(() => import('./pages/EnneagramQuiz'));
const EnneagramResult = lazy(() => import('./pages/EnneagramResult'));
const BigFiveDeepQuiz = lazy(() => import('./pages/BigFiveDeepQuiz'));
const MBTIDeepQuiz = lazy(() => import('./pages/MBTIDeepQuiz'));
const EnneagramDeepQuiz = lazy(() => import('./pages/EnneagramDeepQuiz'));
const Profile = lazy(() => import('./pages/Profile'));
const Frameworks = lazy(() => import('./pages/Frameworks'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Tracks page_view on every route change. Must live inside BrowserRouter and
// AuthProvider so it can access both useLocation and useAuth.
// prevPathRef prevents duplicate events in React 19 StrictMode double-invoke.
function RouteTracker() {
  const location = useLocation();
  const { user } = useAuth();
  const prevPathRef = useRef(null);

  useEffect(() => {
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;
    track('page_view', { path: location.pathname }, user?.id ?? null);
  }, [location.pathname, user?.id]);

  return null;
}

// Shows a spinner while auth session is being resolved so pages never flash blank.
function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  const fallback = (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <RouteTracker />
      <Suspense fallback={fallback}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/cake" element={<CakeQuiz />} />
          <Route path="/quiz/cake/result" element={<CakeResult />} />
          <Route path="/quiz/mbti" element={<MBTIQuiz />} />
          <Route path="/quiz/mbti/result" element={<MBTIResult />} />
          <Route path="/quiz/enneagram" element={<EnneagramQuiz />} />
          <Route path="/quiz/enneagram/result" element={<EnneagramResult />} />
          <Route path="/quiz/big5-deep" element={<BigFiveDeepQuiz />} />
          <Route path="/quiz/mbti-deep" element={<MBTIDeepQuiz />} />
          <Route path="/quiz/enneagram-deep" element={<EnneagramDeepQuiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/how-it-works" element={<Frameworks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BigFiveProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </BigFiveProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
