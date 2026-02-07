import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (user) {
      navigate(user.role === 'MANAGER' ? '/manager' : '/employee', {
        replace: true,
      });
    }
  }, [user, navigate]);

  const emailError =
    emailTouched && !email
      ? 'Email is required'
      : emailTouched && !/^[^@]+@[^@]+\.[^@]+$/.test(email)
      ? 'Enter a valid email'
      : '';

  const passwordError =
    passwordTouched && !password
      ? 'Password is required'
      : passwordTouched && password.length < 6
      ? 'Password must be at least 6 characters'
      : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    setAuthError('');

    if (emailError || passwordError || !email || !password) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Invalid credentials');
      }

      const data = await res.json();
      login(data.user, data.token);
      navigate(data.user.role === 'MANAGER' ? '/manager' : '/employee', {
        replace: true,
      });
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-root">
      <div className="login-page">
        <div className="login-illustration">
          <div className="login-illustration-inner">
            <img
              className="login-illustration-img"
              src="/employee-team.svg"
              alt="Employees illustration"
            />
          </div>
        </div>

        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-card-header">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <img
                  src="/employee-team.svg"
                  alt="Employees"
                  className="login-page-logo"
                />
              </div>
              <h1 className="login-title">Login</h1>
              <p className="login-subtitle">
                Continue to Employee Leave Management dashboard
              </p>
            </div>

            {authError && (
              <div className="auth-error-banner">{authError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <div className="field-label">Email address</div>
                <div
                  className={`input-shell ${
                    emailError ? 'error' : emailTouched ? 'focused' : ''
                  }`}
                >
                  <span className="input-prefix">@</span>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                  />
                </div>
                {emailError && <p className="field-error">{emailError}</p>}
              </div>

              <div className="field-group">
                <div className="field-label">Password</div>
                <div
                  className={`input-shell ${
                    passwordError ? 'error' : passwordTouched ? 'focused' : ''
                  }`}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                  />
                  <button
                    type="button"
                    className="input-icon-button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <span className="input-icon-eye" />
                  </button>
                </div>
                {passwordError && <p className="field-error">{passwordError}</p>}
              </div>

              <div className="login-meta-row">
                <span className="link-muted">Forgot password?</span>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting ? 'Signing in…' : 'Login'}
              </button>

              <div className="login-footer">
                New here?{' '}
                <span
                  className="link-primary"
                  onClick={() => navigate('/register')}
                >
                  Create an account
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

