import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BigFiveProvider } from './contexts/BigFiveContext';
import Landing from './pages/Landing';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import CakeQuiz from './pages/CakeQuiz';
import CakeResult from './pages/CakeResult';
import DogQuiz from './pages/DogQuiz';
import DogResult from './pages/DogResult';
import CityQuiz from './pages/CityQuiz';
import CityResult from './pages/CityResult';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BigFiveProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/cake" element={<CakeQuiz />} />
            <Route path="/quiz/cake/result" element={<CakeResult />} />
            <Route path="/quiz/dog" element={<DogQuiz />} />
            <Route path="/quiz/dog/result" element={<DogResult />} />
            <Route path="/quiz/city" element={<CityQuiz />} />
            <Route path="/quiz/city/result" element={<CityResult />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BigFiveProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
