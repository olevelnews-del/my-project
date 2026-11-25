import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { DashboardPage } from './pages/Dashboard';
import { PlannerPage } from './pages/Planner';
import { ChapterPage } from './pages/Chapter';
import { SyllabusPage } from './pages/Syllabus';
import { ScorecardPage } from './pages/Scorecard';
import { PricingPage } from './pages/Pricing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/chapter" element={<ChapterPage />} />
        <Route path="/syllabus" element={<SyllabusPage />} />
        <Route path="/scorecard" element={<ScorecardPage />} />
        <Route path="/revision" element={<PlannerPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/courses" element={<SyllabusPage />} />
      </Routes>
    </BrowserRouter>
  );
}
