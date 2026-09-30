import { useState } from 'react'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './pages/Login.jsx'
import PasswordChangePage from './pages/PasswordChangePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { authApi } from './services/api.js'

function App() {
  const [session, setSession] = useState(() => authApi.getSession())
  const [authView, setAuthView] = useState('login')

  async function handleLogin(credentials) {
    const nextSession = await authApi.signIn(credentials)
    setSession(nextSession)
  }

  async function handleRegister(credentials) {
    await authApi.signUp(credentials)
    const nextSession = await authApi.signIn(credentials)
    setSession(nextSession)
  }

  async function handlePasswordChange(credentials) {
    const nextSession = await authApi.changePassword(credentials)
    setSession(nextSession)
  }

  function handleLogout() {
    authApi.signOut()
    setSession(null)
  }

  if (session?.token && session?.user) {
    if (session.user.must_change_password) {
      return (
        <PasswordChangePage
          username={session.user.username}
          onSubmit={handlePasswordChange}
          onLogout={handleLogout}
        />
      )
    }

    return <AdminDashboard username={session.user.username} role={session.user.role} onLogout={handleLogout} />
  }

  if (authView === 'register') {
    return <RegisterPage onRegister={handleRegister} onShowLogin={() => setAuthView('login')} />
  }

  return <Login onLogin={handleLogin} onShowRegister={() => setAuthView('register')} />
}

export default App
