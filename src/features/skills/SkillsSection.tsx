import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Radio, Sparkles, CheckCircle2, Cpu } from 'lucide-react';
import { Skill, SkillGroup } from '../../types/portfolio';
import { useLanguage } from '../i18n/LanguageContext';
import { cinematicFadeUp, safeViewport } from '../../lib/cinematicMotion';
import {
  GoogleAiStudioLogo,
  OpenAiLogo,
  ClaudeLogo,
  SupabaseLogo,
  CloudflareLogo,
  GitHubLogo,
  VercelLogo,
  ReactTsLogo,
  TailwindLogo,
} from '../../components/icons/BrandIcons';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
  skills: Skill[];
}

interface PowerTool {
  id: string;
  name: string;
  category: string;
  status: 'ACTIVE WORKFLOW' | 'LEARNING & PRACTICING' | 'EXPLORING';
  statusColor: string;
  icon: React.ReactNode;
  description: string;
  coordinates: string;
}

const POWER_TOOLS: PowerTool[] = [
  {
    id: 'tool-ai-studio',
    name: 'Google AI Studio',
    category: 'AI WORKFLOW',
    status: 'ACTIVE WORKFLOW',
    statusColor: 'text-cyan-400 border-cyan-400/40 bg-cyan-500/10',
    icon: <GoogleAiStudioLogo size={22} />,
    description: 'Prompt engineering, structured schemas, multi-modal context exploration, and server-side Gemini API integration.',
    coordinates: 'GRID // 34.2°N - RADAR 01',
  },
  {
    id: 'tool-supabase',
    name: 'Supabase',
    category: 'DATA & STORAGE',
    status: 'ACTIVE WORKFLOW',
    statusColor: 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10',
    icon: <SupabaseLogo size={22} />,
    description: 'PostgreSQL database persistence, Row Level Security (RLS) enforcement, client synchronization, and edge auth sessions.',
    coordinates: 'GRID // 68.5°N - RADAR 02',
  },
  {
    id: 'tool-github',
    name: 'GitHub',
    category: 'SOURCE CONTROL',
    status: 'ACTIVE WORKFLOW',
    statusColor: 'text-white border-white/40 bg-white/10',
    icon: <GitHubLogo size={22} />,
    description: 'Git branch isolation, pull request tracking, modular repository structure, and automated deployment pipelines.',
    coordinates: 'GRID // 112.0°E - RADAR 03',
  },
  {
    id: 'tool-cloudflare',
    name: 'Cloudflare',
    category: 'EDGE DEPLOYMENT',
    status: 'ACTIVE WORKFLOW',
    statusColor: 'text-amber-400 border-amber-400/40 bg-amber-500/10',
    icon: <CloudflareLogo size={22} />,
    description: 'Cloudflare Pages, Edge Functions routing, zero-bundle secrets, and custom domain SSL configurations.',
    coordinates: 'GRID // 156.4°E - RADAR 04',
  },
  {
    id: 'tool-chatgpt',
    name: 'ChatGPT',
    category: 'REASONING & LOGIC',
    status: 'ACTIVE WORKFLOW',
    statusColor: 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10',
    icon: <OpenAiLogo size={22} />,
    description: 'Logic verification, structural refactoring, technical documentation drafting, and problem decomposition.',
    coordinates: 'GRID // 201.1°S - RADAR 05',
  },
  {
    id: 'tool-claude',
    name: 'Claude AI',
    category: 'SYSTEM ANALYSIS',
    status: 'ACTIVE WORKFLOW',
    statusColor: 'text-amber-400 border-amber-400/40 bg-amber-500/10',
    icon: <ClaudeLogo size={22} />,
    description: 'TypeScript algorithm auditing, design token alignment, architectural scoping, and code quality reviews.',
    coordinates: 'GRID // 245.8°S - RADAR 06',
  },
  {
    id: 'tool-vercel',
    name: 'Vercel & Netlify',
    category: 'SERVERLESS HOSTING',
    status: 'LEARNING & PRACTICING',
    statusColor: 'text-violet-400 border-violet-400/40 bg-violet-500/10',
    icon: <VercelLogo size={22} />,
    description: 'Edge preview environments, deployment rollbacks, static asset distribution, and continuous deployment.',
    coordinates: 'GRID // 290.2°W - RADAR 07',
  },
  {
    id: 'tool-web-dev',
    name: 'Web Development',
    category: 'CORE SPECIALIZATION',
    status: 'ACTIVE WORKFLOW',
    statusColor: 'text-cyan-400 border-cyan-400/40 bg-cyan-500/10',
    icon: <ReactTsLogo size={22} />,
    description: 'React 19 SPA, TypeScript, Tailwind CSS, semantic HTML5, WCAG 2.2 accessibility, and responsive layouts.',
    coordinates: 'GRID // 335.7°W - RADAR 08',
  },
];

export const SkillsSection: React.FC<SkillsSectionProps> = () => {
  const { language } = useLanguage();
  const isRoman = language === 'ur-roman';
  const [selectedTool, setSelectedTool] = useState<PowerTool>(POWER_TOOLS[0]);

  return (
    <section id="skills" className="py-28 px-5 sm:px-8 lg:px-12 bg-[#0A0B10] border-t border-white/5 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] w-full mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={cinematicFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={safeViewport}
          className="mb-16 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 uppercase tracking-widest mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>CHAPTER 03 // TELEMETRY & CAPABILITIES</span>
            </div>
            <h2 className="font-cinematic text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase">
              POWER PROFILE
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] font-sans mt-2 max-w-xl">
              {isRoman
                ? 'Tools, platforms aur technologies jinhe main real-world projects me use karta aur seekhta hoon.'
                : 'Current technical ecosystem, verified developer tools, and workflow technologies.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>RADAR STATUS: ACTIVE SWEEP</span>
          </div>
        </motion.div>

        {/* Main Interface: Left Radar Visual Scanner, Right Technical Tool Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (5 cols): Radar-Inspired Visual Design */}
          <motion.div
            variants={cinematicFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={safeViewport}
            className="lg:col-span-5 flex flex-col items-center justify-center relative p-6 sm:p-8 rounded-3xl bg-[#0D0F14] border border-white/10"
          >
            {/* Concentric Radar Rings Stage */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
              {/* Outer Ring */}
              <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
              {/* Mid Ring */}
              <div className="absolute inset-16 rounded-full border border-white/10" />
              {/* Inner Ring */}
              <div className="absolute inset-28 rounded-full border border-cyan-500/30" />
              {/* Crosshair Axes */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />

              {/* Animated Radar Sweep Beam */}
              <div className="radar-sweep-beam" />

              {/* Central Core */}
              <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.8)] z-10">
                <div className="w-2 h-2 rounded-full bg-black animate-ping" />
              </div>

              {/* Dynamic Target Points on Radar */}
              {POWER_TOOLS.map((t, idx) => {
                const angle = (idx * 360) / POWER_TOOLS.length;
                const rad = (angle * Math.PI) / 180;
                const distance = 85 + (idx % 3) * 15; // Radius %
                const x = 50 + (distance / 2.3) * Math.cos(rad);
                const y = 50 + (distance / 2.3) * Math.sin(rad);

                const isSelected = selectedTool.id === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTool(t)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-400 scale-150 shadow-[0_0_15px_rgba(56,189,248,1)] z-20'
                        : 'bg-white/40 hover:bg-white hover:scale-125 z-10'
                    }`}
                    title={t.name}
                    aria-label={`Select ${t.name}`}
                  />
                );
              })}
            </div>

            {/* Active Radar Target Telemetry Card */}
            <div className="mt-6 w-full p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-bold">{selectedTool.coordinates}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase border ${selectedTool.statusColor}`}>
                  {selectedTool.status}
                </span>
              </div>
              <h4 className="text-base font-bold font-display text-white">{selectedTool.name}</h4>
              <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed">
                {selectedTool.description}
              </p>
            </div>
          </motion.div>

          {/* Right Column (7 cols): Horizontal Skill Indicators & Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POWER_TOOLS.map((tool, idx) => {
              const isSelected = selectedTool.id === tool.id;

              return (
                <motion.div
                  key={tool.id}
                  variants={cinematicFadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={safeViewport}
                  custom={idx * 0.05}
                  onClick={() => setSelectedTool(tool)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/[0.05] border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.15)]'
                      : 'bg-[#0D0F14] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Top Status */}
                    <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                      <span className="text-[#71717A] tracking-wider">{tool.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase border font-semibold ${tool.statusColor}`}>
                        {tool.status}
                      </span>
                    </div>

                    {/* Logo & Name */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                        {tool.icon}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white font-display">
                        {tool.name}
                      </h4>
                    </div>

                    <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed font-sans">
                      {tool.description}
                    </p>
                  </div>

                  {/* Horizontal Progress / Signal Bar */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                    <span>STATUS // VERIFIED</span>
                    <span className="text-cyan-400">PRACTICE READY</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
