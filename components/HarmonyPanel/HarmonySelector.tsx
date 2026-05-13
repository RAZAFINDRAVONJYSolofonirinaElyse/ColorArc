'use client';

import { HarmonyMode } from '@/lib/colorUtils';

interface HarmonySelectorProps {
  current: HarmonyMode;
  onChange: (mode: HarmonyMode) => void;
}

const MODES: { value: HarmonyMode; label: string; desc: string }[] = [
  { value: 'complementary', label: 'Complémentaire', desc: '2 couleurs opposées' },
  { value: 'analogous', label: 'Analogue', desc: '3 couleurs adjacentes' },
  { value: 'triadic', label: 'Triadique', desc: '3 couleurs à 120°' },
  { value: 'tetradic', label: 'Tétradique', desc: '4 couleurs en rectangle' },
  { value: 'split-complementary', label: 'Split-complémentaire', desc: '1 + 2 adjacentes' },
  { value: 'square', label: 'Carré', desc: '4 couleurs à 90°' },
  { value: 'monochromatic', label: 'Monochromatique', desc: 'Variations d\'une teinte' },
];

export default function HarmonySelector({ current, onChange }: HarmonySelectorProps) {
  return (
    <div className="space-y-1">
      {MODES.map(({ value, label, desc }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
            current === value
              ? 'bg-accent text-white'
              : 'bg-surface hover:bg-surface-hover text-foreground'
          }`}
        >
          <span className="text-sm font-medium">{label}</span>
          <span className={`text-xs ${current === value ? 'text-white/70' : 'text-muted'}`}>{desc}</span>
        </button>
      ))}
    </div>
  );
}
