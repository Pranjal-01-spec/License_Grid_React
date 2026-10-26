import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  RotateCw, 
  Eye, 
  Download, 
  Maximize2,
  Radio,
  Cpu
} from 'lucide-react';

export default function CyberEcosystemCanvas({ onOpenModal }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const containerRef = useRef(null);

  // User Interactive Settings
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [showScanlines, setShowScanlines] = useState(true);
  const [pulseCount, setPulseCount] = useState(0);
  const [activeMode, setActiveMode] = useState('ecosystem'); // 'ecosystem' | 'threat_matrix' | 'quantum_shield'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Mouse & Camera Control State
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    rotX: 0.45, // pitch
    rotY: 0.35  // yaw
  });

  // Telemetry real-time values
  const [telemetry, setTelemetry] = useState({
    activeNodes: 48,
    dataRate: '1.84 GB/s',
    integrity: '99.98%',
    packetsPerSec: 1420
  });

  // Pulse Wave Trigger
  const pulsesRef = useRef([]);

  const triggerPulse = useCallback(() => {
    pulsesRef.current.push({
      radius: 5,
      maxRadius: 280,
      alpha: 1,
      color: '#38bdf8'
    });
    setPulseCount(prev => prev + 1);
  }, []);

  // Record 3D Reel directly to downloadable WebM/MP4
  const startRecording = useCallback(() => {
    if (!canvasRef.current || isRecording) return;
    try {
      const stream = canvasRef.current.captureStream(60);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LicenseGrid_Cyber_Security_3D_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordingProgress(0);
      };

      recorder.start();
      setIsRecording(true);

      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setRecordingProgress(Math.min(100, p));
        if (p >= 100) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 500); // 5-second crisp reel
    } catch (err) {
      console.warn('Canvas recorder fallback:', err);
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI display
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 520);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 520;
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // PROCEDURAL 3D ECOSYSTEM SETUP
    // ==========================================
    // Tech Blocks (Procedural cluster inspired by Michael Skripin's Houdini blocks)
    const blocks = [];
    const gridSize = 7;
    const spacing = 46;

    for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
      for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
        const distFromCenter = Math.sqrt(x * x + z * z);
        if (distFromCenter > 3.8 || (Math.abs(x) < 0.8 && Math.abs(z) < 0.8)) continue; // Hollow center for Cyber Shield Core

        blocks.push({
          x: x * spacing + (Math.random() - 0.5) * 8,
          baseY: (Math.random() - 0.5) * 20,
          z: z * spacing + (Math.random() - 0.5) * 8,
          w: 24 + Math.random() * 8,
          h: 20 + Math.random() * 45,
          d: 24 + Math.random() * 8,
          freq: 0.8 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          amplitude: 15 + Math.random() * 25,
          colorType: distFromCenter < 2 ? 'core' : (Math.random() > 0.65 ? 'flare' : 'kevlar'),
          beaconTimer: Math.random() * 100
        });
      }
    }

    // Interconnecting Conduits & Traveling Data Packets
    const conduits = [];
    for (let i = 0; i < blocks.length; i += 2) {
      const b1 = blocks[i];
      const targetIdx = (i + 3) % blocks.length;
      const b2 = blocks[targetIdx];
      conduits.push({
        b1,
        b2,
        packetT: Math.random(),
        speed: 0.006 + Math.random() * 0.012,
        color: Math.random() > 0.5 ? '#38bdf8' : '#10b981'
      });
    }

    // Floating Cyber Dust & Starfield
    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 350,
        z: (Math.random() - 0.5) * 600,
        vy: -0.4 - Math.random() * 0.6,
        size: 1 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.7
      });
    }

    // Central 3D Shield Geometry Definition
    const shieldVertices = [
      { x: 0, y: -45, z: 0 },       // Top crest
      { x: 28, y: -30, z: 6 },      // Top right
      { x: 34, y: 5, z: 10 },       // Mid right
      { x: 0, y: 48, z: 12 },       // Bottom tip
      { x: -34, y: 5, z: 10 },      // Mid left
      { x: -28, y: -30, z: 6 },     // Top left
      { x: 0, y: 0, z: 18 }         // Forward apex
    ];

    const shieldEdges = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6]
    ];

    // ==========================================
    // 3D PROJECTION HELPER
    // ==========================================
    const cameraDistance = 460;

    function project3D(x, y, z, rotX, rotY) {
      // Rotate around Y-axis (Yaw)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate around X-axis (Pitch)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      // Perspective projection
      const depth = cameraDistance + z2;
      if (depth <= 10) return null;
      const fov = 420 / depth;

      return {
        x: width / 2 + x1 * fov,
        y: height / 2 + y2 * fov,
        depth: z2,
        scale: fov
      };
    }

    let time = 0;

    // ==========================================
    // ANIMATION RENDER LOOP
    // ==========================================
    const render = () => {
      time += 0.018 * rotationSpeed;

      // Smooth camera interpolation
      const mouse = mouseRef.current;
      mouse.rotY += (mouse.targetX - mouse.rotY) * 0.05 + 0.002 * rotationSpeed;
      mouse.rotX += (mouse.targetY - mouse.rotX) * 0.05;

      // Clear with deep space obsidian canvas
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, width, height);

      // Vignette radial glow at center
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, width * 0.65
      );
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.12)');
      gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
      gradient.addColorStop(1, 'rgba(6, 9, 17, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Perspective Floor Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';
      ctx.lineWidth = 1;
      const gridExtent = 320;
      const gridStep = 40;
      const floorY = 75;

      for (let gx = -gridExtent; gx <= gridExtent; gx += gridStep) {
        const p1 = project3D(gx, floorY, -gridExtent, mouse.rotX, mouse.rotY);
        const p2 = project3D(gx, floorY, gridExtent, mouse.rotX, mouse.rotY);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      for (let gz = -gridExtent; gz <= gridExtent; gz += gridStep) {
        const p1 = project3D(-gridExtent, floorY, gz, mouse.rotX, mouse.rotY);
        const p2 = project3D(gridExtent, floorY, gz, mouse.rotX, mouse.rotY);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 2. Draw & Update Floating Cyber Particles
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        if (p.y < -180) p.y = 180;

        const proj = project3D(p.x, p.y, p.z, mouse.rotX, mouse.rotY);
        if (proj) {
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * proj.scale})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.8, p.size * proj.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 3. Render Interconnecting Conduits & Light Pulses
      ctx.save();
      for (let i = 0; i < conduits.length; i++) {
        const c = conduits[i];
        const b1 = c.b1;
        const b2 = c.b2;

        const y1 = b1.baseY + Math.sin(time * b1.freq + b1.phase) * b1.amplitude;
        const y2 = b2.baseY + Math.sin(time * b2.freq + b2.phase) * b2.amplitude;

        const p1 = project3D(b1.x, y1, b1.z, mouse.rotX, mouse.rotY);
        const p2 = project3D(b2.x, y2, b2.z, mouse.rotX, mouse.rotY);

        if (p1 && p2) {
          // Conduit line
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Data packet flow
          c.packetT = (c.packetT + c.speed * rotationSpeed) % 1;
          const packetX = p1.x + (p2.x - p1.x) * c.packetT;
          const packetY = p1.y + (p2.y - p1.y) * c.packetT;

          ctx.fillStyle = c.color;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.restore();

      // 4. Render Procedural Tech Blocks (Sorted by depth for realistic occlusion)
      const renderableBlocks = blocks.map((b) => {
        const curY = b.baseY + Math.sin(time * b.freq + b.phase) * b.amplitude;
        const projCenter = project3D(b.x, curY, b.z, mouse.rotX, mouse.rotY);
        return {
          ...b,
          curY,
          projCenter,
          depth: projCenter ? projCenter.depth : -9999
        };
      }).filter(b => b.projCenter !== null);

      // Sort back-to-front
      renderableBlocks.sort((a, b) => b.depth - a.depth);

      renderableBlocks.forEach((b) => {
        const { x, curY, z, w, h, d, projCenter, colorType } = b;
        const hw = w / 2;
        const hd = d / 2;

        // 8 vertices of cuboid
        const v = [
          project3D(x - hw, curY - h, z - hd, mouse.rotX, mouse.rotY),
          project3D(x + hw, curY - h, z - hd, mouse.rotX, mouse.rotY),
          project3D(x + hw, curY - h, z + hd, mouse.rotX, mouse.rotY),
          project3D(x - hw, curY - h, z + hd, mouse.rotX, mouse.rotY),
          project3D(x - hw, curY,     z - hd, mouse.rotX, mouse.rotY),
          project3D(x + hw, curY,     z - hd, mouse.rotX, mouse.rotY),
          project3D(x + hw, curY,     z + hd, mouse.rotX, mouse.rotY),
          project3D(x - hw, curY,     z + hd, mouse.rotX, mouse.rotY)
        ];

        if (v.some(pt => !pt)) return;

        // Determine facet colors according to Michael Skripin palette
        let topFill, sideFill, edgeStroke;
        if (colorType === 'flare') {
          topFill = 'rgba(14, 165, 233, 0.45)';
          sideFill = 'rgba(8, 20, 38, 0.75)';
          edgeStroke = '#38bdf8';
        } else if (colorType === 'core') {
          topFill = 'rgba(16, 185, 129, 0.45)';
          sideFill = 'rgba(6, 28, 24, 0.75)';
          edgeStroke = '#34d399';
        } else {
          // Kevlar / Obsidian Slate
          topFill = 'rgba(30, 41, 59, 0.55)';
          sideFill = 'rgba(12, 17, 28, 0.85)';
          edgeStroke = 'rgba(148, 163, 184, 0.4)';
        }

        ctx.lineWidth = 1;

        // Top Face (v[0], v[1], v[2], v[3])
        ctx.fillStyle = topFill;
        ctx.strokeStyle = edgeStroke;
        ctx.beginPath();
        ctx.moveTo(v[0].x, v[0].y);
        ctx.lineTo(v[1].x, v[1].y);
        ctx.lineTo(v[2].x, v[2].y);
        ctx.lineTo(v[3].x, v[3].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front Face (v[3], v[2], v[6], v[7])
        ctx.fillStyle = sideFill;
        ctx.beginPath();
        ctx.moveTo(v[3].x, v[3].y);
        ctx.lineTo(v[2].x, v[2].y);
        ctx.lineTo(v[6].x, v[6].y);
        ctx.lineTo(v[7].x, v[7].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Face (v[1], v[2], v[6], v[5])
        ctx.beginPath();
        ctx.moveTo(v[1].x, v[1].y);
        ctx.lineTo(v[2].x, v[2].y);
        ctx.lineTo(v[6].x, v[6].y);
        ctx.lineTo(v[5].x, v[5].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing Cap Beacon on Top
        const capTop = project3D(x, curY - h, z, mouse.rotX, mouse.rotY);
        if (capTop) {
          ctx.fillStyle = colorType === 'core' ? '#10b981' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(capTop.x, capTop.y, 1.8 * capTop.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. Central 3D Cyber Core & Rotating Orbital Rings
      const coreY = -10 + Math.sin(time * 1.5) * 8;
      const coreProj = project3D(0, coreY, 0, mouse.rotX, mouse.rotY);

      if (coreProj) {
        ctx.save();
        // Orbital Rings (Concentric Cryptographic Rings)
        const ringRadii = [68, 92, 120];
        const ringSpeeds = [0.03, -0.02, 0.015];

        ringRadii.forEach((radius, idx) => {
          const ringAngle = time * ringSpeeds[idx] * rotationSpeed * 10;
          ctx.strokeStyle = idx === 1 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(16, 185, 129, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();

          const segs = 36;
          for (let s = 0; s <= segs; s++) {
            const theta = (s / segs) * Math.PI * 2 + ringAngle;
            const rx = Math.cos(theta) * radius;
            const rz = Math.sin(theta) * radius;
            const pt = project3D(rx, coreY, rz, mouse.rotX, mouse.rotY);
            if (pt) {
              if (s === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            }
          }
          ctx.stroke();
        });

        // 6. Draw 3D Central Security Shield
        const projectedShield = shieldVertices.map(pt => {
          // Rotate shield locally
          const sAngle = time * 0.8 * rotationSpeed;
          const sx = pt.x * Math.cos(sAngle) - pt.z * Math.sin(sAngle);
          const sz = pt.z * Math.cos(sAngle) + pt.x * Math.sin(sAngle);
          return project3D(sx, coreY + pt.y, sz, mouse.rotX, mouse.rotY);
        });

        if (projectedShield.every(p => p !== null)) {
          // Shield Translucent Faces
          ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;

          // Wireframe edges
          shieldEdges.forEach(([i1, i2]) => {
            const p1 = projectedShield[i1];
            const p2 = projectedShield[i2];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          });

          // Inner emblem facet fill
          ctx.beginPath();
          ctx.moveTo(projectedShield[0].x, projectedShield[0].y);
          ctx.lineTo(projectedShield[1].x, projectedShield[1].y);
          ctx.lineTo(projectedShield[2].x, projectedShield[2].y);
          ctx.lineTo(projectedShield[3].x, projectedShield[3].y);
          ctx.lineTo(projectedShield[4].x, projectedShield[4].y);
          ctx.lineTo(projectedShield[5].x, projectedShield[5].y);
          ctx.closePath();
          ctx.fill();

          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      // 7. Pulse Shockwaves (Triggered by user or automated telemetry events)
      if (pulsesRef.current.length > 0) {
        ctx.save();
        pulsesRef.current.forEach((pulse, idx) => {
          pulse.radius += 4 * rotationSpeed;
          pulse.alpha -= 0.015;

          const ringPoints = 32;
          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, pulse.alpha)})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14;
          ctx.beginPath();

          for (let s = 0; s <= ringPoints; s++) {
            const theta = (s / ringPoints) * Math.PI * 2;
            const px = Math.cos(theta) * pulse.radius;
            const pz = Math.sin(theta) * pulse.radius;
            const pt = project3D(px, coreY, pz, mouse.rotX, mouse.rotY);
            if (pt) {
              if (s === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            }
          }
          ctx.stroke();
        });
        pulsesRef.current = pulsesRef.current.filter(p => p.alpha > 0);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Mouse events for parallax and orbital tilt
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / height - 0.5) * 2;

      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.lastX;
        const deltaY = e.clientY - mouseRef.current.lastY;
        mouseRef.current.targetX += deltaX * 0.008;
        mouseRef.current.targetY = Math.max(-0.2, Math.min(1.2, mouseRef.current.targetY + deltaY * 0.008));
        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;
      } else {
        mouseRef.current.targetX = x * 0.45;
        mouseRef.current.targetY = 0.45 + y * 0.35;
      }
    };

    const handleMouseDown = (e) => {
      mouseRef.current.isDragging = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDragging = false;
    };

    const handleCanvasClick = () => {
      triggerPulse();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleCanvasClick);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [rotationSpeed, triggerPulse]);

  // Telemetry real-time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry({
        activeNodes: 48 + Math.floor(Math.sin(Date.now() / 2000) * 3),
        dataRate: (1.8 + Math.random() * 0.3).toFixed(2) + ' GB/s',
        integrity: '99.98%',
        packetsPerSec: 1400 + Math.floor(Math.random() * 80)
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="cyber-viewport" ref={containerRef}>
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="cyber-canvas" />

      {/* Optional Scanlines Filter */}
      {showScanlines && <div className="cyber-scanlines" />}

      {/* Tactical Corner Brackets */}
      <div className="cyber-corner top-left" />
      <div className="cyber-corner top-right" />
      <div className="cyber-corner bottom-left" />
      <div className="cyber-corner bottom-right" />

      {/* HUD Telemetry Overlay */}
      <div className="cyber-hud-overlay">
        <div className="cyber-hud-top">
          {/* Telemetry Status Box */}
          <div className="cyber-telemetry-panel">
            <div className="cyber-telemetry-row">
              <span>SECURITY PROTOCOL:</span>
              <span className="cyber-telemetry-val">AES-256-GCM</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>ACTIVE LICENSE NODES:</span>
              <span className="cyber-telemetry-val">{telemetry.activeNodes} / 50</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>THROUGHPUT:</span>
              <span className="cyber-telemetry-val">{telemetry.dataRate}</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>ECOSYSTEM INTEGRITY:</span>
              <span className="cyber-telemetry-val secure">{telemetry.integrity}</span>
            </div>
          </div>

          {/* Mode Pill Indicator */}
          <div style={{
            background: 'rgba(8, 12, 21, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.72rem',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            pointerEvents: 'auto'
          }}>
            <Cpu size={14} style={{ color: '#38bdf8' }} />
            <span>3D PROCEDURAL RUNTIME &bull; 60 FPS</span>
          </div>
        </div>

        {/* HUD Controls Bottom Bar */}
        <div className="cyber-hud-controls">
          <button 
            className="cyber-hud-btn" 
            onClick={triggerPulse}
            title="Emit security radar wave across ecosystem"
          >
            <Zap size={13} style={{ color: '#38bdf8' }} />
            <span>Pulse Wave ({pulseCount})</span>
          </button>

          <button 
            className={`cyber-hud-btn ${rotationSpeed === 2 ? 'active' : ''}`}
            onClick={() => setRotationSpeed(s => s === 1 ? 2 : (s === 2 ? 0.5 : 1))}
            title="Toggle orbital rotation speed"
          >
            <RotateCw size={13} />
            <span>Speed: {rotationSpeed}x</span>
          </button>

          <button 
            className={`cyber-hud-btn ${showScanlines ? 'active' : ''}`}
            onClick={() => setShowScanlines(s => !s)}
            title="Toggle CRT holographic scanlines"
          >
            <Eye size={13} />
            <span>Scanlines</span>
          </button>

          <button 
            className={`cyber-hud-btn ${isRecording ? 'active' : ''}`}
            onClick={startRecording}
            disabled={isRecording}
            title="Record and download a crisp 3D video reel"
          >
            <Download size={13} />
            <span>{isRecording ? `Recording ${recordingProgress}%` : 'Export 3D Reel'}</span>
          </button>

          {onOpenModal && (
            <button 
              className="cyber-hud-btn" 
              onClick={onOpenModal}
              title="Expand to Fullscreen Cinema Mode"
              style={{ background: 'rgba(37, 99, 235, 0.3)', borderColor: '#38bdf8' }}
            >
              <Maximize2 size={13} style={{ color: '#38bdf8' }} />
              <span>Full Cinema</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
