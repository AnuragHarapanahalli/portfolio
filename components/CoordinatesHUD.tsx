'use client';

import { useState, useEffect } from 'react';

export function CoordinatesHUD() {
  const [coords, setCoords] = useState<{ x: string; y: string }>({ x: '0.00', y: '0.00' });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth).toFixed(2);
      const y = (e.clientY / window.innerHeight).toFixed(2);
      setCoords({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <aside
      aria-label="Cursor coordinate telemetry"
      className="fixed top-6 left-6 z-40 hidden lg:block font-mono text-[11px] tracking-wider text-charcoal-500 dark:text-charcoal-400 tabular-nums pointer-events-none select-none transition-colors"
    >
      <div className="flex items-center gap-3 bg-parchment-100/80 dark:bg-charcoal-900/80 px-2.5 py-1 border border-charcoal-900/20 dark:border-white/10 rounded backdrop-blur-xs shadow-paper-sm">
        <span className="text-blueprint-500 dark:text-blueprint-400 font-semibold">X</span>
        <span className="w-10 text-charcoal-900 dark:text-white font-medium">{coords.x}</span>
        <span className="text-terracotta-500 dark:text-terracotta-400 font-semibold">Y</span>
        <span className="w-10 text-charcoal-900 dark:text-white font-medium">{coords.y}</span>
      </div>
    </aside>
  );
}
