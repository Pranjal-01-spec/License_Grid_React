import React, { useState, useEffect } from 'react';
import { X, Plus, Layers, DollarSign, Users, Tag, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AddToolModal({ isOpen, onClose, onAddTool }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [totalSeats, setTotalSeats] = useState('10');
  const [notes, setNotes] = useState('');
  const [vendorUrl, setVendorUrl] = useState('');

  const categoryPresets = [
    'Design',
    'Developer Tools',
    'Communication',
    'Productivity',
    'Analytics',
    'Security'
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !monthlyCost || !totalSeats) return;

    const newTool = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      monthlyCost: Number(monthlyCost),
      totalSeats: Number(totalSeats),
      assignedSeats: 0,
      assignments: [],
      notes: notes.trim(),
      vendorUrl: vendorUrl.trim(),
      status: 'Active'
    };

    onAddTool(newTool);

    try {
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    setName('');
    setCategory('Productivity');
    setMonthlyCost('');
    setTotalSeats('10');
    setNotes('');
    setVendorUrl('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-dialog-header">
          <h2>
            <Plus size={19} style={{ color: 'var(--accent-sky)' }} />
            Add Software License
          </h2>
          <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="add-name">
              <Layers size={13} /> Tool / Vendor Name *
            </label>
            <input
              id="add-name"
              type="text"
              placeholder="e.g. Linear, Figma, AWS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="add-category">
              <Tag size={13} /> Category *
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
              {categoryPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setCategory(preset)}
                  style={{
                    background: category === preset ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: category === preset ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                    color: category === preset ? '#ffffff' : 'var(--text-secondary)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              id="add-category"
              type="text"
              placeholder="e.g. Developer Tools"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="add-cost">
                <DollarSign size={13} /> Monthly Cost ($) *
              </label>
              <input
                id="add-cost"
                type="number"
                placeholder="250"
                min="0"
                value={monthlyCost}
                onChange={(e) => setMonthlyCost(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-seats">
                <Users size={13} /> Total Seats Purchased *
              </label>
              <input
                id="add-seats"
                type="number"
                placeholder="15"
                min="1"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="add-vendor">
              <FileText size={13} /> Vendor URL (Optional)
            </label>
            <input
              id="add-vendor"
              type="url"
              placeholder="https://..."
              value={vendorUrl}
              onChange={(e) => setVendorUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="add-notes">
              <FileText size={13} /> Purpose / Department Scope
            </label>
            <textarea
              id="add-notes"
              rows={2}
              placeholder="Engineering backlog, CI/CD pipeline, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
            <Plus size={16} />
            <span>Add to Corporate Inventory</span>
          </button>
        </form>
      </div>
    </div>
  );
}
