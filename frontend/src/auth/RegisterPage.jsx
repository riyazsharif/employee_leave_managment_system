import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email) next.email = 'Email is required';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6)
      next.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password)
      next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage('');
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setServerMessage('Registered successfully. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setServerMessage(err.message);
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
              <h1 className="login-title">Create account</h1>
              <p className="login-subtitle">
                Register as an employee to request leaves
              </p>
            </div>

            {serverMessage && (
              <div className="auth-error-banner">{serverMessage}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <div className="field-label">Full name</div>
                <div className="input-shell">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="field-group">
                <div className="field-label">Register as</div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="EMPLOYEE"
                      checked={role === 'EMPLOYEE'}
                      onChange={(e) => setRole(e.target.value)}
                    />{' '}
                    Employee
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="MANAGER"
                      checked={role === 'MANAGER'}
                      onChange={(e) => setRole(e.target.value)}
                    />{' '}
                    Manager
                  </label>
                </div>
              </div>

              <div className="field-group">
                <div className="field-label">Email address</div>
                <div className="input-shell">
                  <span className="input-prefix">@</span>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="field-group">
                <div className="field-label">Password</div>
                <div className="input-shell">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errors.password && (
                  <p className="field-error">{errors.password}</p>
                )}
              </div>

              <div className="field-group">
                <div className="field-label">Confirm password</div>
                <div className="input-shell">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="field-error">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting ? 'Creating account…' : 'Register'}
              </button>

              <div className="login-footer">
                Already have an account?{' '}
                <span
                  className="link-primary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

