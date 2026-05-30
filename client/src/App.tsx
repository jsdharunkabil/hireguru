import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from './store/auth.store'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ScorePage from './pages/ScorePage'
import InterviewPage from './pages/InterviewPage'
import ScoreHistoryPage from './pages/ScoreHistoryPage'
import ProfilePage from './pages/ProfilePage'
import RoadmapPage from './pages/RoadmapPage'
import ResumeTipsPage from './pages/ResumeTipsPage'
import JDTemplatePage from './pages/JDTemplatePage'
import NotFoundPage from './pages/NotFoundPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import CommandPalette from './components/CommandPalette'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <CommandPalette />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/score" element={<PrivateRoute><ScorePage /></PrivateRoute>} />
          <Route path="/score/history" element={<PrivateRoute><ScoreHistoryPage /></PrivateRoute>} />
          <Route path="/interview" element={<PrivateRoute><InterviewPage /></PrivateRoute>} />
          <Route path="/roadmap" element={<PrivateRoute><RoadmapPage /></PrivateRoute>} />
          <Route path="/tips" element={<PrivateRoute><ResumeTipsPage /></PrivateRoute>} />
          <Route path="/jd-templates" element={<PrivateRoute><JDTemplatePage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}