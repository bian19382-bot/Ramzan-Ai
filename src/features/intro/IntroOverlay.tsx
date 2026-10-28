import React, { useEffect, useRef, useReducer, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Subtitles, SkipForward, AlertCircle } from 'lucide-react';
import { introReducer, initialIntroContext } from './introMachine';
import { safeStorage, STORAGE_KEYS } from '../../lib/storage';
import { IntroVideoSettings } from '../../types/portfolio';

interface IntroOverlayProps {
  settings: IntroVideoSettings;
  fullName: string;
  professionalTitle: string;
  onFinished: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({
  settings,
  fullName,
  professionalTitle,
  onFinished,
}) => {
  const [ctx, dispatch] = useReducer(introReducer, initialIntroContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [progress, setProgress] = useState(0);
  const [skipFuture, setSkipFuture] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check autostart=1 query parameter or stored preference
    const params = new URLSearchParams(window.location.search);
    const autostart = params.get('autostart') === '1';
    const isSkipStored = safeStorage.get(STORAGE_KEYS.INTRO_SKIP) === 'true';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (autostart) {
      dispatch({
        type: 'PREF_LOADED',
        skip: true,
        reducedMotion: false,
        enabled: false,
      });
      return;
    }

    dispatch({
      type: 'PREF_LOADED',
      skip: isSkipStored,
      reducedMotion: prefersReducedMotion,
      enabled: settings.enabled,
    });
  }, [settings.enabled]);

  // Handle timeout for video loading
  useEffect(() => {
    if (ctx.state === 'intro-loading') {
      const timeoutMs = (settings.load_timeout_seconds || 4) * 1000;
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'TIMEOUT' });
      }, timeoutMs);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [ctx.state, settings.load_timeout_seconds]);

  // Auto-enter after 3 seconds on fallback screen as specified in App Flow V1
  useEffect(() => {
    if (ctx.state === 'intro-fallback') {
      const autoEnterTimer = setTimeout(() => {
        dispatch({ type: 'SKIP' });
      }, 3000);
      return () => clearTimeout(autoEnterTimer);
    }
  }, [ctx.state]);

  // When transitioning begins, wait for transition duration and then trigger onFinished
  useEffect(() => {
    if (ctx.state === 'transitioning') {
      const timer = setTimeout(() => {
        dispatch({ type: 'TRANSITION_DONE' });
        onFinished();
      }, 1300);
      return () => clearTimeout(timer);
    } else if (ctx.state === 'portfolio-ready') {
      onFinished();
    }
  }, [ctx.state, onFinished]);

  const handleSkip = () => {
    if (skipFuture) {
      safeStorage.set(STORAGE_KEYS.INTRO_SKIP, 'true');
    }
    dispatch({ type: 'SKIP' });
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  if (ctx.state === 'portfolio-ready') {
    return null;
  }

  const isTransitioning = ctx.state === 'transitioning';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0A0B10]"
        initial={{ opacity: 1 }}
        animate={{
          opacity: isTransitioning ? 0 : 1,
          scale: isTransitioning ? 0.94 : 1,
          filter: isTransitioning ? 'blur(10px)' : 'none',
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          borderRadius: isTransitioning ? '24px' : '0px',
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Portfolio Introduction Video"
      >
        {/* Ambient video glow in background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)',
          }}
        />

        {/* Video Canvas / Element */}
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={settings.video_desktop_url}
            poster={settings.poster_url}
            playsInline
            muted={isMuted}
            autoPlay
            onCanPlay={() => dispatch({ type: 'CAN_PLAY' })}
            onPlaying={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              dispatch({ type: 'PLAYING' });
            }}
            onEnded={() => dispatch({ type: 'ENDED' })}
            onError={() => dispatch({ type: 'ERROR' })}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{
              objectPosition: `${settings.focal_x}% ${settings.focal_y}%`,
            }}
          />

          {/* Subtitles / Captions Banner */}
          {showCaptions && settings.script_en && ctx.state === 'intro-playing' && !isTransitioning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-xl px-6 py-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-center pointer-events-none"
            >
              <p className="text-sm font-medium text-white/95 leading-relaxed tracking-wide">
                "{settings.script_en}"
              </p>
            </motion.div>
          )}

          {/* Top Bar: Name & Skip Control */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-auto">
            {settings.show_name_overlay && (
              <div className="glass-panel px-4 py-2 rounded-full border border-white/10 shadow-lg">
                <span className="text-xs uppercase tracking-widest text-[var(--accent-text)] font-semibold">
                  {fullName}
                </span>
                <span className="mx-2 text-white/30">•</span>
                <span className="text-xs text-white/70 font-mono">{professionalTitle}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="hidden sm:flex items-center gap-2 text-xs text-white/70 cursor-pointer bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md select-none hover:text-white transition">
                <input
                  type="checkbox"
                  checked={skipFuture}
                  onChange={(e) => setSkipFuture(e.target.checked)}
                  className="rounded border-white/20 text-[var(--accent)] focus:ring-0"
                />
                Don't show next time
              </label>

              <button
                onClick={handleSkip}
                className="px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white font-medium text-sm backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2 transition cursor-pointer"
                aria-label="Skip Introduction and Enter Site"
              >
                <span>Skip Intro</span>
                <SkipForward className="w-4 h-4 text-[var(--accent-text)]" />
              </button>
            </div>
          </div>

          {/* Fallback View for Errors / Autoplay Block / Slow Network */}
          {ctx.state === 'intro-fallback' && (
            <div className="absolute inset-0 bg-[#0A0B10]/90 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4 text-[var(--warning)] border border-white/10 shadow-xl">
                {ctx.isAutoplayBlocked ? <Play className="w-8 h-8 ml-1 text-white" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-bold font-display text-white mb-2">
                {ctx.isAutoplayBlocked ? 'Click to Play AI Intro' : 'Video Unavailable'}
              </h2>
              <p className="text-sm text-[var(--text-muted)] max-w-md mb-6 leading-relaxed">
                {ctx.isAutoplayBlocked
                  ? 'Your browser prevented auto-playing video. Click play below or enter the portfolio directly.'
                  : 'The cinematic video could not load. You can proceed directly to experience the full interactive portfolio.'}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {ctx.isAutoplayBlocked && (
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.play().then(() => {
                          dispatch({ type: 'PLAYING' });
                          setIsPlaying(true);
                        }).catch(() => {});
                      }
                    }}
                    className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-medium text-sm shadow-lg hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Play Video
                  </button>
                )}
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/15 transition cursor-pointer"
                >
                  Enter Site Directly
                </button>
              </div>
            </div>
          )}

          {/* Bottom Video Controls Bar */}
          {ctx.state === 'intro-playing' && !isTransitioning && (
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2 max-w-2xl mx-auto pointer-events-auto">
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--accent)] h-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between glass-panel px-4 py-2.5 rounded-full border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full hover:bg-white/10 text-white/90 transition cursor-pointer"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/10 text-white/90 transition cursor-pointer"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-xs text-white/60 font-mono">
                    {isMuted ? 'Muted (Tap to unmute)' : 'Audio On'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCaptions(!showCaptions)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer flex items-center gap-1.5 border ${
                      showCaptions
                        ? 'bg-[var(--accent)]/30 border-[var(--accent)] text-white'
                        : 'bg-transparent border-white/10 text-white/50 hover:text-white'
                    }`}
                    aria-label="Toggle Subtitles"
                  >
                    <Subtitles className="w-3.5 h-3.5" />
                    <span>CC</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
