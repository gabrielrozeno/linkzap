import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import RedirectPage from './pages/RedirectPage'
import './index.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  )

  return (
    <Routes>
      {/* Public redirect route - must be first */}
      <Route path="/g/:slug" element={<RedirectPage />} />

      {/* Auth */}
      <Route path="/login" element={user ? <Navigate to="/admin" replace /> : <LoginPage />} />

      {/* Admin (protected) */}
      <Route path="/admin" element={
        <PrivateRoute><AdminPage /></PrivateRoute>
      } />

      {/* Root */}
      <Route path="/" element={<Navigate to={user ? '/admin' : '/login'} replace />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
