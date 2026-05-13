'use client';

import { FiSun, FiMoon } from 'react-icons/fi';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 via-pink-500 to-orange-400 flex items-center justify-center">
          <span className="text-white text-xs font-black">CA</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground leading-none">ColorArc</h1>
          <p className="text-xs text-muted leading-none mt-0.5">Outil de couleurs pour designers</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-hover border border-border flex items-center justify-center transition-colors text-foreground"
        title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      >
        {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
      </button>
    </header>
  );
}
