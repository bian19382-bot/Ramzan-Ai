import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

type CursorMode = 'default' | 'hover' | 'nav' | 'project' | 'button';

export const FuturisticCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Only enable on desktop devices with mouse pointer
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setEnabled(true);
    } else {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hovered element for cursor mode & magnetic target
      const target = e.target;
      if (!(target instanceof Element)) {
        setMode('default');
        targetPos.current = null;
        return;
      }

      // 1. Check Project Card
      const projectTarget = target.closest('[data-cursor="project"]');
      if (projectTarget) {
        setMode('project');
        targetPos.current = null;
        return;
      }

      // 2. Check Nav Element
      const navTarget = target.closest('[data-cursor="nav"]') || target.closest('nav a');
      if (navTarget instanceof Element && typeof navTarget.getBoundingClientRect === 'function') {
        setMode('nav');
        const rect = navTarget.getBoundingClientRect();
        targetPos.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        return;
      }

      // 3. Check Button / Action Target
      const buttonTarget =
        target.closest('[data-cursor="button"]') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer');

      if (buttonTarget instanceof Element && typeof buttonTarget.getBoundingClientRect === 'function') {
        setMode('button');
        const rect = buttonTarget.getBoundingClientRect();
        // Gentle magnetic pull toward element center if within 50px
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 50) {
          targetPos.current = {
            x: e.clientX * 0.45 + centerX * 0.55,
            y: e.clientY * 0.45 + centerY * 0.55,
          };
        } else {
          targetPos.current = null;
        }
        return;
      }

      setMode('default');
      targetPos.current = null;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // High performance RAF loop with magnetic damping
    let animId: number;
    const animateRing = () => {
      // If magnetic target is active, interpolate toward magnetic center; otherwise toward mouse
      const destX = targetPos.current ? targetPos.current.x : mousePos.current.x;
      const destY = targetPos.current ? targetPos.current.y : mousePos.current.y;

      const lerpFactor = targetPos.current ? 0.24 : 0.16;
      ringPos.current.x += (destX - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (destY - ringPos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      animId = requestAnimationFrame(animateRing);
    };
    animId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!enabled || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Center Precise Cyber Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full transition-transform duration-75 ease-out ${
          mode === 'project'
            ? 'opacity-0'
            : mode === 'nav' || mode === 'button'
            ? 'bg-cyan-300 shadow-[0_0_12px_#22d3ee] scale-125'
            : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
        }`}
      />

      {/* Outer Magnetic Interactive Halo / Reticle */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 transition-all duration-200 ease-out flex items-center justify-center rounded-full ${
          isClicking
            ? 'w-7 h-7 -ml-3.5 -mt-3.5 border-cyan-400 bg-cyan-400/30 scale-90'
            : mode === 'project'
            ? 'w-20 h-20 -ml-10 -mt-10 border border-cyan-400/70 bg-[#080b12]/85 backdrop-blur-md shadow-[0_0_35px_rgba(6,182,212,0.45)]'
            : mode === 'nav'
            ? 'w-12 h-12 -ml-6 -mt-6 border-2 border-cyan-400 bg-cyan-500/15 shadow-[0_0_22px_rgba(6,182,212,0.4)] scale-110'
            : mode === 'button'
            ? 'w-14 h-14 -ml-7 -mt-7 border border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-105'
            : 'w-8 h-8 -ml-4 -mt-4 border border-cyan-400/35 bg-transparent shadow-[0_0_10px_rgba(6,182,212,0.12)]'
        }`}
      >
        {/* Project Card Inspection Reticle */}
        {mode === 'project' && (
          <div className="flex flex-col items-center justify-center text-cyan-300 text-[10px] font-mono font-bold tracking-wider animate-in fade-in zoom-in-95 duration-150">
            <span className="flex items-center gap-0.5">
              <span>VIEW</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-300" />
            </span>
            <span className="text-[7px] text-cyan-400/80 -mt-0.5 uppercase tracking-tighter">
              PROJECT
            </span>
          </div>
        )}

        {/* Nav Magnetic Crosshair Pulse */}
        {mode === 'nav' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
          </div>
        )}

        {/* Button Magnetic Corner Ticks */}
        {mode === 'button' && (
          <>
            <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-cyan-400" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-cyan-400" />
            <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-cyan-400" />
            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-cyan-400" />
          </>
        )}
      </div>
    </div>
  );
};
