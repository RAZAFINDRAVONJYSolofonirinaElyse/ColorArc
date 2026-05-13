'use client';

import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import type { SavedPalette } from '@/lib/storage';

interface SavedPalettesProps {
  palettes: SavedPalette[];
  onSave: (name: string, colors: string[]) => void;
  onDelete: (id: string) => void;
  currentPalette: string[];
}

export default function SavedPalettes({ palettes, onSave, onDelete, currentPalette }: SavedPalettesProps) {
  const [name, setName] = useState('');

  const handleSave = () => {
    const paletteName = name.trim() || `Palette ${new Date().toLocaleDateString('fr-FR')}`;
    onSave(paletteName, currentPalette);
    setName('');
  };

  return (
    <div className="space-y-4">
      {/* Sauvegarder la palette actuelle */}
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Nom de la palette…"
          className="flex-1 min-w-0 text-sm px-3 py-2 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          title="Sauvegarder"
        >
          <FiPlus size={15} />
        </button>
      </div>

      {/* Aperçu palette actuelle */}
      <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
        {currentPalette.map((hex, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: hex }} />
        ))}
      </div>

      {/* Liste des palettes sauvegardées */}
      {palettes.length === 0 ? (
        <p className="text-sm text-muted text-center py-6">Aucune palette sauvegardée</p>
      ) : (
        <div className="space-y-2">
          {palettes.map((palette) => (
            <div key={palette.id} className="flex items-center gap-2 group">
              <div className="flex flex-1 gap-0.5 h-8 rounded-lg overflow-hidden">
                {palette.colors.map((hex, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: hex }} title={hex} />
                ))}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium text-foreground truncate max-w-20">{palette.name}</p>
                <p className="text-xs text-muted">{new Date(palette.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(palette.id)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-all"
                title="Supprimer"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
