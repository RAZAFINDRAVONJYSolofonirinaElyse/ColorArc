import chroma from 'chroma-js';

export type HarmonyMode =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'square'
  | 'monochromatic';

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
  cssVar: string;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hslToChroma(h: number, s: number, l: number): chroma.Color {
  return chroma.hsl(h, s / 100, l / 100);
}

export function hexToHSL(hex: string): HSL {
  const c = chroma(hex);
  const [h, s, l] = c.hsl();
  return { h: h || 0, s: (s || 0) * 100, l: (l || 0) * 100 };
}

export function getColorFormats(h: number, s: number, l: number): ColorFormats {
  const c = hslToChroma(h, s, l);
  const hex = c.hex().toUpperCase();

  const [r, g, b] = c.rgb().map(Math.round);
  const rgb = `rgb(${r}, ${g}, ${b})`;

  const hslStr = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;

  const [hv, sv, vv] = c.hsv();
  const hsv = `hsv(${Math.round(hv || 0)}, ${Math.round((sv || 0) * 100)}%, ${Math.round((vv || 0) * 100)}%)`;

  const [rc, gc, bc] = c.rgb();
  const rn = rc / 255, gn = gc / 255, bn = bc / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const cyan = k === 1 ? 0 : (1 - rn - k) / (1 - k);
  const magenta = k === 1 ? 0 : (1 - gn - k) / (1 - k);
  const yellow = k === 1 ? 0 : (1 - bn - k) / (1 - k);
  const cmyk = `cmyk(${Math.round(cyan * 100)}%, ${Math.round(magenta * 100)}%, ${Math.round(yellow * 100)}%, ${Math.round(k * 100)}%)`;

  const cssVar = `--color: ${hex}`;

  return { hex, rgb, hsl: hslStr, hsv, cmyk, cssVar };
}

export function getHarmonyColors(h: number, s: number, l: number, mode: HarmonyMode): string[] {
  const normalize = (hue: number) => ((hue % 360) + 360) % 360;

  switch (mode) {
    case 'complementary':
      return [
        chroma.hsl(normalize(h), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 180), s / 100, l / 100).hex(),
      ];

    case 'analogous':
      return [
        chroma.hsl(normalize(h - 30), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 30), s / 100, l / 100).hex(),
      ];

    case 'triadic':
      return [
        chroma.hsl(normalize(h), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 120), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 240), s / 100, l / 100).hex(),
      ];

    case 'tetradic':
      return [
        chroma.hsl(normalize(h), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 60), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 180), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 240), s / 100, l / 100).hex(),
      ];

    case 'split-complementary':
      return [
        chroma.hsl(normalize(h), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 150), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 210), s / 100, l / 100).hex(),
      ];

    case 'square':
      return [
        chroma.hsl(normalize(h), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 90), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 180), s / 100, l / 100).hex(),
        chroma.hsl(normalize(h + 270), s / 100, l / 100).hex(),
      ];

    case 'monochromatic':
      return [
        chroma.hsl(h, s / 100, 0.9).hex(),
        chroma.hsl(h, s / 100, 0.7).hex(),
        chroma.hsl(h, s / 100, l / 100).hex(),
        chroma.hsl(h, s / 100, 0.35).hex(),
        chroma.hsl(h, s / 100, 0.15).hex(),
      ];

    default:
      return [chroma.hsl(h, s / 100, l / 100).hex()];
  }
}

export function generatePalette(h: number, s: number, l: number, count: number, mode: HarmonyMode): string[] {
  const harmonyColors = getHarmonyColors(h, s, l, mode);
  if (count <= harmonyColors.length) return harmonyColors.slice(0, count);

  const base = [...harmonyColors];
  while (base.length < count) {
    const existing = chroma(base[base.length - 1]);
    const [eh, es, el] = existing.hsl();
    const newL = el > 0.5 ? el - 0.15 : el + 0.15;
    base.push(chroma.hsl(eh || 0, es || 0, Math.max(0.05, Math.min(0.95, newL))).hex());
  }
  return base;
}

export function generateShadeScale(hex: string): Record<number, string> {
  const c = chroma(hex);
  const [h, s] = c.hsl();
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const lightnesses = [0.97, 0.94, 0.86, 0.74, 0.62, 0.50, 0.39, 0.29, 0.20, 0.13, 0.09];
  const result: Record<number, string> = {};
  steps.forEach((step, i) => {
    result[step] = chroma.hsl(h || 0, (s || 0.7), lightnesses[i]).hex();
  });
  return result;
}

export function mixColors(hex1: string, hex2: string, ratio: number): string {
  return chroma.mix(hex1, hex2, ratio, 'lab').hex();
}

export function getColorName(h: number, s: number, l: number): string {
  if (s < 10) {
    if (l > 90) return 'Blanc';
    if (l < 10) return 'Noir';
    if (l > 60) return 'Gris Clair';
    if (l < 40) return 'Gris Foncé';
    return 'Gris';
  }

  const hueNames: [number, number, string][] = [
    [0, 10, 'Rouge'],
    [10, 20, 'Rouge Orangé'],
    [20, 40, 'Orange'],
    [40, 55, 'Jaune'],
    [55, 80, 'Vert Jaune'],
    [80, 150, 'Vert'],
    [150, 175, 'Vert Émeraude'],
    [175, 195, 'Cyan'],
    [195, 230, 'Bleu Ciel'],
    [230, 255, 'Bleu'],
    [255, 280, 'Bleu Violet'],
    [280, 320, 'Violet'],
    [320, 345, 'Rose'],
    [345, 360, 'Rouge'],
  ];

  const baseName = hueNames.find(([min, max]) => h >= min && h < max)?.[2] || 'Couleur';
  if (l > 75) return `${baseName} Pastel`;
  if (l < 30) return `${baseName} Foncé`;
  if (s > 80) return `${baseName} Vif`;
  return baseName;
}

export function hueToPosition(hue: number, radius: number, cx: number, cy: number) {
  const angle = ((hue - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function randomColor(): HSL {
  return {
    h: Math.random() * 360,
    s: 40 + Math.random() * 50,
    l: 35 + Math.random() * 30,
  };
}

export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}
