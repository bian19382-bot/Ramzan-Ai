import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminLogin } from './AdminLogin';
import { adminAuth } from './auth/adminAuth';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProjects } from './pages/AdminProjects';
import { AdminSkills } from './pages/AdminSkills';
import { AdminServices } from './pages/AdminServices';
import { AdminExperience } from './pages/AdminExperience';
import { AdminTestimonials } from './pages/AdminTestimonials';
import { AdminIntroManager } from './pages/AdminIntroManager';
import { AdminInbox } from './pages/AdminInbox';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminSampleData } from './pages/AdminSampleData';
import { AdminSettings } from './pages/AdminSettings';
import { AdminBackup } from './pages/AdminBackup';
import { AdminBlog } from './pages/AdminBlog';
import { AdminSeo } from './pages/AdminSeo';
import { AdminCategories } from './pages/AdminCategories';
import { useAuth } from '../features/auth/AuthProvider';
import { motion } from 'motion/react';
import { cinematicFadeUp } from '../lib/cinematicMotion';
import { soundFx } from '../lib/soundFx';

export const AdminPortal: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return adminAuth.checkAuth() || Boolean(user && user.email?.toLowerCase() === 'babajani543210@gmail.com');
  });
  const [tab, setTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    setIsAuthenticated(
      adminAuth.checkAuth() || Boolean(user && user.email?.toLowerCase() === 'babajani543210@gmail.com')
    );
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {}
    adminAuth.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (tab) {
      case 'dashboard':
        return <AdminDashboard onNavigateTab={(newTab) => setTab(newTab)} />;
      case 'projects':
        return <AdminProjects />;
      case 'categories':
        return <AdminCategories />;
      case 'skills':
        return <AdminSkills />;
      case 'services':
        return <AdminServices />;
      case 'experience':
        return <AdminExperience />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'blog':
        return <AdminBlog />;
      case 'intro':
        return <AdminIntroManager />;
      case 'inbox':
        return <AdminInbox />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'seo':
        return <AdminSeo />;
      case 'sample-data':
        return <AdminSampleData />;
      case 'settings':
        return <AdminSettings />;
      case 'backup':
        return <AdminBackup />;
      default:
        return <AdminDashboard onNavigateTab={(newTab) => setTab(newTab)} />;
    }
  };

  return (
    <motion.div
      variants={cinematicFadeUp}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-hidden bg-[#070709]"
    >
      {/* Alter Ego Ambient telemetry background */}
      <div className="fixed -inset-10 bg-[#38bdf8]/5 blur-3xl pointer-events-none -z-10" />

      <AdminLayout
        currentTab={tab}
        onSelectTab={(newTab) => {
          soundFx.playTabSwitch();
          setTab(newTab);
        }}
        onLogout={handleLogout}
      >
        {renderContent()}
      </AdminLayout>
    </motion.div>
  );
};
