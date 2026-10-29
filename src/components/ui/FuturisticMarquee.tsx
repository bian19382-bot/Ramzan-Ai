import React from 'react';
import { Sparkles, Terminal, Database, Cloud, Globe, Cpu, Zap, FolderTree } from 'lucide-react';

export const FuturisticMarquee: React.FC = () => {
  const items = [
    { label: 'Google AI Studio', icon: Sparkles, color: 'text-cyan-400' },
    { label: 'React & TypeScript', icon: Cpu, color: 'text-blue-400' },
    { label: 'Supabase Architecture', icon: Database, color: 'text-emerald-400' },
    { label: 'Tailwind CSS', icon: Zap, color: 'text-cyan-300' },
    { label: 'GitHub Workflow', icon: FolderTree, color: 'text-emerald-300' },
    { label: 'Cloudflare Edge', icon: Cloud, color: 'text-amber-400' },
    { label: 'Vercel & Netlify', icon: Globe, color: 'text-blue-300' },
    { label: 'AI-Assisted Workflow', icon: Terminal, color: 'text-purple-400' },
  ];

  // Duplicate for seamless loop
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full py-4 overflow-hidden border-y border-cyan-500/20 bg-[#0a0c12]/90 backdrop-blur-md">
      {/* Side gradient fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
        {displayItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-wider text-[var(--text-muted)] hover:text-white transition-colors cursor-default"
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color} shrink-0`} />
              <span className="font-semibold">{item.label}</span>
              <span className="text-cyan-500/40 text-xs ml-4">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
