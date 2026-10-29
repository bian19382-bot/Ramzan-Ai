import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-black/40 backdrop-blur-sm">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-500 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)] relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Leading Spark Laser Head */}
        {scrollProgress > 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-cyan-300 blur-[2px] shadow-[0_0_10px_#22d3ee,0_0_20px_#22d3ee]" />
        )}
      </div>
    </div>
  );
};
