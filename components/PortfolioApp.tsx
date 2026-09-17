'use client';

import React, { useState } from 'react';
import { Project } from '@/types/project';
import { useRenderWarmer } from '@/hooks/useRenderWarmer';
import { CoordinatesHUD } from '@/components/CoordinatesHUD';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { RenderRadarDrawer } from '@/components/RenderRadarDrawer';
import { Footer } from '@/components/Footer';

interface PortfolioAppProps {
  initialProjects: Project[];
}

export function PortfolioApp({ initialProjects }: PortfolioAppProps) {
  const [projects] = useState<Project[]>(initialProjects);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  // Initialize automated Render cold-start warmer daemon
  const {
    healthMap,
    warmProject,
    warmOnHover,
    warmAll,
    isWarmingAll,
    stats,
  } = useRenderWarmer(projects);

  const handleOpenTelemetry = () => {
    setIsRadarOpen(true);
    // Also trigger an active warm refresh
    warmAll();
  };

  return (
    <div className="relative min-h-screen bg-parchment-100 dark:bg-dark-bg text-charcoal-900 dark:text-parchment-100 selection:bg-blueprint-500 selection:text-white transition-colors">
      {/* Live Mouse Coordinates HUD */}
      <CoordinatesHUD />

      {/* Floating Top Nav with Theme Toggle & Telemetry trigger */}
      <Header onOpenTelemetry={handleOpenTelemetry} />

      {/* Main Portfolio Sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          stats={stats}
          onWarmAll={warmAll}
          isWarmingAll={isWarmingAll}
          onOpenTelemetry={handleOpenTelemetry}
        />

        {/* Selected Works Grid */}
        <ProjectsSection
          projects={projects}
          healthMap={healthMap}
          onRefreshHealth={(p) => warmProject(p, 1)}
          onHover={warmOnHover}
        />
      </main>

      {/* Floating Render Cold-Start Radar Dock */}
      <RenderRadarDrawer
        projects={projects}
        healthMap={healthMap}
        onWarmAll={warmAll}
        isWarmingAll={isWarmingAll}
        isOpen={isRadarOpen}
        setIsOpen={setIsRadarOpen}
        stats={stats}
      />

      {/* Architectural Blueprint Footer */}
      <Footer />
    </div>
  );
}
