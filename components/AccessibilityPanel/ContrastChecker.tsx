'use client';

import { useState, useEffect } from 'react';
import { analyzeContrast, suggestAccessiblePair } from '@/lib/wcagUtils';
import { isValidHex } from '@/lib/colorUtils';
import WCAGBadge from './WCAGBadge';

interface ContrastCheckerProps {
  activeColor?: string;
}

export default function ContrastChecker({ activeColor }: ContrastCheckerProps) {
  const [fg, setFg] = useState('#1a1a2e');
  const [bg, setBg] = useState('#ffffff');
  const [fgInput, setFgInput] = useState('#1a1a2e');
  const [bgInput, setBgInput] = useState('#ffffff');

  useEffect(() => {
    if (activeColor && isValidHex(activeColor)) {
      setBg(activeColor);
      setBgInput(activeColor);
    }
  }, [activeColor]);

  const validFg = isValidHex(fg) ? fg : '#1a1a2e';
  const validBg = isValidHex(bg) ? bg : '#ffffff';
  const result = analyzeContrast(validFg, validBg);
  const suggestions = suggestAccessiblePair(validBg);

  const handleFgChange = (v: string) => {
    setFgInput(v);
    if (isValidHex(v)) setFg(v);
  };

  const handleBgChange = (v: string) => {
    setBgInput(v);
    if (isValidHex(v)) setBg(v);
  };

  return (
    <div className="space-y-4">
      {/* Preview live */}
      <div
        className="rounded-2xl p-5 space-y-1 transition-colors border border-border"
        style={{ backgroundColor: validBg }}
      >
        <p className="text-xl font-bold" style={{ color: validFg }}>Texte Normal — Aa</p>
        <p className="text-sm" style={{ color: validFg }}>Petit texte — niveau de lisibilité</p>
        <p className="text-xs" style={{ color: validFg }}>Caption très petit — 11px</p>
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Texte', value: fg, input: fgInput, setInput: handleFgChange, setColor: (v: string) => { setFg(v); setFgInput(v); } },
          { label: 'Fond', value: bg, input: bgInput, setInput: handleBgChange, setColor: (v: string) => { setBg(v); setBgInput(v); } },
        ].map(({ label, value, input, setInput, setColor }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-xs font-semibold text-muted tracking-wide">{label}</label>
            <div className="flex gap-2 items-center">
              <div
                className="w-9 h-9 rounded-xl border-2 border-border shrink-0 cursor-pointer overflow-hidden"
                style={{ backgroundColor: value }}
              >
                <input
                  type="color"
                  aria-label={`Couleur ${label}`}
                  value={value}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <input
                type="text"
                aria-label={`Code HEX ${label}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 min-w-0 text-xs font-mono px-2 py-2 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 uppercase"
                maxLength={7}
                spellCheck={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Sync button */}
      {activeColor && activeColor !== bg && (
        <button
          type="button"
          onClick={() => { setBg(activeColor); setBgInput(activeColor); }}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border text-xs font-medium text-muted transition-colors"
        >
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: activeColor }} />
          Utiliser la couleur active comme fond
        </button>
      )}

      {/* Ratio + badges */}
      <div className="bg-surface rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Ratio de contraste</span>
          <span className="text-3xl font-black text-foreground tabular-nums">{result.ratioDisplay}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Texte normal', level: result.normalText },
            { label: 'Grand texte', level: result.largeText },
            { label: 'Composants', level: result.uiComponents },
          ].map(({ label, level }) => (
            <div key={label} className="space-y-1">
              <WCAGBadge level={level} />
              <p className="text-xs text-muted leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions si FAIL */}
      {result.normalText === 'FAIL' && (
        <div className="space-y-2">
          <p className="text-xs text-muted font-medium">Couleurs de texte accessibles suggérées :</p>
          <div className="flex gap-2">
            {[suggestions.dark, suggestions.light].map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => { setFg(hex); setFgInput(hex); }}
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-border transition-colors"
              >
                <span className="w-5 h-5 rounded-lg shrink-0 border border-border" style={{ backgroundColor: hex }} />
                <span className="text-xs font-mono text-foreground">{hex.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
