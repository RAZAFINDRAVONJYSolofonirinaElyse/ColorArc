'use client';

import { useState } from 'react';
import { FiCopy, FiCheck, FiLock, FiUnlock } from 'react-icons/fi';

interface PaletteSwatchProps {
  hex: string;
  index: number;
  isLocked: boolean;
  onToggleLock: (i: number) => void;
}

export default function PaletteSwatch({ hex, index, isLocked, onToggleLock }: PaletteSwatchProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <div
        className="relative w-full rounded-xl overflow-hidden shadow-sm group"
        style={{ aspectRatio: '1/1.6', backgroundColor: hex }}
      >
        {/* Copier (hover) */}
        <button
          type="button"
          onClick={copy}
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity bg-black/10"
          title={`Copier ${hex}`}
        >
          {copied
            ? <FiCheck size={16} className="text-white drop-shadow" />
            : <FiCopy  size={16} className="text-white drop-shadow" />}
        </button>

        {/* Verrouiller */}
        <button
          type="button"
          onClick={() => onToggleLock(index)}
          className={`absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded transition-opacity text-white drop-shadow ${
            isLocked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title={isLocked ? 'Déverrouiller' : 'Verrouiller'}
        >
          {isLocked ? <FiLock size={12} /> : <FiUnlock size={12} />}
        </button>
      </div>
      <span className="text-[10px] font-mono text-foreground/70 text-center truncate w-full leading-tight">{hex.toUpperCase()}</span>
    </div>
  );
}
