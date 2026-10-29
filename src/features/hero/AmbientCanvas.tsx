import React, { useEffect, useRef } from 'react';

interface AmbientCanvasProps {
  accentColor?: string;
}

export const AmbientCanvas: React.FC<AmbientCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -2000, y: -2000, targetX: -2000, targetY: -2000, radius: 180 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particle nodes: Cyber Cyan, Deep Neon Purple, Electric Blue
    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    const colors = [
      'rgba(6, 182, 212, ',   // cyan-500
      'rgba(59, 130, 246, ',  // blue-500
      'rgba(147, 51, 234, ',  // purple-600
    ];

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      baseAlpha: number;
      pulsePhase: number;
      pulseSpeed: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.35 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let time = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Futuristic Cyber Grid Floor lines
      const gridSize = 72;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.035)';

      const offsetX = (time * 8) % gridSize;
      const offsetY = (time * 6) % gridSize;

      ctx.beginPath();
      for (let x = -gridSize + offsetX; x < width + gridSize; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = -gridSize + offsetY; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Interactive Spotlight Follower (Futuristic Cyan Glow)
      if (mouse.x > -500) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
        glowGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.04)');
        glowGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Cyber Particles & Dynamic Constellation Grid
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.pulsePhase += p.pulseSpeed;
        const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5;

        // Mouse magnetic disturbance
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let alpha = p.baseAlpha + pulse * 0.15;
        let pRadius = p.radius;

        if (dist < mouse.radius) {
          const factor = 1 - dist / mouse.radius;
          alpha = Math.min(0.9, alpha + factor * 0.6);
          pRadius += factor * 1.5;

          // Gentle magnetic repulse/deflection
          p.x -= (dx / dist) * 0.7 * factor;
          p.y -= (dy / dist) * 0.7 * factor;
        }

        // Render Particle Node with halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Render Neural Connections between near nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          const maxDist = 120;

          if (dist2 < maxDist) {
            const lineAlpha = (1 - dist2 / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
