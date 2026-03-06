'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from '../admin.module.css'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    // Fallback sementara kalau DB mati
    if (email === 'admin@winosa.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'dummy-token-dev')
      localStorage.setItem('isAdminLoggedIn', 'true')
      router.push('/admin')
      return
    }
    setError(data.message || 'Invalid email or password')
    return
  }

  localStorage.setItem('adminToken', data.token)
  localStorage.setItem('isAdminLoggedIn', 'true')
  router.push('/admin')
} catch (err) {
  // Fallback kalau backend ga bisa direach
  if (email === 'admin@winosa.com' && password === 'admin123') {
    localStorage.setItem('adminToken', 'dummy-token-dev')
    localStorage.setItem('isAdminLoggedIn', 'true')
    router.push('/admin')
    return
  }
  setError('Cannot connect to server.')
}
  }

  return (
    <div className={styles['login-container']}>
      {/* LEFT */}
      <section className={styles['left-section']}>
        <div className={styles['logo-container']}>
          <Image
            src="/images/logo.png"
            alt="Winosa Logo"
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h1 className={styles['company-name']}>
          PT. Winosa Mitra Bharatadjaya
        </h1>
      </section>

      {/* RIGHT */}
      <section className={styles['right-section']}>
        <div className={styles['background-layer']} />
        <div className={styles['yellow-layer']} />

        <div className={styles['login-form-wrapper']}>
          <h2 className={styles['welcome-text']}>Welcome Back!</h2>
          <p className={styles.subtitle}>
            Sign in to access Winosa admin dashboard
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* EMAIL */}
            <div className={styles['form-group']}>
              <div className={styles['input-wrapper']}>
                <input
                  type="email"
                  className={styles['form-input']}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className={styles['form-group']}>
              <div className={styles['input-wrapper']}>
                <input
                  type="password"
                  className={styles['form-input']}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p className={styles['error-message']}>
                {error}
              </p>
            )}

            {/* REMEMBER */}
            <div className={styles['remember-me-wrapper']}>
              <label className={styles['checkbox-wrapper']}>
                <input
                  type="checkbox"
                  className={styles['checkbox-input']}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className={styles['custom-checkbox']} />
                <span className={styles['remember-label']}>
                  Remember me
                </span>
              </label>
            </div>

            <button
              className={styles['login-button']}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>

            <p className={styles['restriction-note']}>
              "This page is restricted to authorized administrators"
            </p>

            <p className={styles.copyright}>
              © 2026 Winosa
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}