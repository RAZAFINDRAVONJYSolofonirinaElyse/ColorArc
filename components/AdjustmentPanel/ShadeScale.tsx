'use client';

import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { generateShadeScale } from '@/lib/colorUtils';

interface ShadeScaleProps {
  hex: string;
}

export default function ShadeScale({ hex }: ShadeScaleProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const shades = generateShadeScale(hex);
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const copy = async (step: number) => {
    await navigator.clipboard.writeText(shades[step]).catch(() => {});
    setCopied(step);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted mb-2">Nuancier Tailwind-style (cliquer pour copier)</p>
      {steps.map((step) => {
        const shade = shades[step];
        const isLight = step <= 400;
        return (
          <button
            key={step}
            onClick={() => copy(step)}
            className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:scale-[1.01] transition-transform"
            style={{ backgroundColor: shade }}
          >
            <span
              className="text-xs font-bold w-8 shrink-0"
              style={{ color: isLight ? '#1a1a1a' : '#fff' }}
            >
              {step}
            </span>
            <span className="flex-1 h-5 rounded" style={{ backgroundColor: shade }} />
            <span
              className="text-xs font-mono w-20 text-right shrink-0"
              style={{ color: isLight ? '#1a1a1a' : '#fff' }}
            >
              {copied === step ? <FiCheck size={12} className="text-green-500 inline" /> : shade.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
