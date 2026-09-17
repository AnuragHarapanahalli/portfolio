'use client';

import React from 'react';
import Link from 'next/link';
import { portfolioConfig } from '@/data/portfolio-config';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-blueprint-800 dark:bg-[#07090e] text-[#EADFC9] dark:text-[#d1d5db] pt-16 pb-12 px-6 sm:px-12 border-t-2 border-blueprint-900 dark:border-white/10 shadow-paper-inset overflow-hidden mt-16 transition-colors">
      {/* Blueprint Grid Texture */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-blueprint-500/30 dark:border-white/10">
          {/* Left Column: Brand & Statement */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-terracotta-500 dark:text-terracotta-400 uppercase tracking-widest block mb-3 font-semibold">
                SYSTEM ARCHITECTURE // VERCEL & RENDER
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold leading-snug text-[#FEF9F1] dark:text-white max-w-lg">
                Full-Stack Development, Distributed Systems & Cloud Architecture.
              </h3>
            </div>

            <div className="mt-8 flex items-center gap-3 font-mono text-xs text-[#EADFC9]/80 dark:text-[#9ca3af]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Available for software engineering roles & technical projects.</span>
            </div>
          </div>

          {/* Right Columns: Links (Index & Connect) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8 font-mono text-xs">
            {/* Quick Links */}
            <div>
              <h4 className="text-terracotta-500 dark:text-terracotta-400 font-bold mb-4 uppercase tracking-wider">
                Index
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#projects" className="hover:text-white transition-colors">
                    Selected Works
                  </a>
                </li>
                <li>
                  <a href="#telemetry" className="hover:text-white transition-colors">
                    Render Radar
                  </a>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors text-blueprint-300 dark:text-blueprint-400">
                    Admin Portal →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-terracotta-500 dark:text-terracotta-400 font-bold mb-4 uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-2.5">
                {portfolioConfig.socials.github && (
                  <li>
                    <a
                      href={portfolioConfig.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {portfolioConfig.socials.linkedin && (
                  <li>
                    <a
                      href={portfolioConfig.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={`mailto:${portfolioConfig.email}`}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Email Me</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#EADFC9]/70 dark:text-[#9ca3af]">
          <div>
            © {currentYear} {portfolioConfig.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>Deployed on</span>
              <span className="font-bold text-white">Vercel</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span>Backends on</span>
              <span className="font-bold text-white">Render</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
