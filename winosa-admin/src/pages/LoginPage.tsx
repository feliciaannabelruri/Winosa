import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        minHeight: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* LEFT - White section dengan logo */}
      <section
        style={{
          flex: 1,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4vh 3vw',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden lg:flex"
      >
        {/* Logo */}
        <div
          style={{
            width: 'min(28vw, 350px)',
            height: 'min(28vw, 350px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4vh',
            position: 'relative',
          }}
        >
          <img
            src="/images/logo.png"
            alt="Winosa Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
              // tampilkan fallback
              const fallback = t.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Fallback placeholder */}
          <div
            style={{
              display: 'none',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(14px, 1.2vw, 18px)',
              color: '#666',
              textAlign: 'center',
              padding: '30px',
              border: '3px dashed #ccc',
            }}
          >
            Logo PT. Winosa
          </div>
        </div>

        <h1
          style={{
            fontSize: 'clamp(24px, 3vw, 48px)',
            fontWeight: 700,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            padding: '0 20px',
          }}
        >
          PT. Winosa Mitra Bharatadjaya
        </h1>
      </section>

      {/* RIGHT - Black + Yellow layer */}
      <section
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background layer black */}
        <div
          style={{
            position: 'absolute',
            top: 0, right: 0,
            width: '100%', height: '100%',
            background: '#1a1a1a',
            borderRadius: 'min(80px, 5vw) 0 0 min(80px, 5vw)',
          }}
        />
        {/* Yellow layer */}
        <div
          style={{
            position: 'absolute',
            top: 0, right: 0,
            width: '95%', height: '100%',
            background: 'linear-gradient(135deg, #d4b942 0%, #c9a832 100%)',
            borderRadius: 'min(80px, 5vw) 0 0 min(80px, 5vw)',
          }}
        />

        {/* Form */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: 'min(540px, 90%)',
            padding: '4vh 3vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 800,
              color: '#1a1a1a',
              marginBottom: '1vh',
              letterSpacing: '-1px',
            }}
          >
            Welcome Back!
          </h2>
          <p
            style={{
              fontSize: 'clamp(14px, 1.5vw, 18px)',
              color: '#1a1a1a',
              marginBottom: '4vh',
              fontStyle: 'italic',
              opacity: 0.8,
            }}
          >
            Sign in to access Winosa admin dashboard
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '2vh' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: 'clamp(14px, 1.5vh, 18px) clamp(18px, 2vw, 24px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: 'clamp(14px, 1.2vw, 16px)',
                    color: '#1a1a1a',
                    background: 'transparent',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '2vh' }}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: 'clamp(14px, 1.5vh, 18px) clamp(18px, 2vw, 24px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: 'clamp(14px, 1.2vw, 16px)',
                    color: '#1a1a1a',
                    background: 'transparent',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  margin: '10px 4px 18px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(220, 38, 38, 0.12)',
                  border: '1px solid rgba(220, 38, 38, 0.35)',
                  color: '#b91c1c',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            {/* Remember me */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '3vh',
                marginTop: '1.5vh',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  gap: '10px',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ display: 'none' }}
                  id="remember-checkbox"
                />
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #1a1a1a',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: rememberMe ? '#1a1a1a' : '#ffffff',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {rememberMe && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 'clamp(13px, 1.2vw, 15px)',
                    color: '#1a1a1a',
                    fontWeight: 500,
                  }}
                >
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 'clamp(16px, 2vh, 20px)',
                background: '#1a1a1a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '3vh',
                letterSpacing: '0.5px',
                opacity: loading ? 0.6 : 1,
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>

            <p
              style={{
                textAlign: 'center',
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                color: '#1a1a1a',
                fontStyle: 'italic',
                opacity: 0.7,
                marginBottom: '3vh',
              }}
            >
              "This page is restricted to authorized administrators"
            </p>

            <p
              style={{
                textAlign: 'center',
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                color: '#1a1a1a',
                opacity: 0.6,
              }}
            >
              © 2026 Winosa
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;