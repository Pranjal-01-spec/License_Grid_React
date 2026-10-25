import React, { useState } from 'react';
import { Layers, Mail, Lock, LogIn, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin, setActivePage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide your corporate email and password.');
      return;
    }

    const userData = {
      email: email.trim(),
      name: email.split('@')[0],
      isLoggedIn: true
    };

    onLogin(userData);
    setActivePage('dashboard');
  };

  const handleQuickDemo = () => {
    const demoUser = {
      email: 'admin@licensegrid.internal',
      name: 'Alex Rivera (IT Admin)',
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
          <h1>Sign In to Workspace</h1>
          <p>Access your centralized license inventory and seat controls.</p>
        </div>

        <button 
          type="button" 
          onClick={handleQuickDemo} 
          className="quick-demo-btn"
          title="Instant 1-click administrative login"
        >
          <Sparkles size={15} />
          <span>One-Click Demo Admin Access</span>
        </button>

        <div className="auth-divider">
          <span>Or sign in with email</span>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">
              <Mail size={13} /> Corporate Email Address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="login-password">
                <Lock size={13} /> Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo password reset link sent to email.'); }} style={{ fontSize: '0.75rem', color: 'var(--accent-sky)', textDecoration: 'none' }}>
                Forgot?
              </a>
            </div>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
            <LogIn size={16} />
            <span>Authenticate Session</span>
          </button>
        </form>

        <div className="auth-footer-switch">
          <span>Need a new organization workspace?</span>
          <button 
            onClick={() => setActivePage('register')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-sky)', fontWeight: 600, cursor: 'pointer', marginLeft: '0.35rem', textDecoration: 'underline' }}
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
