import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Film, 
  Radio, 
  Layers, 
  Sparkles,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

export default function CyberVideoPlayer({ onOpenModal }) {
  const videoRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [cyberSoundOn, setCyberSoundOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showScanlines, setShowScanlines] = useState(true);
  const [videoSourceType, setVideoSourceType] = useState('curated'); // 'curated' | 'custom'
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Curated reliable cybersecurity video sources (with multiple fallback sources)
  // Standard free tech stock videos optimized for web loops
  const curatedVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const alternativeVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

  const [activeUrl, setActiveUrl] = useState(curatedVideoUrl);

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Video Time Update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress((cur / dur) * 100);
  };

  // Seek bar
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && duration) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  // Cyber Ambient Sound Synthesizer (Simulates deep futuristic server drone & pulses)
  const toggleCyberSound = () => {
    if (!cyberSoundOn) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Sub bass drone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

        // LFO for breathing pulsation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.5, ctx.currentTime); // 0.5 Hz pulse
        lfoGain.gain.setValueAtTime(15, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscillatorRef.current = osc;
        gainNodeRef.current = gain;
        setCyberSoundOn(true);
      } catch (err) {
        console.warn('Audio synthesis unavailable:', err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setCyberSoundOn(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Handle local video file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setActiveUrl(blobUrl);
      setVideoSourceType('custom');
      setIsPlaying(true);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      setActiveUrl(customUrl.trim());
      setVideoSourceType('custom');
      setShowUrlInput(false);
      setIsPlaying(true);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="cyber-video-wrapper">
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={activeUrl}
        className="cyber-video-elem"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onClick={togglePlay}
        onError={() => {
          // If external URL fails, fallback safely
          if (activeUrl !== alternativeVideoUrl) {
            setActiveUrl(alternativeVideoUrl);
          }
        }}
      />

      {/* Optional Tactical Scanlines Filter */}
      {showScanlines && <div className="cyber-scanlines" />}

      {/* Tactical Corner Brackets */}
      <div className="cyber-corner top-left" />
      <div className="cyber-corner top-right" />
      <div className="cyber-corner bottom-left" />
      <div className="cyber-corner bottom-right" />

      {/* Top Video HUD Badges */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1.25rem',
        right: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 5,
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          pointerEvents: 'auto'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.05em'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'cyber-beacon 1.2s infinite' }}></span>
            MOTION REEL &bull; 4K 60FPS
          </span>

          <span style={{
            padding: '0.25rem 0.65rem',
            borderRadius: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8',
            fontSize: '0.7rem',
            fontFamily: 'monospace'
          }}>
            H.264 / SYSTEM FEED
          </span>
        </div>

        {/* Custom Source Input Opener */}
        <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '6px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#cbd5e1',
            fontSize: '0.72rem',
            cursor: 'pointer'
          }}>
            <Upload size={12} />
            <span>Load Video</span>
            <input 
              type="file" 
              accept="video/mp4,video/webm,video/quicktime" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
            />
          </label>

          <button
            onClick={() => setShowUrlInput(s => !s)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            <LinkIcon size={12} />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Custom URL Input Bar (Conditionally revealed) */}
      {showUrlInput && (
        <div style={{
          position: 'absolute',
          top: '3.75rem',
          right: '1.25rem',
          zIndex: 20,
          background: 'rgba(10, 15, 29, 0.95)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          gap: '0.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}>
          <input
            type="text"
            placeholder="Paste direct MP4 or WebM URL..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              width: '260px'
            }}
          />
          <button
            onClick={handleApplyCustomUrl}
            style={{
              background: '#2563eb',
              border: 'none',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.3rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Floating Center Play Button if paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          style={{
            position: 'absolute',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(37, 99, 235, 0.85)',
            border: '2px solid rgba(56, 189, 248, 0.8)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 35px rgba(14, 165, 233, 0.6)',
            zIndex: 6,
            transition: 'transform 0.2s ease'
          }}
        >
          <Play size={28} style={{ marginLeft: '4px' }} />
        </button>
      )}

      {/* Bottom Video Controls Bar */}
      <div className="cyber-video-controls-bar">
        {/* Progress Bar */}
        <div className="cyber-progress-container" onClick={handleSeek}>
          <div className="cyber-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Controls Row */}
        <div className="cyber-video-buttons">
          <div className="cyber-video-btn-group">
            <button className="cyber-video-icon-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button 
              className="cyber-video-icon-btn" 
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              title="Restart Video"
            >
              <RotateCcw size={16} />
            </button>

            <button 
              className="cyber-video-icon-btn" 
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              title={isMuted ? 'Unmute Video Track' : 'Mute Video Track'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Synthesized Cyber Ambient Drone Sound */}
            <button
              onClick={toggleCyberSound}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                background: cyberSoundOn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${cyberSoundOn ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                color: cyberSoundOn ? '#34d399' : '#94a3b8',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
              title="Toggle simulated cybernetic server drone audio"
            >
              <Radio size={12} />
              <span>Cyber Drone: {cyberSoundOn ? 'ON' : 'OFF'}</span>
            </button>

            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', marginLeft: '0.25rem' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="cyber-video-btn-group">
            <button 
              className="cyber-video-icon-btn" 
              onClick={() => setShowScanlines(s => !s)}
              title="Toggle holographic scanline overlay"
              style={{ color: showScanlines ? '#38bdf8' : '#94a3b8' }}
            >
              <Layers size={16} />
            </button>

            {onOpenModal && (
              <button 
                className="cyber-video-icon-btn" 
                onClick={onOpenModal}
                title="Expand Cinema Modal"
              >
                <Maximize size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
