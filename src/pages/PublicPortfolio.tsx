import React, { useState, useEffect } from 'react';
import { dataProvider } from '../data/dataProvider';
import { WelcomePhotoBanner } from '../features/welcome/WelcomePhotoBanner';
import { safeStorage } from '../lib/storage';
import { ScrollProgress } from '../features/nav/ScrollProgress';
import { Navbar } from '../features/nav/Navbar';
import { HeroSection } from '../features/hero/HeroSection';
import { AboutSection } from '../features/about/AboutSection';
import { SkillsSection } from '../features/skills/SkillsSection';
import { FeaturedProjects } from '../features/projects/FeaturedProjects';
import { ServicesSection } from '../features/services/ServicesSection';
import { ExperienceSection } from '../features/experience/ExperienceSection';
import { TestimonialsSection } from '../features/testimonials/TestimonialsSection';
import { BlogSection } from '../features/blog/BlogSection';
import { ContactSection } from '../features/contact/ContactSection';
import { Footer } from '../features/footer/Footer';
import { CommandPalette } from '../features/palette/CommandPalette';
import { AiProjectConsultant } from '../features/ai/AiProjectConsultant';
import { PrivacyModal } from '../features/privacy/PrivacyModal';
import { Project } from '../types/portfolio';
import { FuturisticCursor } from '../components/ui/FuturisticCursor';
import { FuturisticMarquee } from '../components/ui/FuturisticMarquee';
import { FuturisticHudDock } from '../components/ui/FuturisticHudDock';

const STORAGE_WELCOME_DISMISSED = 'portfolio_welcome_banner_dismissed';

export const PublicPortfolio: React.FC = () => {
  const [db, setDb] = useState(dataProvider.getDatabase());
  const [welcomeBannerOpen, setWelcomeBannerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [aiConsultantOpen, setAiConsultantOpen] = useState(false);
  const [aiConsultantTopic, setAiConsultantTopic] = useState('');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');

  // Subscribe to reactive database changes
  useEffect(() => {
    return dataProvider.subscribe(() => {
      setDb({ ...dataProvider.getDatabase() });
    });
  }, []);

  // Track page view analytics
  useEffect(() => {
    dataProvider.trackEvent({
      event: 'page_view',
      path: window.location.pathname,
      session_id: 'session-' + Date.now().toString(36),
      device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
    });

    const handleAdminShortcut = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl + Shift + A / Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handleAdminShortcut);
    return () => window.removeEventListener('keydown', handleAdminShortcut);
  }, []);

  const handleOpenWelcome = () => {
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectServiceForContact = (serviceName: string) => {
    setPreselectedService(serviceName);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAiForProject = (projectTitle: string) => {
    setAiConsultantTopic(projectTitle);
    setAiConsultantOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {/* Cyber Reticle & Spring Inertia Custom Cursor */}
      <FuturisticCursor />

      {/* Interactive Welcome Photo Banner with Quick Dismiss */}
      <WelcomePhotoBanner
        profile={db.profile}
        isOpen={welcomeBannerOpen}
        onDismiss={() => setWelcomeBannerOpen(false)}
      />

      {/* Thin Top Scroll Progress */}
      {db.settings.feature_flags.scroll_progress_enabled && <ScrollProgress />}

      {/* Floating Glass Navigation */}
      <Navbar
        siteName={db.settings.site_name}
        items={db.nav_items}
        socials={db.social_links}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenAiConsultant={() => {
          setAiConsultantTopic('');
          setAiConsultantOpen(true);
        }}
        onOpenWelcome={handleOpenWelcome}
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1}>
        <HeroSection
          profile={db.profile}
          settings={db.settings}
          socials={db.social_links}
          onOpenAiConsultant={() => {
            setAiConsultantTopic('');
            setAiConsultantOpen(true);
          }}
        />

        {/* Futuristic Tech Marquee Stream */}
        <FuturisticMarquee />

        <AboutSection profile={db.profile} />

        <SkillsSection skillGroups={db.skill_groups} skills={db.skills} />

        <FeaturedProjects
          projects={db.projects}
          categories={db.categories}
          onOpenConsultantForProject={handleOpenAiForProject}
        />

        <ServicesSection
          services={db.services}
          faqs={db.faqs}
          pricingEnabled={db.settings.feature_flags.pricing_enabled}
          onSelectServiceForContact={handleSelectServiceForContact}
        />

        {db.experiences.length > 0 && (
          <ExperienceSection
            experiences={db.experiences}
            education={db.education}
            certifications={db.certifications}
            achievements={db.achievements}
          />
        )}

        {db.settings.feature_flags.testimonials_enabled && db.testimonials.length > 0 && (
          <TestimonialsSection testimonials={db.testimonials} />
        )}

        {db.blog_posts.length > 0 && <BlogSection posts={db.blog_posts} />}

        <ContactSection
          settings={db.settings}
          services={db.services}
          preselectedService={preselectedService}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={db.settings}
        socials={db.social_links}
        navItems={db.nav_items}
        onOpenWelcome={handleOpenWelcome}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Command Palette (Ctrl/Cmd+K) */}
      {db.settings.feature_flags.command_palette_enabled && (
        <CommandPalette
          isOpen={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          projects={db.projects}
          onSelectProject={(p) => {
            // Scroll to projects and open case study
            const projEl = document.getElementById('projects');
            if (projEl) projEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenWelcome={handleOpenWelcome}
          onOpenAiConsultant={() => {
            setAiConsultantTopic('');
            setAiConsultantOpen(true);
          }}
        />
      )}

      {/* AI Architecture Consultant with High Thinking Mode */}
      {db.settings.feature_flags.ai_consultant_enabled && (
        <AiProjectConsultant
          isOpen={aiConsultantOpen}
          onClose={() => setAiConsultantOpen(false)}
          onPreselectService={handleSelectServiceForContact}
          initialTopic={aiConsultantTopic}
        />
      )}

      {/* Privacy Notice Modal */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Floating Futuristic HUD Dock (WhatsApp Radar & Thruster) */}
      <FuturisticHudDock whatsappNumber={db.settings.whatsapp_number} />
    </div>
  );
};
