import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, Trash2, Building, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SeatsModal({ isOpen, onClose, tool, onAssignSeat, onRevokeSeat }) {
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState('Engineering');
  const [searchEmp, setSearchEmp] = useState('');

  const departmentPresets = [
    'UI/UX Design',
    'Product Team',
    'Backend Core',
    'DevOps',
    'Engineering',
    'Human Resources',
    'Marketing',
    'Data & AI'
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

  if (!isOpen || !tool) return null;

  const assignments = tool.assignments || [];
  const totalSeats = Number(tool.totalSeats) || 1;
  const isAtCapacity = assignments.length >= totalSeats;
  const availableSeats = Math.max(0, totalSeats - assignments.length);

  const filteredAssignments = assignments.filter((emp) =>
    emp.name.toLowerCase().includes(searchEmp.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchEmp.toLowerCase())
  );

  const handleAssign = (e) => {
    e.preventDefault();
    if (!empName.trim() || !empDept.trim()) return;

    if (isAtCapacity) {
      alert(`Capacity Limit: All ${totalSeats} seats for ${tool.name} are occupied.`);
      return;
    }

    onAssignSeat(tool.id, {
      id: Date.now(),
      name: empName.trim(),
      department: empDept.trim(),
      assignedDate: new Date().toISOString().split('T')[0]
    });

    setEmpName('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-dialog-header">
          <h2>
            <Users size={18} style={{ color: 'var(--accent-sky)' }} />
            {tool.name} &bull; Seat Allocations
          </h2>
          <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Capacity Overview Bar */}
        <div style={{
          background: isAtCapacity ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)',
          border: isAtCapacity ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {isAtCapacity ? (
                <>
                  <AlertCircle size={15} style={{ color: '#ef4444' }} />
                  <span>Maximum Seat Capacity Reached</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} style={{ color: 'var(--status-emerald)' }} />
                  <span>Seats Available for Provisioning</span>
                </>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {assignments.length} allocated &bull; {availableSeats} unassigned
            </div>
          </div>
          <div style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: isAtCapacity ? '#ef4444' : '#60a5fa',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {assignments.length} / {totalSeats}
          </div>
        </div>

        {/* Filter assigned members */}
        {assignments.length > 2 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <input
              type="text"
              placeholder="Search assigned employees by name or department..."
              value={searchEmp}
              onChange={(e) => setSearchEmp(e.target.value)}
              className="search-input-field"
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.82rem' }}
            />
          </div>
        )}

        {/* Employee Roster List */}
        <div style={{
          maxHeight: '220px',
          overflowY: 'auto',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {assignments.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1.75rem 1rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-subtle)'
            }}>
              No team members have been assigned to this software yet.
            </div>
          ) : (
            filteredAssignments.map((emp) => (
              <div 
                key={emp.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>
                    {emp.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-sky)', marginTop: '0.15rem' }}>
                    {emp.department} {emp.assignedDate && `\u2022 Assigned ${emp.assignedDate}`}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-outline-danger"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => onRevokeSeat(tool.id, emp.id)}
                  title="Revoke access seat"
                >
                  <Trash2 size={12} />
                  <span>Revoke</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Assign Employee Form */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.2rem'
        }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserPlus size={15} style={{ color: 'var(--primary-light)' }} />
            Assign Employee Seat
          </h4>

          <form onSubmit={handleAssign}>
            <div className="form-group-row">
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="assign-name">
                  <User size={12} /> Employee Full Name
                </label>
                <input
                  id="assign-name"
                  type="text"
                  placeholder="e.g. David Lin"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  disabled={isAtCapacity}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="assign-dept">
                  <Building size={12} /> Department
                </label>
                <select
                  id="assign-dept"
                  value={empDept}
                  onChange={(e) => setEmpDept(e.target.value)}
                  disabled={isAtCapacity}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.7rem 0.9rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  {departmentPresets.map((dept) => (
                    <option key={dept} value={dept} style={{ background: '#0f172a' }}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.65rem', opacity: isAtCapacity ? 0.6 : 1 }}
              disabled={isAtCapacity}
            >
              <UserPlus size={15} />
              <span>{isAtCapacity ? 'Seat Limit Reached' : 'Provision Seat'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
