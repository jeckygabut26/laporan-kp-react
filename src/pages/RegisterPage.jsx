import { useState } from 'react'
import PasswordInput from '../components/PasswordInput.jsx'
import './LoginPage.css'

function RegisterPage({ onRegister, onShowLogin }) {
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password harus minimal 8 karakter.')
      return
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password belum sama.')
      return
    }

    setSubmitting(true)
    try {
      await onRegister({ fullname, username, password, retypePassword: confirmPassword })
    } catch (registerError) {
      setError(registerError.message || 'Pendaftaran belum berhasil.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="signin-screen">
      <section className="signin-card" aria-label="Registrasi Sistem Jadwal Laboratorium">
        <div className="signin-promo">
          <span className="signin-mark">LP</span>
          <div className="signin-promo-copy">
            <p>SISTEM INFORMASI</p>
            <h2>Akun Laboratorium</h2>
            <span>Daftarkan akun untuk mengelola jadwal dan data laboratorium.</span>
            <div className="signin-tags"><span>Schedule</span><span>Lecturer</span><span>Lab</span></div>
          </div>
        </div>

        <form className="signin-form register-form" onSubmit={handleSubmit}>
          <p className="signin-eyebrow">REGISTRASI PENGGUNA</p>
          <h1>Buat akun</h1>
          <label htmlFor="register-fullname">Nama lengkap</label>
          <input id="register-fullname" name="fullname" autoComplete="name" value={fullname} onChange={(event) => setFullname(event.target.value)} placeholder="Masukkan nama lengkap" maxLength={100} required />
          <label htmlFor="register-username">Username</label>
          <input id="register-username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Buat username" maxLength={50} required />
          <label htmlFor="register-password">Password baru</label>
          <PasswordInput id="register-password" name="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
          <label htmlFor="register-confirm-password">Konfirmasi password</label>
          <PasswordInput id="register-confirm-password" name="retypePassword" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          {error && <p className="signin-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Mendaftarkan...' : 'Daftar'}</button>
          <p className="signin-switch">Sudah memiliki akun? <button className="signin-text-button" type="button" onClick={onShowLogin}>Masuk</button></p>
        </form>
      </section>
    </main>
  )
}

export default RegisterPage