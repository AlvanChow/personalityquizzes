import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BigFiveProvider>
          <ErrorBoundary>
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
