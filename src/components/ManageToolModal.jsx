import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, SlidersHorizontal, AlertTriangle } from 'lucide-react';

export default function ManageToolModal({ isOpen, onClose, tool, onUpdateTool, onDeleteTool }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [status, setStatus] = useState('Active');
  const [notes, setNotes] = useState('');
  const [vendorUrl, setVendorUrl] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (tool) {
      setName(tool.name || '');
      setCategory(tool.category || '');
      setMonthlyCost(tool.monthlyCost !== undefined ? String(tool.monthlyCost) : '');
      setTotalSeats(tool.totalSeats !== undefined ? String(tool.totalSeats) : '');
      setStatus(tool.status || 'Active');
      setNotes(tool.notes || '');
      setVendorUrl(tool.vendorUrl || '');
      setConfirmDelete(false);
    }
  }, [tool]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !tool) return null;

  const currentAssigned = tool.assignments ? tool.assignments.length : (tool.assignedSeats || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTotalSeats = Number(totalSeats) || 1;
    if (parsedTotalSeats < currentAssigned) {
      alert(`Total seats cannot be less than currently assigned seats (${currentAssigned}). Revoke allocated seats first.`);
      return;
    }

    onUpdateTool({
      ...tool,
      name: name.trim(),
      category: category.trim(),
      monthlyCost: Number(monthlyCost) || 0,
      totalSeats: parsedTotalSeats,
      status,
      notes: notes.trim(),
      vendorUrl: vendorUrl.trim()
    });

    onClose();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onDeleteTool(tool.id);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-dialog-header">
          <h2>
            <SlidersHorizontal size={18} style={{ color: 'var(--accent-sky)' }} />
            Configure License: {tool.name}
          </h2>
          <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-name">Software Name *</label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-category">Category *</label>
            <input
              id="edit-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="edit-cost">Monthly Cost ($)</label>
              <input
                id="edit-cost"
                type="number"
                min="0"
                value={monthlyCost}
                onChange={(e) => setMonthlyCost(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-seats">Total Seats</label>
              <input
                id="edit-seats"
                type="number"
                min={Math.max(1, currentAssigned)}
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Currently assigned: {currentAssigned} seats
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-status">Contract Status</label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.7rem 0.9rem',
                color: '#fff',
                outline: 'none'
              }}
            >
              <option value="Active" style={{ background: '#0f172a' }}>Active &bull; Fully Operational</option>
              <option value="Under Review" style={{ background: '#0f172a' }}>Under Review &bull; Renewal Pending</option>
              <option value="Contract Ending" style={{ background: '#0f172a' }}>Contract Ending Soon</option>
              <option value="Deprecated" style={{ background: '#0f172a' }}>Deprecated &bull; Scheduled for Cancellation</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-notes">Internal Notes</label>
            <textarea
              id="edit-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {confirmDelete && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: '#fca5a5'
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>Are you sure? Removing this tool will unassign all {currentAssigned} employee seats.</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              <Save size={15} />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="btn-outline-danger"
              style={{
                background: confirmDelete ? '#ef4444' : undefined,
                color: confirmDelete ? '#ffffff' : undefined
              }}
            >
              <Trash2 size={15} />
              <span>{confirmDelete ? 'Confirm Delete' : 'Delete'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
