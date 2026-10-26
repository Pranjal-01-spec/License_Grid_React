import React, { useEffect, useState } from 'react';
import { 
  X, 
  Flame, 
  Package, 
  Film, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import SciFiLaserGridCanvas from './SciFiLaserGridCanvas';
import IsometricConveyorCanvas from './IsometricConveyorCanvas';
import CyberVideoPlayer from './CyberVideoPlayer';

export default function CyberVideoModal({ isOpen, onClose, initialTab = 'laser_grid' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cyber-modal-backdrop" onClick={onClose}>
      <div className="cyber-modal-card" onClick={(e) => e.stopPropagation()} style={{ borderColor: 'rgba(249, 115, 22, 0.45)', boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 60px -10px rgba(234, 88, 12, 0.3)' }}>
        {/* Modal Top Bar */}
        <div className="cyber-modal-header" style={{ background: 'rgba(9, 12, 19, 0.95)', borderBottom: '1px solid rgba(249, 115, 22, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(234, 88, 12, 0.2)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f97316'
            }}>
              <Flame size={18} />
            </div>

            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>4K Sci-Fi Motion Animations</span>
                <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                  OCTANE &bull; 60FPS
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Matte black metallic landscape & isometric tech conveyor assembly
              </div>
            </div>
          </div>

          {/* Modal Header Tabs & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="cyber-tabs" style={{ borderColor: 'rgba(249, 115, 22, 0.25)' }}>
              <button
                className={`cyber-tab-btn ${activeTab === 'laser_grid' ? 'active' : ''}`}
                onClick={() => setActiveTab('laser_grid')}
                style={activeTab === 'laser_grid' ? { background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4), rgba(249, 115, 22, 0.4))', borderColor: '#f97316', color: '#fff' } : {}}
              >
                <Flame size={14} style={{ color: '#f97316' }} />
                <span>1. Sci-Fi Laser Grid</span>
              </button>
              <button
                className={`cyber-tab-btn ${activeTab === 'conveyor' ? 'active' : ''}`}
                onClick={() => setActiveTab('conveyor')}
                style={activeTab === 'conveyor' ? { background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4), rgba(249, 115, 22, 0.4))', borderColor: '#f97316', color: '#fff' } : {}}
              >
                <Package size={14} style={{ color: '#fb923c' }} />
                <span>2. Tech Conveyor</span>
              </button>
              <button
                className={`cyber-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => setActiveTab('video')}
                style={activeTab === 'video' ? { background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4), rgba(249, 115, 22, 0.4))', borderColor: '#f97316', color: '#fff' } : {}}
              >
                <Film size={14} style={{ color: '#fbbf24' }} />
                <span>Video Reel</span>
              </button>
            </div>

            <button className="cyber-modal-close-btn" onClick={onClose} title="Close Cinema Modal (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ minHeight: '520px', background: '#05070a', position: 'relative' }}>
          {activeTab === 'laser_grid' && <SciFiLaserGridCanvas />}
          {activeTab === 'conveyor' && <IsometricConveyorCanvas />}
          {activeTab === 'video' && <CyberVideoPlayer />}
        </div>

        {/* Modal Footer with Credits & Concept Info */}
        <div className="cyber-modal-footer" style={{ borderTop: '1px solid rgba(249, 115, 22, 0.2)' }}>
          <div className="cyber-credits" style={{ color: '#fed7aa' }}>
            <Sparkles size={14} style={{ color: '#f97316' }} />
            <span>
              Dynamic 3D Sci-Fi Laser Grid & Isometric Tech Assembly Conveyor Line
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'monospace', fontSize: '0.72rem', color: '#94a3b8' }}>
            <span>PALETTE: MATTE BLACK &bull; NEON ORANGE</span>
            <span style={{ color: '#fb923c' }}>60 FPS REAL-TIME</span>
          </div>
        </div>
      </div>
    </div>
  );
}
