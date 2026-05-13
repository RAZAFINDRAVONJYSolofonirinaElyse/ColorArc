'use client';

import { FiShuffle, FiSave } from 'react-icons/fi';
import PaletteSwatch from './PaletteSwatch';

interface PaletteGeneratorProps {
  palette: string[];
  count: number;
  lockedColors: Set<number>;
  onCountChange: (n: number) => void;
  onToggleLock: (i: number) => void;
  onRandomize: () => void;
  onSave: () => void;
}

export default function PaletteGenerator({
  palette, count, lockedColors,
  onCountChange, onToggleLock, onRandomize, onSave,
}: PaletteGeneratorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted shrink-0">Couleurs :</label>
          <div className="flex gap-1">
            {[3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onCountChange(n)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  count === n
                    ? 'bg-accent text-white'
                    : 'bg-surface hover:bg-surface-hover text-foreground'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRandomize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-border text-sm text-foreground transition-colors"
            title="Couleur aléatoire"
          >
            <FiShuffle size={13} />
            Aléatoire
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors"
          >
            <FiSave size={13} />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {palette.map((hex, i) => (
          <PaletteSwatch
            key={i}
            hex={hex}
            index={i}
            isLocked={lockedColors.has(i)}
            onToggleLock={onToggleLock}
          />
        ))}
      </div>
    </div>
  );
}
