'use client';

import React from 'react';
import { Project, ProjectHealthInfo } from '@/types/project';
import { RenderTelemetryBadge } from './RenderTelemetryBadge';
import { ChevronUp, ChevronDown, RefreshCw, Radio, X } from 'lucide-react';

interface RenderRadarDrawerProps {
  projects: Project[];
  healthMap: Record<string, ProjectHealthInfo>;
  onWarmAll: () => void;
  isWarmingAll: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  stats?: { total: number; online: number; warming: number; idle: number };
}

export function RenderRadarDrawer({
  projects,
  healthMap,
  onWarmAll,
  isWarmingAll,
  isOpen,
  setIsOpen,
  stats,
}: RenderRadarDrawerProps) {
  const renderProjects = projects.filter((p) => Boolean(p.renderUrl));
  const onlineCount = stats?.online ?? 0;
  const warmingCount = stats?.warming ?? 0;

  return (
    <aside
      id="telemetry"
      aria-label="Render Service Telemetry Radar"
      className="fixed bottom-4 right-4 z-40 max-w-sm w-[92vw] sm:w-96 font-mono text-xs select-none"
    >
      <div
        className={`bg-parchment-50 dark:bg-charcoal-900 border border-charcoal-900/30 dark:border-white/20 rounded shadow-paper-lg overflow-hidden backdrop-blur-md transition-all duration-300 ${
          isOpen ? 'ring-2 ring-blueprint-500/50' : ''
        }`}
      >
        {/* Dock Bar / Toggle Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-parchment-200/95 dark:bg-charcoal-800/95 px-3.5 py-2.5 flex items-center justify-between border-b border-charcoal-900/20 dark:border-white/10 cursor-pointer hover:bg-parchment-300/80 dark:hover:bg-charcoal-700/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Radio
              className={`w-3.5 h-3.5 text-blueprint-600 dark:text-blueprint-400 ${
                warmingCount > 0 ? 'animate-spin' : ''
              }`}
            />
            <span className="font-bold text-charcoal-900 dark:text-white tracking-tight">
              RENDER RADAR
            </span>
            <span className="text-charcoal-400">//</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-blueprint-500 text-white font-semibold">
              {onlineCount}/{renderProjects.length} HOT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWarmAll();
              }}
              disabled={isWarmingAll}
              className="p-1 hover:bg-charcoal-900/10 dark:hover:bg-white/10 rounded text-charcoal-700 dark:text-charcoal-300 hover:text-blueprint-600 transition-colors cursor-pointer"
              title="Force Warm All Services"
            >
              <RefreshCw className={`w-3 h-3 ${isWarmingAll ? 'animate-spin' : ''}`} />
            </button>
            <span className="text-charcoal-500 dark:text-charcoal-400">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </span>
          </div>
        </div>

        {/* Collapsible Telemetry Panel */}
        {isOpen && (
          <div className="p-3 bg-parchment-50 dark:bg-charcoal-900 flex flex-col gap-2.5 max-h-72 overflow-y-auto">
            <div className="text-[11px] text-charcoal-600 dark:text-charcoal-400 leading-snug border-b border-dashed border-charcoal-900/15 dark:border-white/10 pb-2 flex items-center justify-between">
              <span>Free-tier Render instances wake up automatically upon visit.</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white p-0.5 ml-2 cursor-pointer"
                title="Collapse Radar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {renderProjects.map((p) => {
                const health = healthMap[p.id];
                return (
                  <div
                    key={p.id}
                    className="p-2 rounded-xs bg-parchment-100 dark:bg-charcoal-800 border border-charcoal-900/15 dark:border-white/10 flex items-center justify-between"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-bold text-charcoal-900 dark:text-white truncate text-[11px]">
                        {p.title}
                      </span>
                      <span className="text-[9px] text-charcoal-500 dark:text-charcoal-400 truncate">
                        {p.renderUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </div>

                    <div className="shrink-0">
                      <RenderTelemetryBadge
                        status={health?.status || 'idle'}
                        latencyMs={health?.latencyMs}
                        compact
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-dashed border-charcoal-900/15 dark:border-white/10 flex items-center justify-between text-[10px] text-charcoal-500 dark:text-charcoal-400">
              <span>Edge Pre-Warmer Active</span>
              <button
                onClick={onWarmAll}
                disabled={isWarmingAll}
                className="text-blueprint-600 dark:text-blueprint-400 hover:underline font-bold cursor-pointer"
              >
                {isWarmingAll ? 'Pinging all...' : 'Wake all now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
