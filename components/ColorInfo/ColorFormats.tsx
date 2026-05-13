'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { getColorFormats } from '@/lib/colorUtils';

interface ColorFormatsProps {
  hue: number;
  saturation: number;
  lightness: number;
}

export default function ColorFormats({ hue, saturation, lightness }: ColorFormatsProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const formats = getColorFormats(hue, saturation, lightness);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const rows: { label: string; key: string; value: string }[] = [
    { label: 'HEX',  key: 'hex',    value: formats.hex },
    { label: 'RGB',  key: 'rgb',    value: formats.rgb },
    { label: 'HSL',  key: 'hsl',    value: formats.hsl },
    { label: 'HSV',  key: 'hsv',    value: formats.hsv },
    { label: 'CMYK', key: 'cmyk',   value: formats.cmyk },
    { label: 'CSS',  key: 'cssVar', value: formats.cssVar },
  ];

  return (
    <div className="space-y-1">
      {rows.map(({ label, key, value }) => (
        <button
          key={key}
          type="button"
          onClick={() => copy(key, value)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors group text-left"
        >
          <span className="text-xs font-mono font-bold text-muted w-10 shrink-0">{label}</span>
          <span className="text-xs font-mono text-foreground flex-1 truncate">{value}</span>
          <span className="shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-opacity">
            {copied === key
              ? <FiCheck size={12} className="text-green-500" />
              : <FiCopy size={12} />}
          </span>
        </button>
      ))}
    </div>
  );
}
