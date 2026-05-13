'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { getColorName } from '@/lib/colorUtils';
import chroma from 'chroma-js';

interface HarmonyPaletteProps {
  colors: string[];
  onSelect?: (hex: string) => void;
}

export default function HarmonyPalette({ colors, onSelect }: HarmonyPaletteProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex gap-2">
      {colors.map((hex, i) => {
        const [h, s, l] = chroma(hex).hsl();
        const name = getColorName(h || 0, (s || 0) * 100, (l || 0) * 100);
        const isLight = (l || 0) > 0.55;
        const textCls = isLight ? 'text-black/70' : 'text-white/80';
        const isCopied = copied === hex;

        return (
          // Conteneur neutre — les deux boutons sont frères, jamais imbriqués
          <div key={i} className="group relative flex-1 rounded-2xl overflow-hidden" style={{ minHeight: 100 }}>

            {/* Bouton principal : sélectionner la couleur (couvre toute la carte) */}
            <button
              type="button"
              onClick={() => onSelect?.(hex)}
              className="absolute inset-0 w-full h-full rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent/60"
              style={{ backgroundColor: hex }}
              title={`Sélectionner ${name}`}
            >
              {/* Overlay hover */}
              <span
                className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                  isLight ? 'bg-black/8' : 'bg-black/12'
                }`}
              >
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  isLight ? 'bg-black/10 text-black' : 'bg-white/20 text-white'
                }`}>
                  Sélectionner
                </span>
              </span>

              {/* Nom + HEX en bas */}
              <span className="absolute bottom-0 left-0 right-0 p-2.5 text-left">
                <span className={`block text-xs font-bold leading-tight truncate ${textCls}`}>{name}</span>
                <span className={`block text-xs font-mono leading-tight ${textCls} opacity-80`}>{hex.toUpperCase()}</span>
              </span>
            </button>

            {/* Bouton copier — frère du précédent, positionné en haut à droite */}
            <button
              type="button"
              onClick={(e) => copy(e, hex)}
              className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow opacity-0 group-hover:opacity-100 transition-opacity ${
                isLight
                  ? 'bg-black/15 text-black hover:bg-black/25'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Copier HEX"
            >
              {isCopied ? <FiCheck size={13} /> : <FiCopy size={13} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}
