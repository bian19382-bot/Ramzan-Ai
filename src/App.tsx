import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './features/theme/ThemeContext';
import { LanguageProvider } from './features/i18n/LanguageContext';
import { AuthProvider } from './features/auth/AuthProvider';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { ResumePage } from './pages/ResumePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminPortal } from './admin/AdminPortal';
import { AdminErrorBoundary } from './admin/AdminErrorBoundary';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Website - Bilkul khula aur open for all visitors (no login required) */}
              <Route path="/" element={<PublicPortfolio />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />

              {/* Admin Authentication Route */}
              <Route
                path="/login"
                element={
                  <AdminErrorBoundary>
                    <LoginPage />
                  </AdminErrorBoundary>
                }
              />

              {/* Protected Admin Portal */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/admin"
                  element={
                    <AdminErrorBoundary>
                      <AdminPortal />
                    </AdminErrorBoundary>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <AdminErrorBoundary>
                      <AdminPortal />
                    </AdminErrorBoundary>
                  }
                />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
