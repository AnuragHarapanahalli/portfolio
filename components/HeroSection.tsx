'use client';

import React from 'react';
import { portfolioConfig } from '@/data/portfolio-config';
import { StampButton } from './StampButton';
import { Radio, ArrowDown, Activity, Terminal } from 'lucide-react';

interface HeroSectionProps {
  stats: {
    total: number;
    online: number;
    warming: number;
    idle: number;
  };
  onWarmAll: () => void;
  isWarmingAll: boolean;
  onOpenTelemetry?: () => void;
}

export function HeroSection({
  stats,
  onWarmAll,
  isWarmingAll,
  onOpenTelemetry,
}: HeroSectionProps) {
  return (
    <section className="relative pt-32 lg:pt-44 pb-20 lg:pb-32 px-4 sm:px-8 border-b border-charcoal-900/15 dark:border-white/10 overflow-hidden transition-colors">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60 dark:opacity-40 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center z-10">
        {/* Eyebrow / Technical Badge */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-parchment-200/80 dark:bg-charcoal-800/80 border border-charcoal-900/20 dark:border-white/15 rounded-[2px] shadow-paper-sm mb-8 font-mono text-[11px] text-charcoal-700 dark:text-charcoal-300 transition-colors">
          <span className="w-2 h-2 rounded-full bg-blueprint-500 animate-pulse" />
          <span className="font-semibold text-blueprint-600 dark:text-blueprint-400">CLOUD OBSERVABILITY & TELEMETRY</span>
          <span className="text-charcoal-400 dark:text-charcoal-500">//</span>
          <span>
            {stats.online}/{stats.total} SERVICES HOT
          </span>
        </div>

        {/* Massive Hero Title with Layered Outline & Handwritten Notes */}
        <div className="relative w-full my-4 select-none">
          {/* Handwritten Annotation 1 (Top Left) */}
          <div className="absolute -top-7 left-2 sm:left-12 -rotate-3 font-architect text-xl sm:text-2xl text-charcoal-500 dark:text-charcoal-400 hidden sm:flex flex-col items-start pointer-events-none">
            <span className="flex items-center gap-1 text-terracotta-500 dark:text-terracotta-400">
              <span className="font-mono text-xs">①</span> {portfolioConfig.heroAnnotation1}
            </span>
            <svg
              className="w-28 h-2 text-terracotta-500 dark:text-terracotta-400"
              viewBox="0 0 120 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.5C25 1.5 50 7.5 75 3.5C95 0.5 110 5.5 119 4.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-charcoal-900 dark:text-white leading-[0.95] sm:leading-[0.9]">
            <span className="block">{portfolioConfig.heroHeadlineTop}</span>
            <span className="relative inline-block mt-2">
              {/* Stroke outline layered under solid */}
              <span
                className="text-stroke-1 text-transparent select-none block"
                aria-hidden="true"
              >
                {portfolioConfig.heroHeadlineStroke}
              </span>
              <span className="absolute inset-0 text-charcoal-900 dark:text-white block">
                {portfolioConfig.heroHeadlineStroke}
              </span>
            </span>
          </h1>

          {/* Handwritten Annotation 2 (Bottom Right) */}
          <div className="absolute -bottom-7 right-2 sm:right-12 rotate-2 font-architect text-xl sm:text-2xl text-charcoal-500 dark:text-charcoal-400 hidden sm:flex items-center gap-1.5 pointer-events-none">
            <span className="text-charcoal-400 dark:text-charcoal-500 font-mono text-sm">↳</span>
            <span className="text-blueprint-500 dark:text-blueprint-400 underline decoration-wavy decoration-blueprint-500/60">
              {portfolioConfig.heroAnnotation2}
            </span>
          </div>
        </div>

        {/* Narrative Subtitle */}
        <p className="mt-8 max-w-2xl font-sans text-base sm:text-lg text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
          {portfolioConfig.tagline}
        </p>

        {/* Render Pre-Warm Callout / Telemetry Strip */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-2.5 bg-parchment-50 dark:bg-charcoal-900 border border-charcoal-900/20 dark:border-white/15 rounded shadow-paper font-mono text-xs text-charcoal-700 dark:text-charcoal-300">
          <button
            onClick={() => {
              if (onOpenTelemetry) onOpenTelemetry();
            }}
            className="flex items-center gap-2 hover:text-blueprint-500 transition-colors cursor-pointer text-left"
          >
            <Radio className="w-3.5 h-3.5 text-blueprint-500 animate-spin" />
            <span className="font-semibold text-charcoal-900 dark:text-white">Cloud Telemetry:</span>
            <span>Render backends pre-warmed & Vercel edge delivery active. Click to inspect telemetry.</span>
          </button>
          <div className="h-3 w-[1px] bg-charcoal-300 dark:bg-charcoal-700 hidden sm:block" />
          <button
            onClick={onWarmAll}
            disabled={isWarmingAll}
            className="text-blueprint-600 dark:text-blueprint-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{isWarmingAll ? 'Warming...' : 'Force Re-ping All'}</span>
            <Activity className="w-3 h-3" />
          </button>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <StampButton
            href="#projects"
            variant="blueprint"
            size="md"
            icon={<ArrowDown className="w-4 h-4" />}
          >
            Explore Projects
          </StampButton>

          <StampButton
            href={portfolioConfig.socials.email || `mailto:${portfolioConfig.email}`}
            external
            variant="paper"
            size="md"
            icon={<Terminal className="w-4 h-4 text-blueprint-600" />}
          >
            Get in Touch
          </StampButton>
        </div>
      </div>
    </section>
  );
}
