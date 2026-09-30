import { useState } from 'react'
import PasswordInput from '../components/PasswordInput.jsx'
import './PasswordChangePage.css'

function PasswordChangePage({ username, onSubmit, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password baru harus minimal 8 karakter.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password belum sama.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ currentPassword, newPassword })
    } catch (submitError) {
      setError(submitError.message || 'Password belum dapat diperbarui.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="password-change-screen">
      <section className="password-change-card" aria-labelledby="password-change-title">
        <header className="password-change-header">
          <span className="password-change-mark">LP</span>
          <div>
            <p>SISTEM INFORMASI</p>
            <strong>Laboratorium STT Payakumbuh</strong>
          </div>
          <button type="button" onClick={onLogout}>Keluar</button>
        </header>
        <div className="password-change-content">
          <p className="password-change-eyebrow">KEAMANAN AKUN / {username}</p>
          <h1 id="password-change-title">Buat password baru</h1>
          <p className="password-change-intro">Ubah password awal sebelum melanjutkan ke dashboard.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="current-password">Password saat ini</label>
            <PasswordInput id="current-password" name="currentPassword" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
            <label htmlFor="new-password">Password baru</label>
            <PasswordInput id="new-password" name="newPassword" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            <label htmlFor="confirm-password">Konfirmasi password baru</label>
            <PasswordInput id="confirm-password" name="confirmPassword" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            {error && <p className="password-change-error" role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>{submitting ? 'Memperbarui...' : 'Simpan password baru'}</button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default PasswordChangePage