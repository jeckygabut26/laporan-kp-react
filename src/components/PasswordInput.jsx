import { useState } from 'react'
import './PasswordInput.css'

function PasswordInput({ id, name, value, onChange, autoComplete, placeholder, minLength, required }) {
  const [visible, setVisible] = useState(false)
  const actionLabel = visible ? 'Sembunyikan password' : 'Tampilkan password'

  return (
    <div className="password-input-wrapper">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required={required}
      />
      <button
        className="password-visibility-toggle"
        type="button"
        aria-label={actionLabel}
        aria-pressed={visible}
        title={actionLabel}
        onClick={() => setVisible((current) => !current)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {visible ? (
            <>
              <path d="M3 3l18 18" />
              <path d="M10.6 10.6a2 2 0 002.8 2.8" />
              <path d="M9.9 5.2A11.4 11.4 0 0112 5c6.4 0 10 7 10 7a15.8 15.8 0 01-4.1 4.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1 0 1.9-.1 2.8-.4" />
            </>
          ) : (
            <>
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  )
}

export default PasswordInput