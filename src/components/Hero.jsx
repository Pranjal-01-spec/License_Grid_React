import React from 'react';
import { ShieldCheck, Activity, DollarSign, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="grid-hero-section">
      <div className="hero-tagline">
        <Sparkles size={14} />
        <span>Central License Infrastructure</span>
      </div>

      <h2 className="hero-headline">Software License & Seat Orchestration</h2>
      
      <p className="hero-subtext">
        Every internal workspace starts with decentralized tracking. LicenseGrid establishes full 
        operational visibility, seat usage safeguards, and financial transparency before software contracts expand.
      </p>

      <div className="hero-highlights-row">
        <div className="highlight-chip">
          <span className="chip-dot"></span>
          <Activity size={14} style={{ color: '#34d399' }} />
          <span>Real-time Seat Telemetry</span>
        </div>

        <div className="highlight-chip">
          <span className="chip-dot"></span>
          <DollarSign size={14} style={{ color: '#34d399' }} />
          <span>Automated Spend Analytics</span>
        </div>

        <div className="highlight-chip">
          <span className="chip-dot"></span>
          <ShieldCheck size={14} style={{ color: '#34d399' }} />
          <span>Department Allocation Safeguards</span>
        </div>
      </div>
    </section>
  );
}
