'use client';

import React, { useState, useMemo } from 'react';
import { Project, ProjectHealthInfo } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { Search, Layers } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
  healthMap: Record<string, ProjectHealthInfo>;
  onRefreshHealth: (project: Project) => void;
  onHover: (id: string) => void;
}

export function ProjectsSection({
  projects,
  healthMap,
  onRefreshHealth,
  onHover,
}: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter((p) => {
      return (
        p.title.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [projects, searchQuery]);

  return (
    <section id="projects" className="py-20 lg:py-28 px-4 sm:px-8 max-w-7xl mx-auto transition-colors">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-charcoal-900/20 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-blueprint-600 dark:text-blueprint-400 uppercase tracking-wider">
            <span>INDEX // 01</span>
            <span>—</span>
            <span>SYSTEM SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-charcoal-900 dark:text-white tracking-tight">
            Selected Works & Architecture
          </h2>
          <p className="mt-2 font-mono text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-400 max-w-xl">
            Live systems hosted on Render. Hovering or opening any sheet initiates automated cold-start pre-warming.
          </p>
        </div>

        {/* Search Filter Box */}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search projects or stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-parchment-50 dark:bg-charcoal-800 border border-charcoal-900/25 dark:border-white/15 rounded-[2px] font-mono text-xs text-charcoal-900 dark:text-white placeholder:text-charcoal-400 dark:placeholder:text-charcoal-500 focus:outline-none focus:border-blueprint-500 shadow-paper-sm transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-charcoal-500 dark:text-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              health={healthMap[project.id]}
              onRefreshHealth={() => onRefreshHealth(project)}
              onHover={onHover}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-parchment-50 dark:bg-charcoal-900 border border-dashed border-charcoal-900/20 dark:border-white/10 rounded p-8">
          <Layers className="w-10 h-10 text-charcoal-400 mx-auto mb-3" />
          <p className="font-mono text-sm text-charcoal-700 dark:text-charcoal-300 font-medium">
            No engineering sheets found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 font-mono text-xs text-blueprint-600 dark:text-blueprint-400 underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
