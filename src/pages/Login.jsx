import { useState } from 'react'
import './LoginPage.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({ username, password })
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
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Masukkan username" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" required />
          <button type="submit">Masuk</button>
        </form>
      </section>
    </main>
  )
}

export default Login