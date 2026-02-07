import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import teamLogo from './assets/team-logo.svg';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="layout-shell">
      {user && (
        <header className="layout-topbar">
          <div className="layout-topbar-title">
            <img src={teamLogo} alt="Team Logo" className="layout-topbar-logo" />
            Employee Leave Management
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="pill-small">
              {user.name} · {user.role === 'MANAGER' ? 'Manager' : 'Employee'}
            </span>
            <button className="btn-outline" onClick={logout}>
              Log out
            </button>
          </div>
        </header>
      )}
      <main className="layout-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/employee"
            element={
              <ProtectedRoute roles={['EMPLOYEE']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              user ? (
                <Navigate
                  to={user.role === 'MANAGER' ? '/manager' : '/employee'}
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
      {user && (
        <footer className="layout-footer">
          <div className="layout-footer-content">
            <div className="layout-footer-left">
              © 2026 Employee Leave Management System. All rights reserved.
            </div>
            <div className="layout-footer-right">
              <a href="#" className="layout-footer-link">Privacy Policy</a>
              <a href="#" className="layout-footer-link">Terms of Service</a>
              <a href="#" className="layout-footer-link">Support</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
