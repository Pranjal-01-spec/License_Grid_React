import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  Sparkles,
  LayoutDashboard,
  Play
} from 'lucide-react';
import CyberShowcase from '../components/cyber/CyberShowcase';

export default function LandingPage({ user, tools, setActivePage }) {
  const totalMonthlySpend = tools.reduce((acc, t) => acc + Number(t.monthlyCost || 0), 0);
  const totalSeats = tools.reduce((acc, t) => acc + Number(t.totalSeats || 0), 0);
  const assignedSeats = tools.reduce((acc, t) => {
    const assigned = t.assignments ? t.assignments.length : (t.assignedSeats || 0);
    return acc + Number(assigned);
  }, 0);

  return (
    <div className="landing-view-container">
      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="hero-pill-announcement">
          <Sparkles size={14} />
          <span>Next-Gen SaaS License Governance &bull; Enterprise Console</span>
        </div>

        <h1 className="hero-main-title">
          Take complete control of every <br />
          <span className="gradient-text">Software License & Seat</span>
        </h1>

        <p className="hero-description">
          Establish full operational visibility, prevent seat over-allocation safeguards, 
          and streamline software budgeting across every engineering, design, and product team.
        </p>

        <div className="hero-actions">
          <button 
            onClick={() => setActivePage('dashboard')} 
            className="btn-primary" 
            style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}
          >
            <LayoutDashboard size={18} />
            <span>Open Live Dashboard</span>
            <ArrowRight size={18} />
          </button>

          <button 
            onClick={() => {
              const reelBtn = document.getElementById('btn-cinema-modal');
              if (reelBtn) reelBtn.click();
            }}
            className="btn-secondary"
            style={{ 
              padding: '0.85rem 1.75rem', 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(249, 115, 22, 0.12)',
              borderColor: 'rgba(249, 115, 22, 0.45)',
              color: '#fb923c'
            }}
          >
            <Play size={16} fill="#f97316" />
            <span>Watch 4K Sci-Fi Reel</span>
          </button>

          {!user && (
            <button 
              onClick={() => setActivePage('register')} 
              className="btn-secondary" 
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              <span>Create Account</span>
            </button>
          )}
        </div>

        {/* 3D CYBER SECURITY ECOSYSTEM ANIMATION & VIDEO REEL */}
        <CyberShowcase
          tools={tools}
          totalMonthlySpend={totalMonthlySpend}
          assignedSeats={assignedSeats}
          totalSeats={totalSeats}
          setActivePage={setActivePage}
        />
      </section>

      {/* PILLARS / KEY FEATURES */}
      <section id="features" className="landing-features-grid">
        <div className="feature-pillar-card">
          <div className="pillar-icon-box">
            <BarChart3 size={22} />
          </div>
          <h3 className="pillar-title">Financial Transparency</h3>
          <p className="pillar-desc">
            Instantly aggregate monthly and annual subscription commitments. Identify zombie tools and prevent renewal surprise costs.
          </p>
        </div>

        <div className="feature-pillar-card">
          <div className="pillar-icon-box">
            <Users size={22} />
          </div>
          <h3 className="pillar-title">Seat Usage Safeguards</h3>
          <p className="pillar-desc">
            Track allocated vs idle seats across departments. Never let licenses sit dormant while new hires request redundant accounts.
          </p>
        </div>

        <div className="feature-pillar-card">
          <div className="pillar-icon-box">
            <ShieldCheck size={22} />
          </div>
          <h3 className="pillar-title">Department Allocation</h3>
          <p className="pillar-desc">
            Tag seats to UI/UX, Backend, DevOps, or HR. Enforce clear ownership, approval chains, and automated revoking protocols.
          </p>
        </div>
      </section>

      {/* PROVEN IMPACT STATS STRIP */}
      <section id="metrics" className="landing-stats-strip">
        <div>
          <div className="strip-stat-value">38%</div>
          <div className="strip-stat-label">Average Annual Spend Saved</div>
        </div>

        <div>
          <div className="strip-stat-value">100%</div>
          <div className="strip-stat-label">Seat Usage Accountability</div>
        </div>

        <div>
          <div className="strip-stat-value">0 min</div>
          <div className="strip-stat-label">Manual Audit Overhead</div>
        </div>

        <div>
          <div className="strip-stat-value">SOC-2</div>
          <div className="strip-stat-label">Access Governance Ready</div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section id="pricing" className="landing-cta-banner">
        <h2>Ready to centralize your software inventory?</h2>
        <p>
          Join modern organizations saving thousands every quarter through proactive seat governance.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActivePage('dashboard')} 
            className="btn-primary" 
            style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}
          >
            <span>Launch Software Dashboard</span>
            <ArrowRight size={16} />
          </button>
          {!user && (
            <button 
              onClick={() => setActivePage('login')} 
              className="btn-secondary" 
              style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}
            >
              <span>Sign In to Existing Workspace</span>
            </button>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="app-footer">
        <div>
          <strong style={{ color: '#fff' }}>LicenseGrid Technologies Inc.</strong> &bull; Enterprise SaaS Governance & Provisioning
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <button onClick={() => setActivePage('home')} className="btn-ghost" style={{ padding: 0 }}>Home</button>
          <button onClick={() => setActivePage('dashboard')} className="btn-ghost" style={{ padding: 0 }}>Dashboard</button>
          <button onClick={() => setActivePage('login')} className="btn-ghost" style={{ padding: 0 }}>Sign In</button>
          <button onClick={() => setActivePage('register')} className="btn-ghost" style={{ padding: 0 }}>Register</button>
        </div>
      </footer>
    </div>
  );
}
