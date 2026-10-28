import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Download,
  RotateCcw,
  Mail,
  Shield,
  FolderKanban,
  FileText,
} from 'lucide-react';
import { Project } from '../../types/portfolio';
import { useTheme } from '../theme/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onOpenWelcome?: () => void;
  onReplayIntro?: () => void;
  onOpenAiConsultant: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onOpenWelcome,
  onReplayIntro,
  onOpenAiConsultant,
}) => {
  const [query, setQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects
    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.summary.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const navActions = [
    { label: 'Go to Home', target: '#home', icon: FileText },
    { label: 'Explore Selected Work', target: '#projects', icon: FolderKanban },
    { label: 'Capabilities & Stack', target: '#skills', icon: FileText },
    { label: 'Work Experience & Timeline', target: '#experience', icon: FileText },
    { label: 'Client Endorsements', target: '#testimonials', icon: FileText },
    { label: 'Start Project Discussion', target: '#contact', icon: Mail },
  ].filter((n) => n.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 sm:pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-10"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          {/* Search Input Box */}
          <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
            <Search className="w-5 h-5 text-[var(--accent-text)] shrink-0" />
            <input
              autoFocus
              type="text"
              value={query ?? ''}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sections, projects, or actions..."
              className="w-full bg-transparent border-none text-sm sm:text-base text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition"
              aria-label="Close command palette"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-3 max-h-96 overflow-y-auto space-y-4">
            {/* Action Triggers */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] px-3 py-1 font-semibold">
                Quick Actions
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAiConsultant();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-left flex items-center justify-between hover:bg-[var(--surface-2)] text-[var(--text)] group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[var(--accent-text)]" />
                    <span>Open AI Scoping Assistant</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--accent-text)]">Gemini 4</span>
                </button>

                <button
                  onClick={() => {
                    toggleTheme();
                    onClose();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-left flex items-center justify-between hover:bg-[var(--surface-2)] text-[var(--text)] group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-[var(--accent)]" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>Toggle Dark / Light Theme</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] capitalize">{theme}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onOpenWelcome) onOpenWelcome();
                    else if (onReplayIntro) onReplayIntro();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm text-left flex items-center justify-between hover:bg-[var(--surface-2)] text-[var(--text)] group transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    <span>View Welcome Neon Banner</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Banner</span>
                </button>
              </div>
            </div>

            {/* Projects */}
            {filteredProjects.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] px-3 py-1 font-semibold">
                  Projects & Case Studies
                </p>
                <div className="space-y-1">
                  {filteredProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onClose();
                        onSelectProject(p);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-left flex items-center justify-between hover:bg-[var(--surface-2)] text-[var(--text)] group transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FolderKanban className="w-4 h-4 text-[var(--accent)] shrink-0" />
                        <span className="truncate">{p.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-text)] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation links */}
            {navActions.length > 0 && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] px-3 py-1 font-semibold">
                  Navigate
                </p>
                <div className="space-y-1">
                  {navActions.map((nav, idx) => (
                    <a
                      key={idx}
                      href={nav.target}
                      onClick={onClose}
                      className="px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] group transition"
                    >
                      <span>{nav.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-[var(--accent)]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="p-3 bg-[var(--surface-2)]/60 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
            <span>Navigation: Click or Enter</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
