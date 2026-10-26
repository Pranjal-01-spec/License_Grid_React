import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Cpu, 
  RotateCw, 
  Download, 
  Maximize2, 
  Package, 
  Zap, 
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';

export default function IsometricConveyorCanvas({ onOpenModal }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // User Interactive Settings
  const [conveyorSpeed, setConveyorSpeed] = useState(1);
  const [laserActive, setLaserActive] = useState(true);
  const [cubesProcessed, setCubesProcessed] = useState(48);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // App licenses that travel on the conveyor
  const appTemplates = [
    { name: 'GitHub Enterprise', code: 'GIT-PROV-902', color: '#f97316' },
    { name: 'Figma Organization', code: 'FIG-SEAT-411', color: '#fb923c' },
    { name: 'AWS Cloud Console', code: 'AWS-IAM-884', color: '#f59e0b' },
    { name: 'Slack Enterprise Grid', code: 'SLK-SYNC-109', color: '#fbbf24' },
    { name: 'Datadog APM Core', code: 'DDG-NODE-772', color: '#ea580c' },
    { name: 'Jira Enterprise', code: 'JRA-TICK-338', color: '#ff7828' }
  ];

  // Manual Cube Spawn
  const customCubesRef = useRef([]);

  const spawnCube = useCallback(() => {
    const template = appTemplates[Math.floor(Math.random() * appTemplates.length)];
    customCubesRef.current.push({
      progress: 0,
      name: template.name,
      code: template.code,
      color: template.color
    });
    setCubesProcessed(c => c + 1);
  }, []);

  // Record 60fps reel to WebM
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
        a.download = `Isometric_Conveyor_Assembly_${Date.now()}.webm`;
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
      }, 500);
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
    // TRUE ISOMETRIC PROJECTION HELPER (30 DEGREE)
    // ==========================================
    const cos30 = Math.cos(Math.PI / 6);
    const sin30 = Math.sin(Math.PI / 6);

    const originX = width / 2;
    const originY = height / 2 + 10;

    function isoProject(x, y, z) {
      return {
        px: originX + (x - y) * cos30,
        py: originY + (x + y) * sin30 - z
      };
    }

    // Modular App Cubes moving continuously along conveyor line
    // Conveyor runs along X axis from -280 to +280
    const streamCubes = [
      { progress: 0.1, name: 'GitHub Enterprise', code: 'GIT-001' },
      { progress: 0.35, name: 'Figma Organization', code: 'FIG-104' },
      { progress: 0.62, name: 'AWS Cloud Console', code: 'AWS-229' },
      { progress: 0.88, name: 'Slack Grid Core', code: 'SLK-512' }
    ];

    let time = 0;

    // Draw an isometric cuboid
    function drawIsoBox(x, y, z, w, l, h, fillTop, fillFront, fillRight, strokeColor, lineWidth = 1) {
      const p0 = isoProject(x, y, z);
      const p1 = isoProject(x + w, y, z);
      const p2 = isoProject(x + w, y + l, z);
      const p3 = isoProject(x, y + l, z);

      const p4 = isoProject(x, y, z + h);
      const p5 = isoProject(x + w, y, z + h);
      const p6 = isoProject(x + w, y + l, z + h);
      const p7 = isoProject(x, y + l, z + h);

      ctx.lineWidth = lineWidth;

      // Front Face (p3, p2, p6, p7)
      if (fillFront) {
        ctx.fillStyle = fillFront;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(p3.px, p3.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p6.px, p6.py);
        ctx.lineTo(p7.px, p7.py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Right Face (p1, p2, p6, p5)
      if (fillRight) {
        ctx.fillStyle = fillRight;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.lineTo(p6.px, p6.py);
        ctx.lineTo(p5.px, p5.py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Top Face (p4, p5, p6, p7)
      if (fillTop) {
        ctx.fillStyle = fillTop;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(p4.px, p4.py);
        ctx.lineTo(p5.px, p5.py);
        ctx.lineTo(p6.px, p6.py);
        ctx.lineTo(p7.px, p7.py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      return { p4, p5, p6, p7 };
    }

    // ==========================================
    // RENDER LOOP (60FPS CLEAN OCTANE MOTION)
    // ==========================================
    const render = () => {
      time += 0.018 * conveyorSpeed;

      // 1. Dark Textured Slate Background
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, width, height);

      // Technical blueprint grid dots
      ctx.fillStyle = 'rgba(255, 115, 22, 0.08)';
      const dotSpacing = 32;
      for (let dx = 16; dx < width; dx += dotSpacing) {
        for (let dy = 16; dy < height; dy += dotSpacing) {
          ctx.beginPath();
          ctx.arc(dx, dy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Base Machinery Floor Platform (Glossy black with orange LED illuminated borders)
      drawIsoBox(
        -320, -110, -40,
        640, 220, 30,
        '#0b101a', '#080c14', '#060910',
        'rgba(249, 115, 22, 0.45)', 1.5
      );

      // Floor LED Edge Neon Glow Strip
      const ledP1 = isoProject(-320, 110, -10);
      const ledP2 = isoProject(320, 110, -10);
      ctx.save();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(ledP1.px, ledP1.py);
      ctx.lineTo(ledP2.px, ledP2.py);
      ctx.stroke();
      ctx.restore();

      // 3. Industrial Conveyor Belt Platform
      // Conveyor runs along X from -280 to +280, Y width = 64
      drawIsoBox(
        -280, -32, -10,
        560, 64, 20,
        '#0f1724', '#0a0e18', '#070a12',
        'rgba(255, 140, 30, 0.4)', 1
      );

      // Moving Conveyor Chevrons / Track Marks
      ctx.save();
      const chevronStep = 44;
      const offset = (time * 60) % chevronStep;

      for (let cx = -270 + offset; cx < 270; cx += chevronStep) {
        const cP1 = isoProject(cx, -24, 11);
        const cP2 = isoProject(cx + 12, 0, 11);
        const cP3 = isoProject(cx, 24, 11);

        ctx.strokeStyle = 'rgba(249, 115, 22, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cP1.px, cP1.py);
        ctx.lineTo(cP2.px, cP2.py);
        ctx.lineTo(cP3.px, cP3.py);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Conveyor Guide Rails (Glossy black with illuminated orange neon trim)
      drawIsoBox(-280, -38, 10, 560, 6, 12, '#151d2c', '#0d1320', '#0a0e18', '#f97316', 1);
      drawIsoBox(-280, 32, 10, 560, 6, 12, '#151d2c', '#0d1320', '#0a0e18', '#f97316', 1);

      // 5. Update & Render Modular App Cubes along the conveyor line
      // Combine continuous stream cubes + user spawned cubes
      const allCubes = [...streamCubes, ...customCubesRef.current];

      // Sort cubes along X for correct isometric overlap (back to front)
      const sortedCubes = allCubes.map((cube) => {
        cube.progress = (cube.progress + 0.004 * conveyorSpeed) % 1;
        const cubeX = -260 + cube.progress * 520;
        return { ...cube, cubeX };
      });

      sortedCubes.sort((a, b) => a.cubeX - b.cubeX);

      // Render Cubes
      sortedCubes.forEach((cube) => {
        const { cubeX, progress, name } = cube;
        const cubeW = 34;
        const cubeL = 34;
        const cubeH = 34;
        const cubeY = -17;
        const cubeZ = 10;

        // Check if inside the transparent building chamber (-60 to +60)
        const inChamber = cubeX > -65 && cubeX < 65;
        const isPostChamber = cubeX >= 65;

        let fillTop, fillFront, fillRight, strokeColor;

        if (inChamber) {
          // Intense internal orange light and laser illumination
          fillTop = 'rgba(255, 120, 20, 0.85)';
          fillFront = 'rgba(220, 80, 10, 0.85)';
          fillRight = 'rgba(180, 60, 5, 0.85)';
          strokeColor = '#ffffff';
        } else if (isPostChamber) {
          // Labeled, verified enterprise app block (glossy black + crisp neon orange label)
          fillTop = '#1e293b';
          fillFront = '#0f172a';
          fillRight = '#0a0e17';
          strokeColor = '#f97316';
        } else {
          // Pre-chamber: Unprocessed modular block (translucent obsidian)
          fillTop = 'rgba(30, 41, 59, 0.7)';
          fillFront = 'rgba(15, 23, 42, 0.8)';
          fillRight = 'rgba(10, 15, 26, 0.85)';
          strokeColor = 'rgba(249, 115, 22, 0.4)';
        }

        const boxTop = drawIsoBox(
          cubeX - cubeW / 2, cubeY, cubeZ,
          cubeW, cubeL, cubeH,
          fillTop, fillFront, fillRight,
          strokeColor, inChamber ? 1.8 : 1.2
        );

        // App Logo / Label on Top Face for post-chamber blocks
        if (boxTop && isPostChamber) {
          const centerTop = {
            px: (boxTop.p4.px + boxTop.p6.px) / 2,
            py: (boxTop.p4.py + boxTop.p6.py) / 2
          };

          ctx.save();
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(centerTop.px, centerTop.py, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(name.slice(0, 3).toUpperCase(), centerTop.px, centerTop.py - 6);
          ctx.restore();
        }
      });

      // 6. Transparent Glowing Glass Building Chamber (Center at X: -60 to +60)
      const chamberW = 120;
      const chamberL = 84;
      const chamberH = 95;
      const chamberX = -chamberW / 2;
      const chamberY = -chamberL / 2;
      const chamberZ = 10;

      // Chamber Base & Stanchions
      drawIsoBox(chamberX - 6, chamberY - 6, chamberZ, chamberW + 12, chamberL + 12, 10, '#0d1320', '#070a12', '#05080e', 'rgba(249, 115, 22, 0.5)', 1);

      // Chamber Transparent Glowing Glass Walls (Refractive glass housing with orange edges)
      drawIsoBox(
        chamberX, chamberY, chamberZ + 10,
        chamberW, chamberL, chamberH,
        'rgba(249, 115, 22, 0.12)', // Glass Top
        'rgba(249, 115, 22, 0.08)', // Glass Front
        'rgba(249, 115, 22, 0.15)', // Glass Right
        '#f97316', 1.8              // Glowing neon orange structural frame
      );

      // 7. Internal Orange Laser Scanner Sweep Beam
      if (laserActive) {
        ctx.save();
        const scanOffset = Math.sin(time * 3) * 45;
        const scanP1 = isoProject(scanOffset, -30, 20);
        const scanP2 = isoProject(scanOffset, 30, 20);
        const scanP3 = isoProject(scanOffset, 30, 85);
        const scanP4 = isoProject(scanOffset, -30, 85);

        // Laser sheet glow
        ctx.fillStyle = 'rgba(255, 120, 20, 0.28)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ff6b00';
        ctx.shadowBlur = 18;

        ctx.beginPath();
        ctx.moveTo(scanP1.px, scanP1.py);
        ctx.lineTo(scanP2.px, scanP2.py);
        ctx.lineTo(scanP3.px, scanP3.py);
        ctx.lineTo(scanP4.px, scanP4.py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // 8. Digital UI Screens above the building chamber (Holographic displays)
      const uiP = isoProject(0, -chamberL / 2 - 15, chamberH + 20);
      ctx.save();
      ctx.fillStyle = 'rgba(9, 12, 20, 0.9)';
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 10;

      const screenW = 170;
      const screenH = 65;
      const sx = uiP.px - screenW / 2;
      const sy = uiP.py - screenH;

      ctx.fillRect(sx, sy, screenW, screenH);
      ctx.strokeRect(sx, sy, screenW, screenH);
      ctx.shadowBlur = 0;

      // Screen Header
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('MODULE PROVISIONING &bull; ACTIVE', sx + 8, sy + 14);

      // Loading Bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(sx + 8, sy + 22, screenW - 16, 6);
      const loadProgress = ((time * 25) % 100) / 100;
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(sx + 8, sy + 22, (screenW - 16) * loadProgress, 6);

      // Node details
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '8px monospace';
      ctx.fillText(`STATUS: TOKEN ASSIGNED (${Math.floor(loadProgress * 100)}%)`, sx + 8, sy + 40);
      ctx.fillStyle = '#34d399';
      ctx.fillText(`INTEGRATION: AES-256 SAFEGUARD`, sx + 8, sy + 52);
      ctx.restore();

      // 9. Drop-off Platform & Output Bin (At end of conveyor X: 280)
      drawIsoBox(280, -42, -15, 75, 84, 30, '#111827', '#090d16', '#060910', 'rgba(249, 115, 22, 0.5)', 1);

      // Drop-off Platform Glowing Catch Basin
      const catchP1 = isoProject(285, -36, 16);
      const catchP2 = isoProject(345, -36, 16);
      const catchP3 = isoProject(345, 36, 16);
      const catchP4 = isoProject(285, 36, 16);

      ctx.save();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(catchP1.px, catchP1.py);
      ctx.lineTo(catchP2.px, catchP2.py);
      ctx.lineTo(catchP3.px, catchP3.py);
      ctx.lineTo(catchP4.px, catchP4.py);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [conveyorSpeed, laserActive]);

  return (
    <div className="cyber-viewport" ref={containerRef} style={{ background: '#06080e' }}>
      {/* Isometric Canvas */}
      <canvas ref={canvasRef} className="cyber-canvas" />

      {/* Tactical Corner Brackets (Neon Orange) */}
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
              <span className="cyber-telemetry-val" style={{ color: '#fb923c' }}>ISOMETRIC TECH ASSEMBLY</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>MACHINERY TYPE:</span>
              <span className="cyber-telemetry-val" style={{ color: '#fbbf24' }}>MICRO-FACTORY CONVEYOR</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>BUILDING CHAMBER:</span>
              <span className="cyber-telemetry-val" style={{ color: '#34d399' }}>TRANSPARENT LASER SCAN &bull; ACTIVE</span>
            </div>
            <div className="cyber-telemetry-row">
              <span>CUBES PROCESSED:</span>
              <span className="cyber-telemetry-val" style={{ color: '#fb923c' }}>{cubesProcessed} APP BLOCKS</span>
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
            <Package size={14} style={{ color: '#f97316' }} />
            <span>ORTHOGRAPHIC 3D &bull; 60 FPS</span>
          </div>
        </div>

        {/* HUD Controls Bottom Bar */}
        <div className="cyber-hud-controls" style={{ borderColor: 'rgba(249, 115, 22, 0.35)' }}>
          <button 
            className="cyber-hud-btn" 
            onClick={spawnCube}
            style={{ color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}
            title="Dispatch a new enterprise app cube down the conveyor belt"
          >
            <Package size={13} style={{ color: '#f97316' }} />
            <span>Spawn App Cube</span>
          </button>

          <button 
            className="cyber-hud-btn" 
            onClick={() => setLaserActive(l => !l)}
            style={{ color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}
            title="Toggle inspection laser sweep beam inside building chamber"
          >
            <Zap size={13} style={{ color: laserActive ? '#f97316' : '#64748b' }} />
            <span>Laser Sweep: {laserActive ? 'ON' : 'OFF'}</span>
          </button>

          <button 
            className="cyber-hud-btn" 
            onClick={() => setConveyorSpeed(s => s === 1 ? 2 : (s === 2 ? 0.5 : 1))}
            style={{ color: '#fdba74', borderColor: 'rgba(249, 115, 22, 0.3)' }}
            title="Toggle conveyor line speed"
          >
            <RotateCw size={13} />
            <span>Speed: {conveyorSpeed}x</span>
          </button>

          <button 
            className="cyber-hud-btn" 
            onClick={startRecording}
            disabled={isRecording}
            style={{ background: 'rgba(249, 115, 22, 0.15)', borderColor: '#f97316', color: '#ffedd5' }}
            title="Record 60fps video reel to download"
          >
            <Download size={13} style={{ color: '#f97316' }} />
            <span>{isRecording ? `Recording ${recordingProgress}%` : 'Export 60FPS Reel'}</span>
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
