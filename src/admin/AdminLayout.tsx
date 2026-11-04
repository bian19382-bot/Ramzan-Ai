import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { spinInFontVariants, mosqueDoorVariants, collidingSparksPanelVariants } from '../lib/animations';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Briefcase,
  Layers,
  MessageSquare,
  BarChart3,
  Video,
  Settings,
  Database,
  Download,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Shield,
  BookOpen,
  Globe,
  FolderTree,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../features/theme/ThemeContext';
import { dataProvider } from '../data/dataProvider';
import { BRAND_LOGO_URL, BRAND_LOGO_FALLBACK } from '../assets/brandLogo';

export type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'categories'
  | 'skills'
  | 'services'
  | 'experience'
  | 'testimonials'
  | 'blog'
  | 'intro'
  | 'inbox'
  | 'analytics'
  | 'seo'
  | 'sample-data'
  | 'settings'
  | 'backup';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  children,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sampleCount = dataProvider.getTotalSampleCount();
  const unreadInquiries = (dataProvider.getDatabase()?.inquiries || []).filter((i) => i?.status === 'new').length;

  const navLinks: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Case Studies', icon: FolderKanban },
    { id: 'categories', label: 'Taxonomy & Categories', icon: FolderTree },
    { id: 'skills', label: 'Skills & Tools', icon: Wrench },
    { id: 'services', label: 'Services & Packages', icon: Layers },
    { id: 'experience', label: 'Experience & Milestones', icon: Briefcase },
    { id: 'testimonials', label: 'Client Testimonials', icon: MessageSquare },
    { id: 'blog', label: 'Technical Insights & Blog', icon: BookOpen },
    { id: 'intro', label: 'AI Video Intro Manager', icon: Video },
    { id: 'inbox', label: 'Client Inquiries', icon: MessageSquare, badge: unreadInquiries > 0 ? unreadInquiries : undefined, badgeColor: 'bg-emerald-500 text-white' },
    { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
    { id: 'seo', label: 'SEO & OpenGraph', icon: Globe },
    { id: 'sample-data', label: 'Sample Data Manager', icon: Database, badge: sampleCount > 0 ? sampleCount : undefined, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
    { id: 'backup', label: 'Data Backup & Export', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden glass-panel border-b border-[var(--border)] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded-lg bg-[var(--surface-2)] text-[var(--text)]"
            aria-label="Toggle admin navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display font-bold text-sm tracking-tight">Studio Admin</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="p-1.5 rounded-lg bg-[var(--surface-2)] text-[var(--text)] text-xs flex items-center gap-1"
            title="View Site"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition cursor-pointer"
              title="Sign Out / Lock Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Left Sidebar (Desktop 260px / Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 w-64 md:w-64 z-40 glass-panel border-r border-[var(--border)] flex flex-col justify-between transition-transform duration-200 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } bg-[var(--surface)] overflow-y-auto`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-cyan-500/40 shadow-md bg-black shrink-0">
                <img
                  src={BRAND_LOGO_URL}
                  onError={(e) => {
                    e.currentTarget.src = BRAND_LOGO_FALLBACK;
                  }}
                  alt="Ramzan Brand"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <motion.h2
                  variants={spinInFontVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-sm font-bold font-display text-[var(--text)] leading-tight"
                >
                  Ramzan Studio
                </motion.h2>
                <motion.span
                  variants={spinInFontVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-[10px] font-mono text-cyan-500 block"
                >
                  Admin Engine
                </motion.span>
              </div>
            </div>

            <span className="hidden md:inline-flex text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Colliding Sparks Active</span>
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent)] text-white shadow-md font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        item.badgeColor || 'bg-[var(--surface-2)] text-[var(--text)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[var(--border)] space-y-3">
          {/* Authenticated Admin Account Info */}
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Authorized Admin</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/15">Active</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text)] truncate font-medium">
              babajani543210@gmail.com
            </p>
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span className="capitalize">{theme} Theme</span>
            </button>

            <a
              href="/"
              className="flex items-center gap-1.5 text-[var(--accent-text)] hover:underline text-xs font-semibold"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Lock Panel</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area with Fluid Page Transition */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              variants={collidingSparksPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative"
            >
              {/* Colliding Sparks Kinetic Tab Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/15 via-cyan-400/15 to-violet-500/15 blur-2xl pointer-events-none -z-10 opacity-70" />
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
