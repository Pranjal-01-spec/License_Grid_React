import React, { useState } from 'react';
import {
  Layers,
  Home,
  LayoutDashboard,
  Plus,
  Download,
  RotateCcw,
  LogIn,
  UserPlus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  user,
  onLogout,
  onOpenAddModal,
  onExportData,
  onResetData,
  onQuickDemo
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar with Hamburger Toggle */}
      <div className="mobile-top-bar">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="mobile-menu-btn"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="brand-logo-btn" onClick={() => handleNavClick('home')}>
          <div className="brand-logo-icon">
            <Layers size={18} />
          </div>
          <span className="brand-title-text" style={{ fontSize: '1.1rem' }}>
            LicenseGrid
          </span>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-primary"
          style={{ padding: '0.4rem 0.65rem', fontSize: '0.78rem' }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <button
            onClick={() => handleNavClick('home')}
            className="brand-logo-btn"
            title="LicenseGrid Home"
          >
            <div className="brand-logo-icon">
              <Layers size={22} />
            </div>
            {!isCollapsed && (
              <div className="brand-info">
                <span className="brand-title-text">
                  LicenseGrid
                  <span className="brand-sub-badge">PRO</span>
                </span>
                <span className="brand-tagline-small">SaaS License Governance</span>
              </div>
            )}
          </button>

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="sidebar-collapse-btn"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="sidebar-nav-container">
          {/* Main Views */}
          <div className="sidebar-nav-group">
            {!isCollapsed && <span className="sidebar-group-title">Navigation</span>}

            <button
              onClick={() => handleNavClick('home')}
              className={`sidebar-nav-item ${activePage === 'home' ? 'active' : ''}`}
              title="Home & Product Overview"
            >
              <div className="nav-item-icon">
                <Home size={18} />
              </div>
              {!isCollapsed && <span className="nav-item-label">Home Overview</span>}
            </button>

            <button
              onClick={() => {
                handleNavClick('home');
                setTimeout(() => {
                  const el = document.getElementById('tab-3d-ecosystem');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }}
              className="sidebar-nav-item"
              title="3D Cyber Security Ecosystem"
            >
              <div className="nav-item-icon">
                <ShieldCheck size={18} style={{ color: '#38bdf8' }} />
              </div>
              {!isCollapsed && (
                <div className="nav-item-label-row">
                  <span className="nav-item-label">License Tracker</span>
                  <span className="nav-badge-pill" style={{ background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>3D</span>
                </div>
              )}
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`sidebar-nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
              title="Software Inventory & Seat Allocation"
            >
              <div className="nav-item-icon">
                <LayoutDashboard size={18} />
              </div>
              {!isCollapsed && (
                <div className="nav-item-label-row">
                  <span className="nav-item-label">Dashboard</span>
                  <span className="nav-badge-pill">Live</span>
                </div>
              )}
            </button>
          </div>

          {/* Quick Actions (Dashboard Tools) */}
          <div className="sidebar-nav-group">
            {!isCollapsed && <span className="sidebar-group-title">Quick Actions</span>}

            <button
              onClick={onOpenAddModal}
              className="sidebar-nav-item action-item"
              title="Add New Software Subscription"
            >
              <div className="nav-item-icon primary-tint">
                <Plus size={18} />
              </div>
              {!isCollapsed && <span className="nav-item-label">Add Software</span>}
            </button>

            <button
              onClick={onExportData}
              className="sidebar-nav-item"
              title="Export full inventory to CSV"
            >
              <div className="nav-item-icon">
                <Download size={18} />
              </div>
              {!isCollapsed && <span className="nav-item-label">Export CSV</span>}
            </button>

            <button
              onClick={onResetData}
              className="sidebar-nav-item"
              title="Reset inventory to default sample data"
            >
              <div className="nav-item-icon">
                <RotateCcw size={18} />
              </div>
              {!isCollapsed && <span className="nav-item-label">Reset Sample Data</span>}
            </button>
          </div>

          {/* Quick Demo Assist if not logged in */}
          {!user && !isCollapsed && (
            <div className="sidebar-demo-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-sky)', fontSize: '0.75rem', fontWeight: 700 }}>
                <Sparkles size={13} />
                <span>One-Click Test</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0.65rem', lineHeight: 1.4 }}>
                Instant admin access to test adding & revoking seats.
              </p>
              <button
                onClick={onQuickDemo}
                className="btn-primary"
                style={{ width: '100%', padding: '0.45rem', fontSize: '0.78rem' }}
              >
                <span>Demo Admin Login</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Profile / Auth Section */}
        <div className="sidebar-footer">
          {user ? (
            <div className="sidebar-user-card">
              <div className="user-avatar-initials" title={user.name}>
                {getInitials(user.name)}
              </div>

              {!isCollapsed && (
                <div className="sidebar-user-details">
                  <span className="sidebar-user-name">{user.name}</span>
                  <span className="sidebar-user-email">{user.email || 'Admin'}</span>
                </div>
              )}

              <button
                onClick={onLogout}
                className="sidebar-logout-btn"
                title="Sign out of organization session"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="sidebar-auth-group">
              <button
                onClick={() => handleNavClick('login')}
                className={`sidebar-nav-item ${activePage === 'login' ? 'active' : ''}`}
                title="Sign In to Workspace"
              >
                <div className="nav-item-icon">
                  <LogIn size={18} />
                </div>
                {!isCollapsed && <span className="nav-item-label">Sign In</span>}
              </button>

              <button
                onClick={() => handleNavClick('register')}
                className={`sidebar-nav-item ${activePage === 'register' ? 'active' : ''}`}
                title="Create Workspace Account"
              >
                <div className="nav-item-icon">
                  <UserPlus size={18} />
                </div>
                {!isCollapsed && <span className="nav-item-label">Register Workspace</span>}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
