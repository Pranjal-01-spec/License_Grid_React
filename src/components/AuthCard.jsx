import React, { useState } from 'react';
import { Layers, Mail, Lock, User, LogIn, UserPlus, Sparkles } from 'lucide-react';

export default function AuthCard({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || (isSignUp && !name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    const userData = {
      email: email.trim(),
      name: isSignUp ? name.trim() : email.split('@')[0],
      isLoggedIn: true
    };

    onLogin(userData);
  };

  const handleQuickDemo = () => {
    const demoUser = {
      email: 'admin@licensegrid.internal',
      name: 'Alex Rivera',
      isLoggedIn: true
    };
    onLogin(demoUser);
  };

  return (
    <div className="login-view-wrapper">
      <div className="login-card">
        <div className="brand-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div className="app-logo-badge" style={{ width: '56px', height: '56px' }}>
              <Layers size={30} />
            </div>
          </div>
          <h1>LicenseGrid</h1>
          <p>
            {isSignUp
              ? 'Create your administrative account to manage software licenses.'
              : 'Software license & seat allocation manager.'}
          </p>
        </div>

        <button 
          type="button" 
          onClick={handleQuickDemo} 
          className="quick-demo-btn"
          title="Instant 1-click access with demo admin profile"
        >
          <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
          One-Click Demo Sign In (Admin)
        </button>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="user-name">
                <User size={13} /> Full Name *
              </label>
              <input
                id="user-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user-email">
              <Mail size={13} /> Email Address *
            </label>
            <input
              id="user-email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-password">
              <Lock size={13} /> Password *
            </label>
            <input
              id="user-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary form-submit-btn">
            {isSignUp ? (
              <>
                <UserPlus size={16} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="toggle-auth">
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
