'use client';

import React from 'react';
import { ProjectHealthStatus } from '@/types/project';
import { Activity, Radio, RefreshCw } from 'lucide-react';

interface RenderTelemetryBadgeProps {
  status?: ProjectHealthStatus;
  latencyMs?: number;
  onRefresh?: () => void;
  className?: string;
  compact?: boolean;
}

export function RenderTelemetryBadge({
  status = 'idle',
  latencyMs,
  onRefresh,
  className = '',
  compact = false,
}: RenderTelemetryBadgeProps) {
  const config = {
    online: {
      dotBg: 'bg-emerald-500',
      border: 'border-emerald-600/30 dark:border-emerald-500/30',
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/60',
      textColor: 'text-emerald-800 dark:text-emerald-300',
      label: 'ONLINE',
      sublabel: latencyMs ? `${latencyMs}ms` : 'Render Hot',
    },
    warming: {
      dotBg: 'bg-amber-500 animate-pulse',
      border: 'border-amber-600/30 dark:border-amber-500/30',
      bg: 'bg-amber-50/80 dark:bg-amber-950/60',
      textColor: 'text-amber-900 dark:text-amber-300',
      label: 'WARMING UP',
      sublabel: 'Render Booting (~45s)',
    },
    error: {
      dotBg: 'bg-rose-500',
      border: 'border-rose-600/30 dark:border-rose-500/30',
      bg: 'bg-rose-50/80 dark:bg-rose-950/60',
      textColor: 'text-rose-900 dark:text-rose-300',
      label: 'STANDBY',
      sublabel: 'Re-initializing',
    },
    idle: {
      dotBg: 'bg-charcoal-400',
      border: 'border-charcoal-300 dark:border-white/15',
      bg: 'bg-parchment-200/60 dark:bg-charcoal-800/80',
      textColor: 'text-charcoal-600 dark:text-charcoal-300',
      label: 'STANDBY',
      sublabel: 'Pinging...',
    },
  }[status];

  if (compact) {
    return (
      <span
        title={`Render Health: ${config.label} (${config.sublabel})`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs border font-mono text-[10px] tracking-tight ${config.bg} ${config.border} ${config.textColor} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotBg}`} />
        <span>{config.label}</span>
        {latencyMs && <span className="opacity-70">({latencyMs}ms)</span>}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] border font-mono text-xs shadow-paper-sm select-none ${config.bg} ${config.border} ${config.textColor} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <span className={`w-2 h-2 rounded-full ${config.dotBg}`} />
        {status === 'warming' && (
          <span className="absolute w-4 h-4 rounded-full border border-amber-500/50 animate-ping" />
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="font-semibold tracking-wider text-[10px] uppercase">
          {config.label}
        </span>
        <span className="text-charcoal-400 dark:text-charcoal-500 text-[10px]">//</span>
        <span className="text-[11px] font-medium opacity-90">{config.sublabel}</span>
      </div>

      {onRefresh && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
          className="ml-1 p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-charcoal-100 transition-colors"
          title="Force health check"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${status === 'warming' ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
