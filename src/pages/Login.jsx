import { useState } from 'react'
import PasswordInput from '../components/PasswordInput.jsx'
import './LoginPage.css'

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onLogin({ username, password })
    } catch (loginError) {
      setError(loginError.message || 'Username atau password tidak valid.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="signin-screen">
      <section className="signin-card" aria-label="Login Sistem Jadwal Laboratorium">
        <div className="signin-promo">
          <span className="signin-mark">LP</span>
          <div className="signin-promo-copy">
            <p>SISTEM INFORMASI</p>
            <h2>Jadwal Laboratorium</h2>
            <span>Kelola jadwal praktikum, dosen, mata kuliah, dan laporan laboratorium dengan lebih cepat dan terorganisir.</span>
            <div className="signin-tags"><span>Schedule</span><span>Lecturer</span><span>Lab</span></div>
          </div>
        </div>

        <form className="signin-form" onSubmit={handleSubmit}>
          <p className="signin-eyebrow">MASUK KE AKUN</p>
          <h1>Login Sistem</h1>
          <label htmlFor="login-username">Username</label>
          <input id="login-username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Masukkan username" required />
          <label htmlFor="password">Password</label>
          <PasswordInput id="password" name="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" required />
          {error && <p className="signin-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Memeriksa...' : 'Masuk'}</button>
          <p className="signin-switch">Belum memiliki akun? <button className="signin-text-button" type="button" onClick={onShowRegister}>Daftar</button></p>
        </form>
      </section>
    </main>
  )
}

export default Login