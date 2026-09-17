'use client';

import React from 'react';
import Link from 'next/link';

interface StampButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'terracotta' | 'blueprint' | 'paper';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function StampButton({
  children,
  href,
  onClick,
  variant = 'terracotta',
  icon,
  size = 'md',
  className = '',
  external = false,
  type = 'button',
  disabled = false,
}: StampButtonProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const heightClass = isSm ? 'h-9 text-xs' : isLg ? 'h-13 text-base' : 'h-11 text-sm';
  const squareSizeClass = isSm ? 'w-9 h-9' : isLg ? 'w-13 h-13' : 'w-11 h-11';

  // Theme configuration with dark mode support
  const colorStyles = {
    terracotta: {
      squareBg: 'bg-terracotta-600 text-parchment-50 group-hover:bg-terracotta-500',
      pillBg: 'bg-parchment-50 dark:bg-charcoal-900 text-charcoal-900 dark:text-parchment-100 group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 border-charcoal-900/20 dark:border-white/15',
    },
    blueprint: {
      squareBg: 'bg-blueprint-500 text-parchment-50 group-hover:bg-blueprint-600',
      pillBg: 'bg-parchment-50 dark:bg-charcoal-900 text-charcoal-900 dark:text-parchment-100 group-hover:text-blueprint-600 dark:group-hover:text-blueprint-400 border-charcoal-900/20 dark:border-white/15',
    },
    paper: {
      squareBg: 'bg-parchment-200 dark:bg-charcoal-800 text-charcoal-900 dark:text-white group-hover:bg-blueprint-500 group-hover:text-white',
      pillBg: 'bg-parchment-50 dark:bg-charcoal-900 text-charcoal-900 dark:text-parchment-100 group-hover:text-blueprint-600 dark:group-hover:text-blueprint-400 border-charcoal-900/20 dark:border-white/15',
    },
  }[variant];

  const content = (
    <div
      className={`group relative inline-flex items-stretch overflow-hidden rounded-[3px] shadow-paper-sm hover:shadow-paper transition-all select-none ${heightClass} ${
        disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Left Icon Square */}
      <div
        className={`${squareSizeClass} shrink-0 flex items-center justify-center border-y border-l border-r border-charcoal-900/30 dark:border-white/15 transition-colors duration-200 ${colorStyles.squareBg}`}
      >
        {icon || (
          <svg
            className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Right Label Pill with dual-layer roll-over text */}
      <div
        className={`relative flex items-center justify-center px-4 font-mono font-medium tracking-tight border-y border-r border-charcoal-900/30 dark:border-white/15 overflow-hidden transition-colors ${colorStyles.pillBg}`}
      >
        {/* Animated Sliding Text */}
        <div className="relative overflow-hidden h-5 flex items-center">
          <div className="transition-transform duration-300 ease-out group-hover:-translate-y-full">
            <span className="block">{children}</span>
            <span className="absolute top-full left-0 w-full block font-semibold">
              {children}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-block">
      {content}
    </button>
  );
}
