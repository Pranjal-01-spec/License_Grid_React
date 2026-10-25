import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, LogIn } from 'lucide-react';

export default function PublicNavbar({ user }) {
  return (
    <header className="public-navbar">
      <Link to="/" className="brand-link">
        <div className="brand-logo-icon">
          <Layers size={22} />
        </div>
        <div className="brand-name">
          LicenseGrid
          <span className="badge">ENTERPRISE</span>
        </div>
      </Link>

      <nav className="nav-links">
        <a href="#features" className="nav-link-item">Features</a>
        <a href="#metrics" className="nav-link-item">Impact</a>
        <a href="#pricing" className="nav-link-item">Plans</a>
      </nav>

      <div className="nav-cta-group">
        {user ? (
          <Link to="/dashboard" className="btn-primary">
            <span>Go to Dashboard</span>
            <ArrowRight size={15} />
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="btn-primary">
              <span>Get Started</span>
              <ArrowRight size={15} />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
