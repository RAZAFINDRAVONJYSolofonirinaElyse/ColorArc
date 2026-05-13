import chroma from 'chroma-js';

export type WCAGLevel = 'AAA' | 'AA' | 'AA Large' | 'FAIL';

export interface ContrastResult {
  ratio: number;
  ratioDisplay: string;
  normalText: WCAGLevel;
  largeText: WCAGLevel;
  uiComponents: WCAGLevel;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  return chroma.contrast(hex1, hex2);
}

function rateLevel(ratio: number, threshold: { aaa: number; aa: number; aaLarge: number }): WCAGLevel {
  if (ratio >= threshold.aaa) return 'AAA';
  if (ratio >= threshold.aa) return 'AA';
  if (ratio >= threshold.aaLarge) return 'AA Large';
  return 'FAIL';
}

export function analyzeContrast(hex1: string, hex2: string): ContrastResult {
  let ratio = 1;
  try {
    ratio = chroma.contrast(hex1, hex2);
  } catch {
    ratio = 1;
  }

  const ratioDisplay = ratio.toFixed(2) + '/20';

  const normalText = rateLevel(ratio, { aaa: 7, aa: 4.5, aaLarge: 3 });
  const largeText = rateLevel(ratio, { aaa: 4.5, aa: 3, aaLarge: 3 });
  const uiComponents = rateLevel(ratio, { aaa: 4.5, aa: 3, aaLarge: 3 });

  return { ratio, ratioDisplay, normalText, largeText, uiComponents };
}

export function getWCAGLevelColor(level: WCAGLevel): string {
  switch (level) {
    case 'AAA': return '#16a34a';
    case 'AA': return '#2563eb';
    case 'AA Large': return '#d97706';
    case 'FAIL': return '#dc2626';
  }
}

export function suggestAccessiblePair(hex: string): { light: string; dark: string } {
  const c = chroma(hex);
  const [h, s] = c.hsl();

  let lightL = 0.97;
  let darkL = 0.05;

  while (chroma.contrast(hex, chroma.hsl(h || 0, (s || 0), lightL).hex()) < 4.5 && lightL > 0.5) {
    lightL -= 0.02;
  }
  while (chroma.contrast(hex, chroma.hsl(h || 0, (s || 0), darkL).hex()) < 4.5 && darkL < 0.5) {
    darkL += 0.02;
  }

  return {
    light: chroma.hsl(h || 0, (s || 0), lightL).hex(),
    dark: chroma.hsl(h || 0, (s || 0), darkL).hex(),
  };
}
