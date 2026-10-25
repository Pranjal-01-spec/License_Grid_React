import React from 'react';
import { Users, DollarSign, Calendar, ExternalLink, SlidersHorizontal } from 'lucide-react';

export default function ToolCard({ tool, onOpenSeats, onOpenManage }) {
  const assignedCount = tool.assignments 
    ? tool.assignments.length 
    : (tool.assignedSeats !== undefined ? tool.assignedSeats : 0);

  const totalSeats = Number(tool.totalSeats) || 1;
  const usagePercentage = Math.min(100, Math.round((assignedCount / totalSeats) * 100));

  let statusClass = 'safe';
  if (usagePercentage >= 95) {
    statusClass = 'critical';
  } else if (usagePercentage >= 75) {
    statusClass = 'warning';
  }

  return (
    <div className="software-card" data-id={tool.id}>
      <div>
        <div className="card-top-header">
          <div className="card-title-area">
            <h3>
              {tool.name}
              {tool.vendorUrl && (
                <a 
                  href={tool.vendorUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  title={`Open ${tool.name} website`}
                  style={{ color: 'var(--text-muted)', display: 'inline-flex' }}
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </h3>
            {tool.notes && <p>{tool.notes}</p>}
          </div>
          <span className="category-tag">{tool.category}</span>
        </div>

        <div className="card-metrics-box">
          <div className="card-data-row">
            <span className="data-row-label">
              <DollarSign size={13} style={{ color: 'var(--accent-sky)' }} />
              Monthly Cost:
            </span>
            <span className="data-row-val">${Number(tool.monthlyCost || 0).toLocaleString()}</span>
          </div>

          <div className="card-data-row">
            <span className="data-row-label">
              <Calendar size={13} style={{ color: 'var(--text-secondary)' }} />
              Annual Commitment:
            </span>
            <span className="data-row-val">${(Number(tool.monthlyCost || 0) * 12).toLocaleString()}</span>
          </div>

          <div className="card-data-row">
            <span className="data-row-label">
              <Users size={13} style={{ color: 'var(--text-secondary)' }} />
              Seat Allocation:
            </span>
            <span className="data-row-val">
              {assignedCount} / {totalSeats} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({usagePercentage}%)</span>
            </span>
          </div>

          <div className="seat-utilization-meter">
            <div className="meter-header-labels">
              <span>Seat Load</span>
              <span>{Math.max(0, totalSeats - assignedCount)} available</span>
            </div>
            <div className="meter-track">
              <div 
                className={`meter-fill ${statusClass}`} 
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-action-footer">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>{tool.status || 'Active'}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem' }}>
          <button 
            className="btn-secondary" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => onOpenSeats(tool)}
            title="Inspect seat allocations"
          >
            <Users size={13} />
            <span>Seats ({assignedCount})</span>
          </button>

          <button 
            className="btn-primary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            onClick={() => onOpenManage(tool)}
            title="Configure license"
          >
            <SlidersHorizontal size={13} />
            <span>Manage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
