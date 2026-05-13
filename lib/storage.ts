export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

const PALETTES_KEY = 'colorarc-palettes';
const THEME_KEY = 'colorarc-theme';

export function loadPalettes(): SavedPalette[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PALETTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePalettes(palettes: SavedPalette[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PALETTES_KEY, JSON.stringify(palettes));
}

export function addPalette(palette: Omit<SavedPalette, 'id' | 'createdAt'>): SavedPalette {
  const newPalette: SavedPalette = {
    ...palette,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const existing = loadPalettes();
  savePalettes([newPalette, ...existing]);
  return newPalette;
}

export function deletePalette(id: string): void {
  const existing = loadPalettes();
  savePalettes(existing.filter((p) => p.id !== id));
}

export function loadTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'light';
}

export function saveTheme(theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
}
