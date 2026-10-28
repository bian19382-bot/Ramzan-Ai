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

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Every application page requires an authenticated Supabase user. */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<PublicPortfolio />} />
                <Route path="/resume" element={<ResumePage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/admin" element={<AdminPortal />} />
                <Route path="/admin/*" element={<AdminPortal />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
