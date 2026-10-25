import React from 'react';
import { Layers, Plus, LogOut, Download, RotateCcw, User } from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenAddModal, onExportData, onResetData }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="nav-header">
      <div className="brand-wrapper">
        <div className="app-logo-badge" title="LicenseGrid Central Engine">
          <Layers size={24} />
        </div>
        <div className="brand-text">
          <h1>LicenseGrid</h1>
          <p>Software license & seat allocation manager</p>
        </div>
      </div>

      <div className="nav-actions">
        {user && (
          <div className="user-badge" title={user.email}>
            <div className="user-avatar-circle">{getInitials(user.name)}</div>
            <span>{user.name}</span>
          </div>
        )}

        <button 
          onClick={onExportData} 
          className="btn-secondary" 
          title="Export license inventory to CSV"
        >
          <Download size={16} />
          <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>Export</span>
        </button>

        <button 
          onClick={onResetData} 
          className="btn-secondary" 
          title="Reset to default demo data"
        >
          <RotateCcw size={15} />
        </button>

        <button 
          id="add-tool-btn" 
          onClick={onOpenAddModal} 
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Add Software</span>
        </button>

        <button 
          id="logout-btn" 
          onClick={onLogout} 
          className="btn-danger-outline"
          title="Sign out of LicenseGrid"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
