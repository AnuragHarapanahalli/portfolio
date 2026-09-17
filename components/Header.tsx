'use client';

import { useState } from 'react';
import Link from 'next/link';
import { portfolioConfig } from '@/data/portfolio-config';
import { StampButton } from './StampButton';
import { ThemeToggle } from './ThemeToggle';
import { Layers, Menu, X, ArrowUpRight, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenTelemetry?: () => void;
}

export function Header({ onOpenTelemetry }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 lg:top-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl">
      <nav className="relative bg-parchment-50/95 dark:bg-charcoal-900/95 backdrop-blur-md border border-charcoal-900/25 dark:border-white/15 rounded-md shadow-paper-nav px-3.5 py-2.5 flex items-center justify-between transition-colors">
        {/* Brand Monogram */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-sm bg-blueprint-500 text-white flex items-center justify-center font-mono font-bold text-xs shadow-paper-sm group-hover:bg-blueprint-600 transition-colors">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-tight text-charcoal-900 dark:text-white leading-tight">
              {portfolioConfig.name}
            </span>
            <span className="font-mono text-[9px] text-charcoal-500 dark:text-charcoal-400 uppercase tracking-widest">
              ANURAG // PORTFOLIO
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 font-mono text-xs font-medium text-charcoal-700 dark:text-charcoal-300">
          {/* Projects Link */}
          <li className="relative group">
            <Link
              href="#projects"
              className="relative block py-1 transition-colors group-hover:text-blueprint-500 dark:group-hover:text-blueprint-400"
            >
              <div className="relative overflow-hidden h-4">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  Projects
                </span>
                <span className="absolute top-full left-0 block font-semibold text-blueprint-500 dark:text-blueprint-400 transition-transform duration-300 group-hover:-translate-y-full">
                  Projects
                </span>
              </div>
              <span className="absolute bottom-0 left-0 w-full h-[2px] underline-dotted-blueprint scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
          </li>

          {/* Telemetry Button (Active Drawer Trigger) */}
          <li className="relative group">
            <button
              onClick={() => {
                if (onOpenTelemetry) onOpenTelemetry();
              }}
              className="relative block py-1 transition-colors group-hover:text-blueprint-500 dark:group-hover:text-blueprint-400 cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-blueprint-500 dark:text-blueprint-400 animate-pulse" />
              <div className="relative overflow-hidden h-4">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  Telemetry
                </span>
                <span className="absolute top-full left-0 block font-semibold text-blueprint-500 dark:text-blueprint-400 transition-transform duration-300 group-hover:-translate-y-full">
                  Telemetry
                </span>
              </div>
              <span className="absolute bottom-0 left-0 w-full h-[2px] underline-dotted-blueprint scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>
          </li>

          {/* Admin Portal Link */}
          <li className="relative group">
            <Link
              href="/admin"
              className="relative block py-1 transition-colors group-hover:text-blueprint-500 dark:group-hover:text-blueprint-400"
            >
              <div className="relative overflow-hidden h-4">
                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                  Admin
                </span>
                <span className="absolute top-full left-0 block font-semibold text-blueprint-500 dark:text-blueprint-400 transition-transform duration-300 group-hover:-translate-y-full">
                  Admin
                </span>
              </div>
              <span className="absolute bottom-0 left-0 w-full h-[2px] underline-dotted-blueprint scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
          </li>
        </ul>

        {/* Actions: Theme Toggle + Contact Button */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />

          <StampButton
            href={portfolioConfig.socials.email || `mailto:${portfolioConfig.email}`}
            external
            size="sm"
            variant="terracotta"
            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            Contact
          </StampButton>
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded text-charcoal-800 dark:text-charcoal-200 hover:bg-parchment-200 dark:hover:bg-charcoal-800 transition-colors border border-charcoal-900/10 dark:border-white/10"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 bg-parchment-50 dark:bg-charcoal-900 border border-charcoal-900/20 dark:border-white/15 rounded shadow-paper flex flex-col gap-3 font-mono text-xs">
          <Link
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-3 hover:bg-parchment-200 dark:hover:bg-charcoal-800 rounded text-charcoal-800 dark:text-charcoal-200 hover:text-blueprint-500 flex items-center justify-between border-b border-dashed border-charcoal-900/10 dark:border-white/10"
          >
            <span>Projects</span>
            <span className="text-[10px] text-charcoal-400">→</span>
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenTelemetry) onOpenTelemetry();
            }}
            className="py-2 px-3 hover:bg-parchment-200 dark:hover:bg-charcoal-800 rounded text-charcoal-800 dark:text-charcoal-200 hover:text-blueprint-500 flex items-center justify-between border-b border-dashed border-charcoal-900/10 dark:border-white/10 text-left cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blueprint-500 animate-pulse" />
              <span>Telemetry Radar</span>
            </span>
            <span className="text-[10px] text-charcoal-400">Open</span>
          </button>

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 px-3 hover:bg-parchment-200 dark:hover:bg-charcoal-800 rounded text-charcoal-800 dark:text-charcoal-200 hover:text-blueprint-500 flex items-center justify-between"
          >
            <span>Admin Dispatch</span>
            <span className="text-[10px] text-charcoal-400">→</span>
          </Link>

          <div className="pt-2">
            <StampButton
              href={portfolioConfig.socials.email || `mailto:${portfolioConfig.email}`}
              external
              size="sm"
              variant="terracotta"
              className="w-full justify-center"
            >
              Contact Anurag
            </StampButton>
          </div>
        </div>
      )}
    </header>
  );
}
