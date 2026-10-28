import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './features/theme/ThemeContext';
import { LanguageProvider } from './features/i18n/LanguageContext';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { ResumePage } from './pages/ResumePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminPortal } from './admin/AdminPortal';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicPortfolio />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/*" element={<AdminPortal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
