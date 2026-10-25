import React, { useState } from 'react';
import { Layers, Mail, Lock, User, Building, UserPlus, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function RegisterPage({ onLogin, setActivePage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('IT & Infrastructure');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields to register.');
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      isLoggedIn: true
    };

    onLogin(userData);
    setActivePage('dashboard');
  };

  const handleQuickDemo = () => {
    const demoUser = {
      name: 'Sarah Connor',
      email: 's.connor@cyberdyne.corp',
      department: 'Engineering Operations',
      isLoggedIn: true
    };
    onLogin(demoUser);
    setActivePage('dashboard');
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        <div style={{ marginBottom: '1.25rem' }}>
          <button 
            onClick={() => setActivePage('home')} 
            className="btn-ghost" 
            style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
            <div className="brand-logo-icon" style={{ width: '48px', height: '48px' }}>
              <Layers size={26} />
            </div>
          </div>
          <h1>Create Workspace</h1>
          <p>Deploy central license tracking for your organization.</p>
        </div>

        <button 
          type="button" 
          onClick={handleQuickDemo} 
          className="quick-demo-btn"
          title="Instant 1-click test registration"
        >
          <Sparkles size={15} />
          <span>Quick Demo Account Setup</span>
        </button>

        <div className="auth-divider">
          <span>Or register manually</span>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-name">
              <User size={13} /> Full Name *
            </label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Elena Rostova"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">
              <Mail size={13} /> Corporate Work Email *
            </label>
            <input
              id="reg-email"
              type="email"
              placeholder="elena@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-dept">
              <Building size={13} /> Primary Department
            </label>
            <select
              id="reg-dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.7rem 0.9rem',
                color: '#fff',
                outline: 'none'
              }}
            >
              <option value="IT & Infrastructure" style={{ background: '#0f172a' }}>IT & Infrastructure</option>
              <option value="Engineering & Dev" style={{ background: '#0f172a' }}>Engineering & DevOps</option>
              <option value="Product & Design" style={{ background: '#0f172a' }}>Product & Design</option>
              <option value="Finance & Operations" style={{ background: '#0f172a' }}>Finance & Operations</option>
              <option value="People & HR" style={{ background: '#0f172a' }}>People & HR</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">
              <Lock size={13} /> Set Master Password *
            </label>
            <input
              id="reg-password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
            <UserPlus size={16} />
            <span>Complete Registration</span>
          </button>
        </form>

        <div className="auth-footer-switch">
          <span>Already have an active account?</span>
          <button 
            onClick={() => setActivePage('login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-sky)', fontWeight: 600, cursor: 'pointer', marginLeft: '0.35rem', textDecoration: 'underline' }}
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}
