import React, { useState } from 'react';
import { 
  Flame, 
  Package, 
  Film, 
  LayoutDashboard, 
  ArrowRight,
  Play,
  Zap,
  Sparkles
} from 'lucide-react';
import SciFiLaserGridCanvas from './SciFiLaserGridCanvas';
import IsometricConveyorCanvas from './IsometricConveyorCanvas';
import CyberVideoPlayer from './CyberVideoPlayer';
import CyberVideoModal from './CyberVideoModal';
import './cyber.css';

export default function CyberShowcase({ 
  tools = [], 
  totalMonthlySpend = 0, 
  assignedSeats = 0, 
  totalSeats = 0, 
  setActivePage 
}) {
  // Active Tab: 'laser_grid' | 'conveyor' | 'video' | 'dashboard'
  const [activeTab, setActiveTab] = useState('laser_grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('laser_grid');

  const openCinemaModal = (tab = 'laser_grid') => {
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  return (
    <div className="cyber-showcase-container" style={{
      borderColor: 'rgba(249, 115, 22, 0.35)',
      boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.85), 0 0 35px -5px rgba(234, 88, 12, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    }}>
      {/* Cyber Window Bar */}
      <div className="cyber-header-bar" style={{ background: 'rgba(9, 12, 19, 0.9)' }}>
        {/* Left Side: Indicator & Title */}
        <div className="cyber-header-left">
          <div className="window-dots" style={{ display: 'flex', gap: '6px' }}>
            <span className="window-dot red" style={{ background: '#ef4444' }} />
            <span className="window-dot yellow" style={{ background: '#f59e0b' }} />
            <span className="window-dot green" style={{ background: '#10b981' }} />
          </div>

          <div className="cyber-status-pulse" style={{ background: 'rgba(249, 115, 22, 0.15)', borderColor: 'rgba(249, 115, 22, 0.4)', color: '#fb923c' }}>
            <span className="cyber-pulse-dot" style={{ background: '#f97316', boxShadow: '0 0 10px #f97316' }} />
            <span>Sci-Fi 3D Animations &bull; 60FPS</span>
          </div>

          <div className="cyber-header-title">
            <span style={{ color: '#fed7aa' }}>licensegrid.internal/octane-render</span>
          </div>
        </div>

        {/* Center: Mode Switcher Tabs */}
        <div className="cyber-tabs" style={{ borderColor: 'rgba(249, 115, 22, 0.25)' }}>
          <button
            className={`cyber-tab-btn ${activeTab === 'laser_grid' ? 'active' : ''}`}
            onClick={() => setActiveTab('laser_grid')}
            id="tab-laser-grid"
            style={activeTab === 'laser_grid' ? { background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4) 0%, rgba(249, 115, 22, 0.4) 100%)', borderColor: '#f97316', color: '#ffedd5' } : {}}
          >
            <Flame size={14} style={{ color: '#f97316' }} />
            <span>Video 1: Sci-Fi Laser Grid</span>
          </button>

          <button
            className={`cyber-tab-btn ${activeTab === 'conveyor' ? 'active' : ''}`}
            onClick={() => setActiveTab('conveyor')}
            id="tab-conveyor"
            style={activeTab === 'conveyor' ? { background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4) 0%, rgba(249, 115, 22, 0.4) 100%)', borderColor: '#f97316', color: '#ffedd5' } : {}}
          >
            <Package size={14} style={{ color: '#fb923c' }} />
            <span>Video 2: Isometric Tech Conveyor</span>
          </button>

          <button
            className={`cyber-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
            id="tab-video-reel"
            style={activeTab === 'video' ? { background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4) 0%, rgba(249, 115, 22, 0.4) 100%)', borderColor: '#f97316', color: '#ffedd5' } : {}}
          >
            <Film size={14} style={{ color: '#fbbf24' }} />
            <span>Motion Video Player</span>
          </button>

          <button
            className={`cyber-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            id="tab-dashboard-preview"
          >
            <LayoutDashboard size={14} />
            <span>Software Inventory Grid</span>
          </button>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="cyber-header-actions">
          <button 
            className="cyber-btn-cinema" 
            onClick={() => openCinemaModal(activeTab === 'dashboard' ? 'laser_grid' : activeTab)}
            id="btn-cinema-modal"
            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 0 18px rgba(249, 115, 22, 0.45)' }}
          >
            <Play size={13} fill="#ffffff" />
            <span>Watch Fullscreen Cinema</span>
          </button>

          {setActivePage && (
            <button
              onClick={() => setActivePage('dashboard')}
              style={{
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                color: '#fdba74',
                fontSize: '0.75rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Interactive App</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content Viewport */}
      <div>
        {activeTab === 'laser_grid' && (
          <SciFiLaserGridCanvas onOpenModal={() => openCinemaModal('laser_grid')} />
        )}

        {activeTab === 'conveyor' && (
          <IsometricConveyorCanvas onOpenModal={() => openCinemaModal('conveyor')} />
        )}

        {activeTab === 'video' && (
          <CyberVideoPlayer onOpenModal={() => openCinemaModal('video')} />
        )}

        {activeTab === 'dashboard' && (
          <div style={{ padding: '1.25rem', background: '#080c15' }}>
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
                <span style={{ fontSize: '0.72rem', color: '#fb923c' }}>${(totalMonthlySpend * 12).toLocaleString()} annual run rate</span>
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
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: '#fff' }}>{tool.name}</span>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', borderRadius: '4px' }}>
                        {tool.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>${tool.monthlyCost}/mo</span>
                      <div style={{ width: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: '#f97316' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{percent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Full Cinematic Experience Modal */}
      <CyberVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalInitialTab}
      />
    </div>
  );
}
