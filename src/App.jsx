import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddToolModal from './components/AddToolModal';
import Toast from './components/Toast';
import { initialTools } from './data/initialTools';

export default function App() {
  // Page Navigation State: 'home' | 'dashboard' | 'login' | 'register'
  const [activePage, setActivePage] = useState('dashboard');

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('licenseGridUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Tools Database State
  const [tools, setTools] = useState(() => {
    try {
      const saved = localStorage.getItem('licenseGridTools');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialTools;
  });

  // Global Add Modal state (can be triggered from sidebar or page)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Sync tools to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('licenseGridTools', JSON.stringify(tools));
    } catch {
      // safe fallback
    }
  }, [tools]);

  // Auth Handlers
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('licenseGridUser', JSON.stringify(userData));
    addToast(`Signed in successfully as ${userData.name}`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('licenseGridUser');
    addToast('Signed out of organization session', 'info');
  };

  const handleQuickDemo = () => {
    const demoUser = {
      name: 'Alex Rivera (IT Admin)',
      email: 'admin@licensegrid.internal',
      isLoggedIn: true
    };
    handleLogin(demoUser);
    setActivePage('dashboard');
  };

  // Tool Handlers
  const handleAddTool = (newTool) => {
    setTools((prev) => [newTool, ...prev]);
    addToast(`Added "${newTool.name}" to inventory`, 'success');
  };

  const handleUpdateTool = (updatedTool) => {
    setTools((prev) => prev.map((t) => (t.id === updatedTool.id ? updatedTool : t)));
    addToast(`Updated license for "${updatedTool.name}"`, 'success');
  };

  const handleDeleteTool = (toolId) => {
    const target = tools.find((t) => t.id === toolId);
    setTools((prev) => prev.filter((t) => t.id !== toolId));
    addToast(`Removed "${target?.name || 'software'}" from corporate registry`, 'danger');
  };

  // Seat Handlers
  const handleAssignSeat = (toolId, employee) => {
    setTools((prev) =>
      prev.map((tool) => {
        if (tool.id !== toolId) return tool;
        const currentAssignments = tool.assignments || [];
        const nextAssignments = [...currentAssignments, employee];
        return {
          ...tool,
          assignments: nextAssignments,
          assignedSeats: nextAssignments.length
        };
      })
    );
    addToast(`Provisioned seat for ${employee.name} (${employee.department})`, 'success');
  };

  const handleRevokeSeat = (toolId, employeeId) => {
    setTools((prev) =>
      prev.map((tool) => {
        if (tool.id !== toolId) return tool;
        const currentAssignments = tool.assignments || [];
        const nextAssignments = currentAssignments.filter((emp) => emp.id !== employeeId);
        return {
          ...tool,
          assignments: nextAssignments,
          assignedSeats: nextAssignments.length
        };
      })
    );
    addToast('Revoked employee seat license', 'danger');
  };

  // Reset to default mock data
  const handleResetData = () => {
    if (window.confirm('Reset all license subscriptions and allocations to default sample data?')) {
      setTools(initialTools);
      localStorage.setItem('licenseGridTools', JSON.stringify(initialTools));
      addToast('Reset inventory to initial demo dataset', 'info');
    }
  };

  // Export CSV
  const handleExportData = () => {
    if (tools.length === 0) {
      addToast('No software licenses to export', 'danger');
      return;
    }

    const headers = ['Tool Name', 'Category', 'Monthly Cost ($)', 'Annual Cost ($)', 'Assigned Seats', 'Total Seats', 'Occupancy (%)', 'Status'];
    const rows = tools.map((t) => {
      const assigned = t.assignments ? t.assignments.length : (t.assignedSeats || 0);
      const total = t.totalSeats || 1;
      const percent = Math.round((assigned / total) * 100);
      return [
        `"${t.name.replace(/"/g, '""')}"`,
        `"${t.category.replace(/"/g, '""')}"`,
        t.monthlyCost,
        t.monthlyCost * 12,
        assigned,
        total,
        `${percent}%`,
        `"${t.status || 'Active'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LicenseGrid_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Exported ${tools.length} software licenses to CSV`, 'success');
  };

  return (
    <div className="app-shell-layout">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportData={handleExportData}
        onResetData={handleResetData}
        onQuickDemo={handleQuickDemo}
      />

      {/* 2. Main Viewport Content Area */}
      <div className="main-content-viewport">
        <main className="page-container">
          {/* Page 1: Home / Landing */}
          {activePage === 'home' && (
            <LandingPage
              user={user}
              tools={tools}
              setActivePage={setActivePage}
            />
          )}

          {/* Page 2: Dashboard & Inventory */}
          {activePage === 'dashboard' && (
            <DashboardPage
              user={user}
              onLogin={handleLogin}
              tools={tools}
              onAddTool={handleAddTool}
              onUpdateTool={handleUpdateTool}
              onDeleteTool={handleDeleteTool}
              onAssignSeat={handleAssignSeat}
              onRevokeSeat={handleRevokeSeat}
              onExportData={handleExportData}
              onResetData={handleResetData}
              setActivePage={setActivePage}
            />
          )}

          {/* Page 3: Sign In */}
          {activePage === 'login' && (
            <LoginPage
              onLogin={handleLogin}
              setActivePage={setActivePage}
            />
          )}

          {/* Page 4: Register */}
          {activePage === 'register' && (
            <RegisterPage
              onLogin={handleLogin}
              setActivePage={setActivePage}
            />
          )}
        </main>
      </div>

      {/* Global Add Software Modal */}
      <AddToolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTool={handleAddTool}
      />

      {/* Global Notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
