'use client';

import React from 'react';
import { Project, ProjectHealthInfo, DeploymentType } from '@/types/project';
import { RenderTelemetryBadge } from './RenderTelemetryBadge';
import { StampButton } from './StampButton';
import { ArrowUpRight, Cpu } from 'lucide-react';

export function getDeploymentProvider(project: Project): DeploymentType {
  if (project.deploymentType) return project.deploymentType;
  if (project.renderUrl && project.renderUrl.includes('onrender.com')) return 'render';
  if (project.demoUrl?.includes('vercel.app')) return 'vercel';
  if (project.renderUrl) return 'render';
  if (project.demoUrl) return 'live';
  return 'static';
}

interface ProjectCardProps {
  project: Project;
  index: number;
  health?: ProjectHealthInfo;
  onRefreshHealth?: () => void;
  onHover?: (id: string) => void;
}

export function ProjectCard({
  project,
  index,
  health,
  onRefreshHealth,
  onHover,
}: ProjectCardProps) {
  const sheetNumber = String(index + 1).padStart(2, '0');
  const provider = getDeploymentProvider(project);
  const primaryUrl = project.demoUrl || project.renderUrl;
  const displayUrl = project.renderUrl || project.demoUrl;

  return (
    <article
      onMouseEnter={() => onHover && onHover(project.id)}
      className="group relative bg-parchment-50 dark:bg-charcoal-900 border border-charcoal-900/25 dark:border-white/15 rounded-[3px] shadow-paper hover:shadow-paper-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Drafting Plate Header */}
      <div className="bg-parchment-200/90 dark:bg-charcoal-800/90 border-b border-charcoal-900/20 dark:border-white/10 px-4 py-2.5 flex items-center justify-between font-mono text-xs select-none transition-colors">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-blueprint-600 dark:text-blueprint-400 bg-blueprint-50 dark:bg-blueprint-900/40 px-1.5 py-0.5 rounded-xs border border-blueprint-500/30">
            SHEET #{sheetNumber}
          </span>
          <span className="text-charcoal-400 dark:text-charcoal-500">/</span>
          <span className="text-charcoal-600 dark:text-charcoal-300 tracking-wider uppercase text-[11px]">
            {project.category}
          </span>
        </div>

        {/* Live Infrastructure Telemetry Badge */}
        <RenderTelemetryBadge
          provider={provider}
          status={health?.status || 'idle'}
          latencyMs={health?.latencyMs}
          onRefresh={onRefreshHealth}
        />
      </div>

      <div className="p-5 sm:p-7 flex flex-col flex-1">
        {/* Project Image Frame with Drafting Crosshairs */}
        <div className="relative w-full h-48 sm:h-64 mb-6 rounded-[2px] overflow-hidden border border-charcoal-900/25 dark:border-white/15 bg-parchment-300/40 dark:bg-charcoal-800/50 group-hover:border-blueprint-500/50 transition-colors">
          {/* Architectural Crosshair Corners */}
          <div className="absolute top-1 left-1 text-charcoal-500 dark:text-charcoal-400 text-[10px] font-mono select-none z-10">
            +
          </div>
          <div className="absolute top-1 right-1 text-charcoal-500 dark:text-charcoal-400 text-[10px] font-mono select-none z-10">
            +
          </div>
          <div className="absolute bottom-1 left-1 text-charcoal-500 dark:text-charcoal-400 text-[10px] font-mono select-none z-10">
            +
          </div>
          <div className="absolute bottom-1 right-1 text-charcoal-500 dark:text-charcoal-400 text-[10px] font-mono select-none z-10">
            +
          </div>

          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 dark:brightness-[0.85] dark:contrast-[1.05] dark:group-hover:brightness-100 group-hover:scale-102 transition-all duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-blueprint-grid opacity-80 text-charcoal-500 dark:text-charcoal-400">
              <Cpu className="w-10 h-10 text-blueprint-500 mb-2 stroke-[1.5]" />
              <span className="font-mono text-xs uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">
                Specification Plate
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 bg-terracotta-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-[2px] shadow-paper-sm tracking-wider uppercase z-20">
              Featured Spec
            </div>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="mb-4">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-white tracking-tight leading-tight group-hover:text-blueprint-600 dark:group-hover:text-blueprint-400 transition-colors">
            {project.title}
          </h3>
          {project.tagline && (
            <p className="mt-1 font-mono text-xs sm:text-sm text-terracotta-600 dark:text-terracotta-400 font-medium leading-snug">
              {project.tagline}
            </p>
          )}
        </div>

        {/* Rich Description */}
        <p className="font-sans text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed mb-6 flex-1">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-dashed border-charcoal-900/15 dark:border-white/10">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-parchment-200/70 dark:bg-charcoal-800 border border-charcoal-900/15 dark:border-white/10 rounded-xs font-mono text-[11px] text-charcoal-700 dark:text-charcoal-300 select-none"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-charcoal-900/20 dark:border-white/10">
          <div className="flex items-center gap-2">
            {primaryUrl ? (
              <StampButton
                href={primaryUrl}
                external
                size="sm"
                variant={provider === 'render' && health?.status !== 'online' ? 'terracotta' : 'blueprint'}
                icon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                {provider === 'render'
                  ? health?.status === 'online'
                    ? 'Launch App (Hot)'
                    : 'Launch App (Render)'
                  : 'Launch Live App'}
              </StampButton>
            ) : null}

            {project.githubUrl && (
              <StampButton
                href={project.githubUrl}
                external
                size="sm"
                variant="paper"
                icon={
                  <svg className="w-3.5 h-3.5 fill-current text-charcoal-800 dark:text-charcoal-200" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                }
              >
                Repository
              </StampButton>
            )}
          </div>

          {/* Endpoint Monospace Info */}
          {displayUrl && (
            <div className="hidden sm:block text-right">
              <span className="font-mono text-[10px] text-charcoal-400 dark:text-charcoal-500 block truncate max-w-[180px]">
                {displayUrl.replace(/^https?:\/\//, '')}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
