'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) router.refresh()
  }, [state, router])

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .login-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          padding: 48px 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .login-logo {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          color: var(--navy);
          margin-bottom: 4px;
        }
        .login-logo span { color: var(--orange); }
        .login-subtitle {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 32px;
        }
        .login-card h1 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        .login-card > p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 28px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }
        .login-form label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }
        .login-form input[type="password"] {
          width: 100%;
          padding: 11px 14px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius);
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--text);
          background: var(--white);
          transition: border-color 0.18s;
        }
        .login-form input[type="password"]:focus {
          outline: none;
          border-color: var(--navy);
        }
        .login-error {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #B91C1C;
          border-radius: var(--radius);
          padding: 10px 14px;
          font-size: 0.875rem;
          text-align: left;
        }
        .login-form .btn {
          width: 100%;
          justify-content: center;
          margin-top: 4px;
        }
        .login-form .btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none !important;
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">Hallo<span>Wheels</span></div>
          <p className="login-subtitle">Admin Panel</p>
          <h1>Sign In</h1>
          <p>Enter your admin password to manage costumes and settings.</p>

          <form action={formAction} className="login-form">
            <div>
              <label htmlFor="admin-password">Password</label>
              <input
                type="password"
                id="admin-password"
                name="password"
                required
                autoComplete="current-password"
                autoFocus
                aria-describedby={state?.error ? 'login-error' : undefined}
              />
            </div>

            {state?.error && (
              <p
                id="login-error"
                className="login-error"
                role="alert"
                aria-live="assertive"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
