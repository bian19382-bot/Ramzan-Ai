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

export const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return adminAuth.checkAuth();
  });
  const [tab, setTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    // Re-verify auth on mount and tab change
    setIsAuthenticated(adminAuth.checkAuth());
  }, []);

  const handleLogout = () => {
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
    <AdminLayout
      currentTab={tab}
      onSelectTab={(newTab) => setTab(newTab)}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
};
