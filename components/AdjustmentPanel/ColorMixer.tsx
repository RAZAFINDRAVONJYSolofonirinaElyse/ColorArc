'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { mixColors, isValidHex } from '@/lib/colorUtils';

export default function ColorMixer() {
  const [color1, setColor1] = useState('#3a86ff');
  const [color2, setColor2] = useState('#ff006e');
  const [ratio, setRatio] = useState(0.5);
  const [copied, setCopied] = useState(false);

  const valid1 = isValidHex(color1) ? color1 : '#3a86ff';
  const valid2 = isValidHex(color2) ? color2 : '#ff006e';
  const mixed = mixColors(valid1, valid2, ratio);

  const copy = async () => {
    await navigator.clipboard.writeText(mixed).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Couleur A', value: color1, set: setColor1 },
          { label: 'Couleur B', value: color2, set: setColor2 },
        ].map(({ label, value, set }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-xs font-semibold text-muted tracking-wide">{label}</label>
            <div className="flex gap-2 items-center">
              <div
                className="w-8 h-8 rounded-lg border border-border shrink-0 overflow-hidden"
                style={{ backgroundColor: value }}
              >
                <input
                  type="color"
                  aria-label={`Couleur ${label}`}
                  value={isValidHex(value) ? value : '#000000'}
                  onChange={(e) => set(e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <input
                type="text"
                aria-label={`Code HEX ${label}`}
                value={value}
                onChange={(e) => set(e.target.value)}
                maxLength={7}
                className="flex-1 min-w-0 text-xs font-mono px-2 py-1.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Aperçu dégradé */}
      <div
        className="h-10 rounded-xl"
        style={{ background: `linear-gradient(to right, ${valid1}, ${mixed}, ${valid2})` }}
      />

      {/* Curseur ratio */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted">
          <span>A</span>
          <span>Mélange : {Math.round(ratio * 100)}%</span>
          <span>B</span>
        </div>
        <input
          type="range"
          aria-label="Ratio de mélange"
          min={0}
          max={100}
          value={Math.round(ratio * 100)}
          onChange={(e) => setRatio(Number(e.target.value) / 100)}
          className="w-full cursor-pointer accent-accent"
        />
      </div>

      {/* Résultat */}
      <button
        type="button"
        onClick={copy}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 border-border hover:bg-surface-hover transition-colors"
        style={{ borderLeftColor: mixed, borderLeftWidth: 4 }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded shrink-0" style={{ backgroundColor: mixed }} />
          <span className="text-sm font-mono text-foreground">{mixed.toUpperCase()}</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted">
          {copied
            ? <><FiCheck size={12} className="text-green-500" /> Copié</>
            : <><FiCopy size={12} /> Copier</>}
        </span>
      </button>
    </div>
  );
}
