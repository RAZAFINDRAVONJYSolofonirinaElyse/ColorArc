'use client';

import { useState, useCallback } from 'react';
import { HarmonyMode, randomColor, getHarmonyColors, generatePalette } from '@/lib/colorUtils';

export interface ColorState {
  h: number;
  s: number;
  l: number;
  harmonyMode: HarmonyMode;
  paletteCount: number;
  lockedColors: Set<number>;
}

export interface ColorActions {
  setHSL: (h: number, s: number, l: number) => void;
  setH: (h: number) => void;
  setS: (s: number) => void;
  setL: (l: number) => void;
  setHarmonyMode: (mode: HarmonyMode) => void;
  setPaletteCount: (count: number) => void;
  toggleLock: (index: number) => void;
  randomize: () => void;
  currentPalette: string[];
  harmonyColors: string[];
}

export function useColorState(): ColorState & ColorActions {
  const [h, setHState] = useState(215);
  const [s, setSState] = useState(85);
  const [l, setLState] = useState(55);
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('complementary');
  const [paletteCount, setPaletteCount] = useState(5);
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());

  const setHSL = useCallback((newH: number, newS: number, newL: number) => {
    setHState(newH);
    setSState(newS);
    setLState(newL);
  }, []);

  const setH = useCallback((newH: number) => setHState(newH), []);
  const setS = useCallback((newS: number) => setSState(newS), []);
  const setL = useCallback((newL: number) => setLState(newL), []);

  const toggleLock = useCallback((index: number) => {
    setLockedColors((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const randomize = useCallback(() => {
    const { h: rh, s: rs, l: rl } = randomColor();
    setHState(rh);
    setSState(rs);
    setLState(rl);
  }, []);

  const harmonyColors = getHarmonyColors(h, s, l, harmonyMode);
  const currentPalette = generatePalette(h, s, l, paletteCount, harmonyMode);

  return {
    h, s, l,
    harmonyMode,
    paletteCount,
    lockedColors,
    setHSL,
    setH,
    setS,
    setL,
    setHarmonyMode,
    setPaletteCount,
    toggleLock,
    randomize,
    currentPalette,
    harmonyColors,
  };
}
