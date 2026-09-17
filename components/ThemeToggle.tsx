'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    updateTheme();
    window.addEventListener('theme-change', updateTheme);
    return () => window.removeEventListener('theme-change', updateTheme);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      try {
        sessionStorage.setItem('theme', 'dark');
        localStorage.removeItem('theme');
      } catch (_) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        sessionStorage.setItem('theme', 'light');
        localStorage.removeItem('theme');
      } catch (_) {}
    }

    setTheme(nextTheme);
    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative w-8 h-8 rounded-[2px] border border-charcoal-900/20 dark:border-white/20 bg-parchment-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-parchment-100 shadow-paper-sm hover:border-blueprint-500 transition-colors cursor-pointer flex items-center justify-center group ${className}`}
      title={theme === 'light' ? 'Switch to Blueprint Dark Mode' : 'Switch to Parchment Light Mode'}
      aria-label="Toggle dark mode"
    >
      <Moon className="w-3.5 h-3.5 block dark:hidden group-hover:text-blueprint-600 transition-colors" />
      <Sun className="w-3.5 h-3.5 hidden dark:block text-amber-400 group-hover:rotate-45 transition-transform" />
    </button>
  );
}
