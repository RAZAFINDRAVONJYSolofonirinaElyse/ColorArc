'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import { loadTheme, saveTheme } from '@/lib/storage';

export default function LandingNav() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const saved = loadTheme();
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-md">
            <span className="text-white text-xs font-black">CA</span>
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">ColorArc</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-surface hover:bg-surface-hover border border-border flex items-center justify-center transition-colors text-foreground"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>

          <Link
            href="/studio"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all shadow-sm hover:-translate-y-0.5"
          >
            Lancer l'app
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
