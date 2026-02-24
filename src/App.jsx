import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BigFiveProvider } from './contexts/BigFiveContext';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import CakeQuiz from './pages/CakeQuiz';
import CakeResult from './pages/CakeResult';
import MBTIQuiz from './pages/MBTIQuiz';
import MBTIResult from './pages/MBTIResult';
import EnneagramQuiz from './pages/EnneagramQuiz';
import EnneagramResult from './pages/EnneagramResult';
import Profile from './pages/Profile';
import { useAuth } from './contexts/AuthContext';
import { track } from './utils/analytics';

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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BigFiveProvider>
          <ErrorBoundary>
            <RouteTracker />
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
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </ErrorBoundary>
        </BigFiveProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
