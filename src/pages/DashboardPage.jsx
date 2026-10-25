import React, { useState, useMemo } from 'react';
import AnalyticsBanner from '../components/AnalyticsBanner';
import ToolCard from '../components/ToolCard';
import AddToolModal from '../components/AddToolModal';
import ManageToolModal from '../components/ManageToolModal';
import SeatsModal from '../components/SeatsModal';
import { 
  Search, 
  Plus, 
  Download, 
  RotateCcw, 
  ArrowUpDown, 
  PackageOpen, 
  Sparkles,
  LogIn
} from 'lucide-react';

export default function DashboardPage({
  user,
  onLogin,
  tools,
  onAddTool,
  onUpdateTool,
  onDeleteTool,
  onAssignSeat,
  onRevokeSeat,
  onExportData,
  onResetData,
  setActivePage
}) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedToolForManage, setSelectedToolForManage] = useState(null);
  const [isSeatsOpen, setIsSeatsOpen] = useState(false);
  const [selectedToolForSeats, setSelectedToolForSeats] = useState(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set();
    tools.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, [tools]);

  // Filtered & Sorted Tools
  const filteredTools = useMemo(() => {
    let result = tools.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.assignments &&
          tool.assignments.some(
            (emp) =>
              emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              emp.department.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'cost-desc') {
      result.sort((a, b) => Number(b.monthlyCost || 0) - Number(a.monthlyCost || 0));
    } else if (sortBy === 'cost-asc') {
      result.sort((a, b) => Number(a.monthlyCost || 0) - Number(b.monthlyCost || 0));
    } else if (sortBy === 'usage-desc') {
      result.sort((a, b) => {
        const aAssigned = a.assignments ? a.assignments.length : (a.assignedSeats || 0);
        const aUsage = a.totalSeats ? aAssigned / a.totalSeats : 0;
        const bAssigned = b.assignments ? b.assignments.length : (b.assignedSeats || 0);
        const bUsage = b.totalSeats ? bAssigned / b.totalSeats : 0;
        return bUsage - aUsage;
      });
    }

    return result;
  }, [tools, searchQuery, selectedCategory, sortBy]);

  const handleQuickDemoAdmin = () => {
    onLogin({
      name: 'Alex Rivera (IT Admin)',
      email: 'admin@licensegrid.internal',
      isLoggedIn: true
    });
  };

  return (
    <div className="dashboard-view-container">
      {/* Guest Mode Banner if not logged in */}
      {!user && (
        <div style={{
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-sky)' }} />
            <span style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
              <strong>Interactive Demo Mode:</strong> You are previewing live software subscriptions & telemetry.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={handleQuickDemoAdmin}
              className="btn-primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              <span>Instant Admin Login</span>
            </button>
            <button
              onClick={() => setActivePage('login')}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      )}

      {/* Metrics Banner */}
      <AnalyticsBanner tools={tools} />

      {/* Controls Bar: Search, Category Chips, Sort, Reset & Add */}
      <section className="inventory-controls-panel">
        <div className="controls-row-main">
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search software by tool name, category, or assigned employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.85rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="default" style={{ background: '#0f172a' }}>Default Sort</option>
                <option value="name-asc" style={{ background: '#0f172a' }}>Name (A &rarr; Z)</option>
                <option value="cost-desc" style={{ background: '#0f172a' }}>Monthly Cost (High &rarr; Low)</option>
                <option value="cost-asc" style={{ background: '#0f172a' }}>Monthly Cost (Low &rarr; High)</option>
                <option value="usage-desc" style={{ background: '#0f172a' }}>Seat Utilization %</option>
              </select>
            </div>

            <button
              onClick={onResetData}
              className="btn-secondary"
              style={{ padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}
              title="Reset inventory to default sample data"
            >
              <RotateCcw size={13} />
              <span>Reset Data</span>
            </button>

            <button
              onClick={() => setIsAddOpen(true)}
              className="btn-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
            >
              <Plus size={14} />
              <span>Add Software</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="category-filter-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span style={{ marginLeft: '5px', opacity: 0.65, fontSize: '0.72rem' }}>
                  ({tools.filter((t) => t.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Software Inventory Grid */}
      <main className="software-cards-grid">
        {filteredTools.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '4rem 1.5rem',
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              margin: '0 auto 1rem'
            }}>
              <PackageOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.4rem' }}>
              No software matched your query
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search query or reset active category filters.'
                : 'Your license grid is currently empty. Add your first software subscription above.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onOpenSeats={(t) => {
                setSelectedToolForSeats(t);
                setIsSeatsOpen(true);
              }}
              onOpenManage={(t) => {
                setSelectedToolForManage(t);
                setIsManageOpen(true);
              }}
            />
          ))
        )}
      </main>

      {/* Modals */}
      <AddToolModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTool={onAddTool}
      />

      <ManageToolModal
        isOpen={isManageOpen}
        onClose={() => {
          setIsManageOpen(false);
          setSelectedToolForManage(null);
        }}
        tool={selectedToolForManage}
        onUpdateTool={onUpdateTool}
        onDeleteTool={onDeleteTool}
      />

      <SeatsModal
        isOpen={isSeatsOpen}
        onClose={() => {
          setIsSeatsOpen(false);
          setSelectedToolForSeats(null);
        }}
        tool={selectedToolForSeats}
        onAssignSeat={onAssignSeat}
        onRevokeSeat={onRevokeSeat}
      />
    </div>
  );
}
