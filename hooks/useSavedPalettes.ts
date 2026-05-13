'use client';

import { useState, useCallback, useEffect } from 'react';
import { SavedPalette, loadPalettes, addPalette, deletePalette } from '@/lib/storage';

export function useSavedPalettes() {
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);

  useEffect(() => {
    setPalettes(loadPalettes());
  }, []);

  const save = useCallback((name: string, colors: string[]) => {
    const newPalette = addPalette({ name, colors });
    setPalettes((prev) => [newPalette, ...prev]);
  }, []);

  const remove = useCallback((id: string) => {
    deletePalette(id);
    setPalettes((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { palettes, save, remove };
}
