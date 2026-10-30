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
    <div className="fixed top-0 left-0 right-0 h-[3.5px] z-50 pointer-events-none bg-slate-300/40 dark:bg-black/50 backdrop-blur-sm border-b border-black/5 dark:border-white/5 transition-colors duration-200">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-600 dark:via-cyan-400 dark:to-purple-500 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(37,99,235,0.6)] dark:shadow-[0_0_14px_rgba(6,182,212,0.85)] relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Leading Spark Laser Head */}
        {scrollProgress > 0.5 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 dark:bg-cyan-300 blur-[1px] shadow-[0_0_10px_#2563eb,0_0_20px_#38bdf8] dark:shadow-[0_0_10px_#22d3ee,0_0_20px_#22d3ee]" />
        )}
      </div>
    </div>
  );
};
