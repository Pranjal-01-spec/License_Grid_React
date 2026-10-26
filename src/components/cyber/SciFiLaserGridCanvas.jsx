import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Zap, 
  RotateCw, 
  Download, 
  Maximize2, 
  Sliders, 
  Layers,
  Flame,
  Radio
} from 'lucide-react';

export default function SciFiLaserGridCanvas({ onOpenModal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Interactive Controls
  const [laserIntensity, setLaserIntensity] = useState(1);
  const [camSpeed, setCamSpeed] = useState(1);
  const [showFlares, setShowFlares] = useState(true);
  const [pulseCount, setPulseCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // Mouse camera offset
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    rotX: 0.32,  // pitch angle
    rotY: 0.22,  // yaw angle
    isDragging: false,
    lastX: 0,
    lastY: 0
  });

  const shockwavesRef = useRef([]);

  const triggerLaserPulse = useCallback(() => {
    shockwavesRef.current.push({
      progress: 0,
      alpha: 1,
      x: 0,
      z: 0
    });
    setPulseCount(c => c + 1);
  }, []);

  // Record 3D scene directly into downloadable WebM/MP4
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
        a.download = `SciFi_Laser_Grid_4K_${Date.now()}.webm`;
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
      console.warn('Recorder fallback:', err);
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 520);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 520;
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // PROCEDURAL METALLIC CUBES & PILLARS MATRIX
    // ==========================================
    const rows = 18;
    const cols = 22;
    const spacingX = 48;
    const spacingZ = 48;
    const blocks = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * spacingX;
        const z = (r - rows / 2) * spacingZ;
        
        // Random architectural pillar height with city-like clusters
        const distFromCenter = Math.abs(x);
        const heightSeed = Math.sin(c * 0.7) * Math.cos(r * 0.6) + Math.sin(c * 0.3 + r * 0.5);
        const h = Math.max(16, 25 + Math.abs(heightSeed) * 75 + (r % 3 === 0 ? 30 : 0));
        const w = spacingX * (0.7 + Math.random() * 0.22);
        const d = spacingZ * (0.7 + Math.random() * 0.22);

        blocks.push({
          x,
          z,
          w,
          d,
          h,
          baseY: 80, // ground level
          metallicReflect: 0.15 + Math.random() * 0.25
        });
      }
    }

    // Fiery Embers & Sparks rising from laser cut
    const embers = [];
    for (let i = 0; i < 90; i++) {
      embers.push({
        x: (Math.random() - 0.5) * 550,
        y: 40 + Math.random() * 80,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.8 - Math.random() * 1.6,
        size: 1 + Math.random() * 2.2,
        life: Math.random(),
        maxLife: 0.5 + Math.random() * 0.5
      });
    }

    // 3D Projection camera
    const cameraDist = 480;

    function project3D(x, y, z, rotX, rotY, camX = 0, camZ = 0) {
      const rx = x - camX;
      const rz = z - camZ;

      // Yaw rotation (Y-axis)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = rx * cosY - rz * sinY;
      const z1 = rz * cosY + rx * sinY;

      // Pitch rotation (X-axis)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const depth = cameraDist + z2;
      if (depth <= 15) return null;
      const fov = 440 / depth;

      return {
        x: width / 2 + x1 * fov,
        y: height / 2 + y2 * fov,
        depth: z2,
        scale: fov
      };
    }

    let time = 0;

    // ==========================================
    // RENDER LOOP (60FPS RAYTRACED FEEL)
    // ==========================================
    const render = () => {
      time += 0.016 * camSpeed;

      const mouse = mouseRef.current;
      mouse.rotY += (mouse.targetX - mouse.rotY) * 0.05;
      mouse.rotX += (mouse.targetY - mouse.rotX) * 0.05;

      // Cinematic parallel tracking camera motion
      const camZ = ((time * 70) % spacingZ) - spacingZ / 2;
      const camX = Math.sin(time * 0.6) * 18;
      const camYOffset = Math.sin(time * 0.4) * 8;

      // 1. Deep Matte Black Background with Atmospheric Fog
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      // Radial dark atmosphere vignette
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, width * 0.7
      );
      bgGrad.addColorStop(0, 'rgba(16, 21, 30, 0.9)');
      bgGrad.addColorStop(0.6, 'rgba(7, 10, 15, 0.96)');
      bgGrad.addColorStop(1, '#030508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Laser Beam 3D coordinates (Streaming horizontally across the grid)
      const laserY = 28 + Math.sin(time * 1.2) * 5;
      const laserZStart = -450;
      const laserZEnd = 450;
      const laserX = Math.sin(time * 0.5) * 40;

      // 2. Sort & Render Matte Black Blocks with Laser Illumination
      const renderList = [];

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        // Infinite scrolling illusion
        let adjustedZ = b.z - ((time * 80) % (rows * spacingZ));
        if (adjustedZ < - (rows * spacingZ) / 2) adjustedZ += rows * spacingZ;

        const projCenter = project3D(b.x, b.baseY - b.h / 2, adjustedZ, mouse.rotX, mouse.rotY, camX, camZ);
        if (projCenter) {
          renderList.push({
            ...b,
            z: adjustedZ,
            depth: projCenter.depth,
            projCenter
          });
        }
      }

      // Back-to-front sorting
      renderList.sort((a, b) => b.depth - a.depth);

      // Render each metallic cube
      renderList.forEach((b) => {
        const { x, z, w, d, h, baseY } = b;
        const hw = w / 2;
        const hd = d / 2;
        const topY = baseY - h + camYOffset;
        const botY = baseY + camYOffset;

        // 8 vertices
        const v = [
          project3D(x - hw, topY, z - hd, mouse.rotX, mouse.rotY, camX, camZ), // 0 top-back-left
          project3D(x + hw, topY, z - hd, mouse.rotX, mouse.rotY, camX, camZ), // 1 top-back-right
          project3D(x + hw, topY, z + hd, mouse.rotX, mouse.rotY, camX, camZ), // 2 top-front-right
          project3D(x - hw, topY, z + hd, mouse.rotX, mouse.rotY, camX, camZ), // 3 top-front-left
          project3D(x - hw, botY, z - hd, mouse.rotX, mouse.rotY, camX, camZ), // 4 bot-back-left
          project3D(x + hw, botY, z - hd, mouse.rotX, mouse.rotY, camX, camZ), // 5 bot-back-right
          project3D(x + hw, botY, z + hd, mouse.rotX, mouse.rotY, camX, camZ), // 6 bot-front-right
          project3D(x - hw, botY, z + hd, mouse.rotX, mouse.rotY, camX, camZ)  // 7 bot-front-left
        ];

        if (v.some(p => !p)) return;

        // Calculate proximity to laser beam for dynamic orange light leak & sub-surface scattering
        const distToLaserX = Math.abs(x - laserX);
        const distToLaserY = Math.abs(topY - laserY);
        const laserDist = Math.sqrt(distToLaserX * distToLaserX + distToLaserY * distToLaserY);

        const illumination = Math.max(0, 1 - laserDist / 170) * laserIntensity;
        const orangeHeat = Math.pow(illumination, 1.4);

        // Dark Metallic Matte Black Palette
        // Base matte black: #090e16, highlighted with orange light leak
        let topFill, frontFill, rightFill;
        let edgeColor;

        if (orangeHeat > 0.05) {
          // Intense orange light leak on metallic faces
          topFill = `rgba(${Math.floor(18 + orangeHeat * 220)}, ${Math.floor(14 + orangeHeat * 95)}, ${Math.floor(18 + orangeHeat * 15)}, 0.95)`;
          frontFill = `rgba(${Math.floor(12 + orangeHeat * 190)}, ${Math.floor(10 + orangeHeat * 75)}, ${Math.floor(14 + orangeHeat * 10)}, 0.95)`;
          rightFill = `rgba(${Math.floor(8 + orangeHeat * 150)}, ${Math.floor(8 + orangeHeat * 55)}, ${Math.floor(10 + orangeHeat * 8)}, 0.95)`;
          edgeColor = `rgba(255, ${Math.floor(140 + orangeHeat * 90)}, ${Math.floor(40 + orangeHeat * 40)}, ${0.4 + orangeHeat * 0.6})`;
        } else {
          // Dark metallic matte black with specular chrome bevel
          topFill = '#0d131e';
          frontFill = '#090d15';
          rightFill = '#06090f';
          edgeColor = 'rgba(51, 65, 85, 0.35)'; // subtle metallic chamfer
        }

        ctx.lineWidth = 1;

        // Front Face (3, 2, 6, 7)
        ctx.fillStyle = frontFill;
        ctx.strokeStyle = edgeColor;
        ctx.beginPath();
        ctx.moveTo(v[3].x, v[3].y);
        ctx.lineTo(v[2].x, v[2].y);
        ctx.lineTo(v[6].x, v[6].y);
        ctx.lineTo(v[7].x, v[7].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Face (1, 2, 6, 5)
        ctx.fillStyle = rightFill;
        ctx.beginPath();
        ctx.moveTo(v[1].x, v[1].y);
        ctx.lineTo(v[2].x, v[2].y);
        ctx.lineTo(v[6].x, v[6].y);
        ctx.lineTo(v[5].x, v[5].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top Face (0, 1, 2, 3)
        ctx.fillStyle = topFill;
        ctx.beginPath();
        ctx.moveTo(v[0].x, v[0].y);
        ctx.lineTo(v[1].x, v[1].y);
        ctx.lineTo(v[2].x, v[2].y);
        ctx.lineTo(v[3].x, v[3].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top specular bevel highlight line
        if (orangeHeat > 0.15) {
          ctx.strokeStyle = `rgba(255, 200, 100, ${orangeHeat * 0.8})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(v[3].x, v[3].y);
          ctx.lineTo(v[2].x, v[2].y);
          ctx.stroke();
        }
      });

      // 3. Render Fiery Glowing Laser Beam (Streams horizontally across the geometric surface)
      const pLaserStart = project3D(laserX, laserY, laserZStart, mouse.rotX, mouse.rotY, camX, camZ);
      const pLaserEnd = project3D(laserX, laserY, laserZEnd, mouse.rotX, mouse.rotY, camX, camZ);

      if (pLaserStart && pLaserEnd) {
        ctx.save();

        // Layer A: Wide atmospheric sub-surface orange bloom
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.28)';
        ctx.lineWidth = 60 * laserIntensity;
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 35;
        ctx.beginPath();
        ctx.moveTo(pLaserStart.x, pLaserStart.y);
        ctx.lineTo(pLaserEnd.x, pLaserEnd.y);
        ctx.stroke();

        // Layer B: Intense glowing orange core beam
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
        ctx.lineWidth = 14 * laserIntensity;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(pLaserStart.x, pLaserStart.y);
        ctx.lineTo(pLaserEnd.x, pLaserEnd.y);
        ctx.stroke();

        // Layer C: Fiery bright neon amber inner beam
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 5 * laserIntensity;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(pLaserStart.x, pLaserStart.y);
        ctx.lineTo(pLaserEnd.x, pLaserEnd.y);
        ctx.stroke();

        // Layer D: White-hot razor core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * laserIntensity;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(pLaserStart.x, pLaserStart.y);
        ctx.lineTo(pLaserEnd.x, pLaserEnd.y);
        ctx.stroke();

        // Layer E: Anamorphic Horizontal Streak Flares
        if (showFlares) {
          const midX = (pLaserStart.x + pLaserEnd.x) / 2;
          const midY = (pLaserStart.y + pLaserEnd.y) / 2;

          const flareGrad = ctx.createLinearGradient(midX - 160, midY, midX + 160, midY);
          flareGrad.addColorStop(0, 'rgba(255, 107, 0, 0)');
          flareGrad.addColorStop(0.3, 'rgba(255, 140, 0, 0.35)');
          flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
          flareGrad.addColorStop(0.7, 'rgba(255, 140, 0, 0.35)');
          flareGrad.addColorStop(1, 'rgba(255, 107, 0, 0)');

          ctx.fillStyle = flareGrad;
          ctx.fillRect(midX - 160, midY - 2.5, 320, 5);
        }

        ctx.restore();
      }

      // 4. Render Fiery Embers & Sparks
      ctx.save();
      for (let i = 0; i < embers.length; i++) {
        const emb = embers[i];
        emb.y += emb.vy;
        emb.x += emb.vx;
        emb.life += 0.015;

        if (emb.life > emb.maxLife || emb.y < -60) {
          emb.y = laserY + 10 + Math.random() * 20;
          emb.x = laserX + (Math.random() - 0.5) * 80;
          emb.z = (Math.random() - 0.5) * 500;
          emb.life = 0;
        }

        const proj = project3D(emb.x, emb.y, emb.z, mouse.rotX, mouse.rotY, camX, camZ);
        if (proj) {
          const alpha = (1 - emb.life / emb.maxLife) * 0.9;
          ctx.fillStyle = `rgba(251, 146, 60, ${alpha})`;
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.6, emb.size * proj.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 5. Laser Shockwaves (Pulse events)
      if (shockwavesRef.current.length > 0) {
        ctx.save();
        shockwavesRef.current.forEach((sw) => {
          sw.progress += 0.03 * camSpeed;
          sw.alpha = Math.max(0, 1 - sw.progress);

          const radius = sw.progress * 350;
          ctx.strokeStyle = `rgba(255, 115, 22, ${sw.alpha * 0.75})`;
          ctx.lineWidth = 3;
          ctx.shadowColor = '#ff6b00';
          ctx.shadowBlur = 20;

          const segs = 32;
          ctx.beginPath();
          for (let s = 0; s <= segs; s++) {
            const theta = (s / segs) * Math.PI * 2;
            const rx = Math.cos(theta) * radius;
            const rz = Math.sin(theta) * radius;
            const pt = project3D(rx, laserY, rz, mouse.rotX, mouse.rotY, camX, camZ);
            if (pt) {
              if (s === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            }
          }
          ctx.stroke();
        });
        shockwavesRef.current = shockwavesRef.current.filter(sw => sw.alpha > 0);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Mouse movement listeners
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / height - 0.5) * 2;

      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.lastX;
        const deltaY = e.clientY - mouseRef.current.lastY;
        mouseRef.current.targetX += deltaX * 0.005;
        mouseRef.current.targetY = Math.max(0.1, Math.min(0.8, mouseRef.current.targetY + deltaY * 0.005));
        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;
      } else {
        mouseRef.current.targetX = x * 0.35;
        mouseRef.current.targetY = 0.32 + y * 0.25;
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

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', triggerLaserPulse);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', triggerLaserPulse);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [camSpeed, laserIntensity, showFlares, triggerLaserPulse]);

  return (
    <div className="cyber-viewport" ref={containerRef} style={{ background: '#05070a' }}>
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="cyber-canvas" />

      {/* Tactical Corner Brackets (Fiery Orange) */}
      <div className="cyber-corner top-left" style={{ borderColor: 'rgba(249, 115, 22, 0.7)' }} />
      <div className="cyber-corner top-right" style={{ borderColor: 'rgba(249, 115, 22, 0.7)' }} />
      <div className="cyber-corner bottom-left" style={{ borderColor: 'rgba(249, 115, 22, 0.7)' }} />
      <div className="cyber-corner bottom-right" style={{ borderColor: 'rgba(249, 115, 22, 0.7)' }} />

      {/* Top HUD Telemetry Overlay */}
      <div className="cyber-hud-overlay">
        <div className="cyber-hud-top">
          <div className="cyber-telemetry-panel" style={{ borderColor: 'rgba(249, 115, 22, 0.35)', background: 'rgba(9, 12, 18, 0.85)' }}>
            <div className="cyber-telemetry-row">
              <span>SCENE PROFILE:</span>
              <span className="cyber-telemetry-val" style={{ color: '#fb923c' }}>DARK ABSTRACT LASER GRID</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>BEAM WAVELENGTH:</span>
              <span className="cyber-telemetry-val" style={{ color: '#fbbf24' }}>632.8 nm (FIERY ORANGE)</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>SURFACE RAYTRACING:</span>
              <span className="cyber-telemetry-val" style={{ color: '#34d399' }}>SUB-SURFACE BLOOM &bull; ACTIVE</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>CAMERA TRACKING:</span>
              <span className="cyber-telemetry-val" style={{ color: '#fb923c' }}>PARALLEL GLIDE 60 FPS</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(9, 12, 18, 0.85)',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.72rem',
            color: '#fdba74',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            pointerEvents: 'auto'
          }}>
            <Flame size={14} style={{ color: '#f97316' }} />
            <span>4K CINEMATIC OCTANE MOTION</span>
          </div>
        </div>

        {/* HUD Controls Bottom Bar */}
        <div className="cyber-hud-controls" style={{ borderColor: 'rgba(249, 115, 22, 0.35)' }}>
          <button 
            className="cyber-hud-btn" 
            onClick={triggerLaserPulse}
            style={{ color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}
            title="Emit laser shockwave burst across the metallic landscape"
          >
            <Zap size={13} style={{ color: '#f97316' }} />
            <span>Laser Pulse ({pulseCount})</span>
          </button>

          <button 
            className="cyber-hud-btn" 
            onClick={() => setLaserIntensity(i => i === 1 ? 1.6 : (i === 1.6 ? 0.7 : 1))}
            style={{ color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}
            title="Toggle Laser Beam Bloom & Intensity"
          >
            <Flame size={13} style={{ color: '#f97316' }} />
            <span>Beam: {laserIntensity === 1.6 ? 'Overdrive' : (laserIntensity === 0.7 ? 'Stealth' : 'Normal')}</span>
          </button>

          <button 
            className="cyber-hud-btn" 
            onClick={() => setCamSpeed(s => s === 1 ? 1.8 : (s === 1.8 ? 0.5 : 1))}
            style={{ color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}
            title="Toggle parallel tracking camera glide speed"
          >
            <RotateCw size={13} />
            <span>Tracking: {camSpeed}x</span>
          </button>

          <button 
            className="cyber-hud-btn" 
            onClick={startRecording}
            disabled={isRecording}
            style={{ background: 'rgba(249, 115, 22, 0.15)', borderColor: '#f97316', color: '#ffedd5' }}
            title="Record 60fps 4K video reel to download"
          >
            <Download size={13} style={{ color: '#f97316' }} />
            <span>{isRecording ? `Recording ${recordingProgress}%` : 'Export 4K Reel'}</span>
          </button>

          {onOpenModal && (
            <button 
              className="cyber-hud-btn" 
              onClick={onOpenModal}
              title="Expand to Fullscreen Cinema Mode"
              style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.4), rgba(249, 115, 22, 0.4))', borderColor: '#f97316', color: '#fff' }}
            >
              <Maximize2 size={13} />
              <span>Full Cinema</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
