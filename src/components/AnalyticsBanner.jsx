import React from 'react';
import { DollarSign, Calendar, Layers, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AnalyticsBanner({ tools }) {
  const totalMonthly = tools.reduce((acc, t) => acc + Number(t.monthlyCost || 0), 0);
  const totalAnnual = totalMonthly * 12;
  const totalTools = tools.length;
  
  const totalSeats = tools.reduce((acc, t) => acc + Number(t.totalSeats || 0), 0);
  const assignedSeats = tools.reduce((acc, t) => {
    const assigned = t.assignments ? t.assignments.length : (t.assignedSeats || 0);
    return acc + Number(assigned);
  }, 0);

  const seatUtilizationRate = totalSeats > 0 ? Math.round((assignedSeats / totalSeats) * 100) : 0;

  return (
    <section className="analytics-grid">
      <div className="metric-card">
        <div className="metric-card-top">
          <span className="metric-card-title">Total Monthly Spend</span>
          <div className="metric-icon-box" style={{ color: 'var(--accent-sky)' }}>
            <DollarSign size={17} />
          </div>
        </div>
        <div className="metric-card-value">${totalMonthly.toLocaleString()}</div>
        <div className="metric-card-footer active">
          <TrendingUp size={13} />
          <span>Active monthly commitments</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card-top">
          <span className="metric-card-title">Annual Run-Rate</span>
          <div className="metric-icon-box" style={{ color: '#60a5fa' }}>
            <Calendar size={17} />
          </div>
        </div>
        <div className="metric-card-value">${totalAnnual.toLocaleString()}</div>
        <div className="metric-card-footer">
          <span>12-month contract projection</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card-top">
          <span className="metric-card-title">Active Tools</span>
          <div className="metric-icon-box" style={{ color: '#38bdf8' }}>
            <Layers size={17} />
          </div>
        </div>
        <div className="metric-card-value">{totalTools}</div>
        <div className="metric-card-footer">
          <ShieldCheck size={13} style={{ color: 'var(--status-emerald)' }} />
          <span>Central inventory tracked</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card-top">
          <span className="metric-card-title">Seat Efficiency</span>
          <div className="metric-icon-box" style={{ color: '#34d399' }}>
            <Users size={17} />
          </div>
        </div>
        <div className="metric-card-value">{seatUtilizationRate}%</div>
        <div className="metric-card-footer">
          <span>{assignedSeats} assigned &bull; {Math.max(0, totalSeats - assignedSeats)} available</span>
        </div>
      </div>
    </section>
  );
}
