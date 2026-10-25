import React from 'react';
import { Layers, Home, LayoutDashboard, LogIn, UserPlus, LogOut, Plus, Download, Sparkles } from 'lucide-react';

export default function UnifiedNavbar({
  activePage,
  setActivePage,
  user,
  onLogout,
  onOpenAddModal,
  onExportData
}) {
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="unified-site-navbar">
      <div className="navbar-left">
        <button 
          onClick={() => setActivePage('home')} 
          className="brand-logo-btn"
          title="LicenseGrid Home"
        >
          <div className="brand-logo-icon">
            <Layers size={20} />
          </div>
          <span className="brand-title-text">
            LicenseGrid
            <span className="brand-sub-badge">PRO</span>
          </span>
        </button>

        {/* Unified Site Page Navigation Tabs */}
        <nav className="site-nav-tabs">
          <button
            onClick={() => setActivePage('home')}
            className={`site-tab-link ${activePage === 'home' ? 'active' : ''}`}
          >
            <Home size={15} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className={`site-tab-link ${activePage === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
            <span className="tab-pill-count">Live</span>
          </button>
        </nav>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-profile-badge" title={user.email}>
              <div className="user-avatar-initials">{getInitials(user.name)}</div>
              <span className="user-name-text">{user.name}</span>
            </div>

            {activePage === 'dashboard' && (
              <>
                <button
                  onClick={onExportData}
                  className="btn-secondary nav-action-btn"
                  title="Export inventory to CSV"
                >
                  <Download size={14} />
                  <span className="btn-label-desktop">Export CSV</span>
                </button>

                <button
                  onClick={onOpenAddModal}
                  className="btn-primary nav-action-btn"
                >
                  <Plus size={15} />
                  <span>Add Software</span>
                </button>
              </>
            )}

            <button
              onClick={onLogout}
              className="btn-outline-danger nav-action-btn"
              title="Sign out of organization session"
            >
              <LogOut size={14} />
              <span className="btn-label-desktop">Logout</span>
            </button>
          </>
        ) : (
          <div className="auth-nav-group">
            <button
              onClick={() => setActivePage('login')}
              className={`btn-ghost ${activePage === 'login' ? 'active-auth' : ''}`}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => setActivePage('register')}
              className={`btn-primary ${activePage === 'register' ? 'active-auth-btn' : ''}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              <UserPlus size={15} />
              <span>Register</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
