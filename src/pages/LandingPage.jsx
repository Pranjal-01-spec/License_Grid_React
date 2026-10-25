import React from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

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

        {/* INTERACTIVE PREVIEW WINDOW */}
        <div className="hero-preview-wrapper">
          <div className="preview-window-bar">
            <div className="window-dots">
              <span className="window-dot red"></span>
              <span className="window-dot yellow"></span>
              <span className="window-dot green"></span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              app.licensegrid.internal/dashboard
            </div>
            <button
              onClick={() => setActivePage('dashboard')}
              style={{
                background: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: 'var(--accent-sky)',
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Go to Interactive View</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Quick Live Preview Cards Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Tools</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>{tools.length} Subscriptions</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--status-emerald)' }}>All verified & compliance-ready</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Spend</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>${totalMonthlySpend.toLocaleString()}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-sky)' }}>${(totalMonthlySpend * 12).toLocaleString()} annual run rate</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Seat Capacity</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>{assignedSeats} / {totalSeats}</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--status-emerald)' }}>{totalSeats - assignedSeats} seats available</span>
            </div>
          </div>

          {/* Interactive sample software rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tools.slice(0, 3).map((tool) => {
              const assigned = tool.assignments ? tool.assignments.length : (tool.assignedSeats || 0);
              const percent = Math.min(100, Math.round((assigned / tool.totalSeats) * 100));
              return (
                <div key={tool.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{tool.name}</span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(37, 99, 235, 0.15)', color: '#38bdf8', borderRadius: '4px' }}>
                      {tool.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>${tool.monthlyCost}/mo</span>
                    <div style={{ width: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: '#2563eb' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{percent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
