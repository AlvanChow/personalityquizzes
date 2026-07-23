import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { BigFiveProvider } from './contexts/BigFiveContext';
import ErrorBoundary from './components/ErrorBoundary';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { useAuth } from './contexts/AuthContext';
import { track } from './utils/analytics';
import { isVectorQuiz } from './data/vectorQuizzes/registry';

// Landing is loaded eagerly since it's the entry point for most users.
import Landing from './pages/Landing';

// All other pages are lazy-loaded so the initial bundle stays small.
const Assessment = lazy(() => import('./pages/Assessment'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MBTIQuiz = lazy(() => import('./pages/MBTIQuiz'));
const MBTIResult = lazy(() => import('./pages/MBTIResult'));
const EnneagramQuiz = lazy(() => import('./pages/EnneagramQuiz'));
const EnneagramResult = lazy(() => import('./pages/EnneagramResult'));
const BigFiveDeepQuiz = lazy(() => import('./pages/BigFiveDeepQuiz'));
const MBTIDeepQuiz = lazy(() => import('./pages/MBTIDeepQuiz'));
const EnneagramDeepQuiz = lazy(() => import('./pages/EnneagramDeepQuiz'));
const Profile = lazy(() => import('./pages/Profile'));
const Frameworks = lazy(() => import('./pages/Frameworks'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SharedResult = lazy(() => import('./pages/SharedResult'));
const Circle = lazy(() => import('./pages/Circle'));
const VectorQuizPage = lazy(() => import('./pages/VectorQuizPage'));
const HotTakes = lazy(() => import('./pages/HotTakes'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CatalogQuiz = lazy(() => import('./pages/CatalogQuiz'));
const CatalogResult = lazy(() => import('./pages/CatalogResult'));
const FlowerPetal = lazy(() => import('./pages/FlowerPetal'));
const Privacy = lazy(() => import('./pages/Privacy'));

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
// Route dispatcher: vector-format quizzes render the immersive experience,
// everything else uses the generic catalog runner/result.
function QuizDispatch({ kind }) {
  const { quizKey } = useParams();
  // key={quizKey} forces a fresh mount per quiz, so run-once state (e.g. a
  // result read from localStorage in a useState initializer) can never leak
  // from one quiz to another if a quiz→quiz link is ever added.
  if (isVectorQuiz(quizKey)) return <VectorQuizPage key={quizKey} />;
  return kind === 'quiz'
    ? <CatalogQuiz key={quizKey} />
    : <CatalogResult key={quizKey} />;
}

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
      <SiteHeader />
      <Suspense fallback={fallback}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/mbti" element={<MBTIQuiz />} />
          <Route path="/quiz/mbti/result" element={<MBTIResult />} />
          <Route path="/quiz/enneagram" element={<EnneagramQuiz />} />
          <Route path="/quiz/enneagram/result" element={<EnneagramResult />} />
          <Route path="/quiz/big5-deep" element={<BigFiveDeepQuiz />} />
          <Route path="/quiz/mbti-deep" element={<MBTIDeepQuiz />} />
          <Route path="/quiz/enneagram-deep" element={<EnneagramDeepQuiz />} />
          <Route path="/hot-takes" element={<HotTakes />} />
          {/* Generic quizzes — static routes above always win over :quizKey.
              Vector-format quizzes (registry) get the immersive experience;
              everything else falls through to the catalog runner. */}
          <Route path="/quiz/:quizKey" element={<QuizDispatch kind="quiz" />} />
          <Route path="/quiz/:quizKey/result" element={<QuizDispatch kind="result" />} />
          <Route path="/exercise/flower-petal" element={<FlowerPetal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/how-it-works" element={<Frameworks />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/s/:shareId" element={<SharedResult />} />
          <Route path="/circle" element={<Circle />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Feature was briefly live as "Crew" — keep old links working. */}
          <Route path="/crew" element={<Navigate to="/circle" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <SiteFooter />
    </>
  );
}

export default function App() {
  return (
    // reducedMotion="user" makes every framer-motion animation respect the OS
    // "reduce motion" setting (the bespoke CSS quiz animations already do).
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <BigFiveProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </BigFiveProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
