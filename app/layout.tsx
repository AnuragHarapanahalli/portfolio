import type { Metadata } from 'next';
import { Geist, Geist_Mono, Caveat, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { portfolioConfig } from '@/data/portfolio-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: `${portfolioConfig.name} — ${portfolioConfig.title}`,
  description: portfolioConfig.tagline,
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: `${portfolioConfig.name} — ${portfolioConfig.title}`,
    description: portfolioConfig.tagline,
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${spaceGrotesk.variable} scroll-smooth antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.removeItem('theme');
                if (sessionStorage.theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-parchment-100 dark:bg-dark-bg text-charcoal-900 dark:text-parchment-100 selection:bg-blueprint-500 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
