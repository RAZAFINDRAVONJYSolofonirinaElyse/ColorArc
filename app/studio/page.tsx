'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  FiDisc, FiGrid, FiEye, FiSliders, FiBookmark, FiDroplet,
  FiArrowLeft, FiSun, FiMoon, FiCopy, FiCheck, FiShuffle,
} from 'react-icons/fi';

import ColorSliders from '@/components/ColorInfo/ColorSliders';
import ColorFormats from '@/components/ColorInfo/ColorFormats';
import HarmonySelector from '@/components/HarmonyPanel/HarmonySelector';
import HarmonyPalette from '@/components/HarmonyPanel/HarmonyPalette';
import PaletteGenerator from '@/components/PaletteTools/PaletteGenerator';
import ContrastChecker from '@/components/AccessibilityPanel/ContrastChecker';
import ColorMixer from '@/components/AdjustmentPanel/ColorMixer';
import ShadeScale from '@/components/AdjustmentPanel/ShadeScale';
import SavedPalettes from '@/components/SavedPalettes/SavedPalettes';
import { useColorState } from '@/hooks/useColorState';
import { useSavedPalettes } from '@/hooks/useSavedPalettes';
import { loadTheme, saveTheme } from '@/lib/storage';
import { getColorName, hslToChroma, isValidHex, hexToHSL } from '@/lib/colorUtils';

const ColorWheel = dynamic(() => import('@/components/ColorWheel/ColorWheel'), { ssr: false });

// 'color' tab is only used on mobile (replaces the left aside)
type Tab = 'color' | 'harmony' | 'palette' | 'wcag' | 'adjust' | 'saved';

const DESKTOP_TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'harmony', icon: <FiDisc size={14} />,     label: 'Harmonie' },
  { id: 'palette', icon: <FiGrid size={14} />,     label: 'Palette' },
  { id: 'wcag',    icon: <FiEye size={14} />,      label: 'Accessibilité' },
  { id: 'adjust',  icon: <FiSliders size={14} />,  label: 'Outils' },
  { id: 'saved',   icon: <FiBookmark size={14} />, label: 'Sauvegardés' },
];

const MOBILE_TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: 'color',   icon: <FiDroplet size={18} />,  label: 'Couleur' },
  { id: 'harmony', icon: <FiDisc size={18} />,     label: 'Harmonie' },
  { id: 'palette', icon: <FiGrid size={18} />,     label: 'Palette' },
  { id: 'wcag',    icon: <FiEye size={18} />,      label: 'Accès.' },
  { id: 'adjust',  icon: <FiSliders size={18} />,  label: 'Outils' },
  { id: 'saved',   icon: <FiBookmark size={18} />, label: 'Palettes' },
];

export default function StudioPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  // Start on 'color' tab so mobile users see the wheel immediately
  const [activeTab, setActiveTab] = useState<Tab>('color');
  const [hexInput, setHexInput] = useState('');
  const [hexError, setHexError] = useState(false);
  const [copied, setCopied] = useState(false);

  const colorState = useColorState();
  const { palettes, save, remove } = useSavedPalettes();

  const {
    h, s, l,
    harmonyMode, paletteCount, lockedColors,
    setHSL, setH, setS, setL,
    setHarmonyMode, setPaletteCount, toggleLock,
    randomize, currentPalette, harmonyColors,
  } = colorState;

  const currentHex = hslToChroma(h, s, l).hex().toUpperCase();
  const colorName = getColorName(h, s, l);

  // On desktop, 'color' tab falls back to 'harmony' for the right panel
  const contentTab: Exclude<Tab, 'color'> =
    activeTab === 'color' ? 'harmony' : activeTab;

  useEffect(() => {
    setHexInput(currentHex.replace('#', ''));
    setHexError(false);
  }, [currentHex]);

  useEffect(() => {
    const saved = loadTheme();
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'r' && e.key !== 'R') return;
      const active = document.activeElement;
      if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA') return;
      randomize();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [randomize]);

  const handleWheelChange = useCallback((newH: number, newS: number) => {
    setHSL(newH, newS, l);
  }, [setHSL, l]);

  const handleHarmonySelect = useCallback((hex: string) => {
    const { h: nh, s: ns, l: nl } = hexToHSL(hex);
    setHSL(nh, ns, nl);
  }, [setHSL]);

  const handleHexTyping = (raw: string) => {
    const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(clean);
    const full = `#${clean}`;
    if (clean.length === 6 && isValidHex(full)) {
      setHexError(false);
      const { h: nh, s: ns, l: nl } = hexToHSL(full);
      setHSL(nh, ns, nl);
    } else {
      setHexError(clean.length > 0 && clean.length < 6);
    }
  };

  const handleNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.toUpperCase();
    setHexInput(v.replace('#', ''));
    const { h: nh, s: ns, l: nl } = hexToHSL(v);
    setHSL(nh, ns, nl);
  };

  const copyHex = async () => {
    await navigator.clipboard.writeText(currentHex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSavePalette = () => {
    save(`Palette ${colorName}`, currentPalette);
    setActiveTab('saved');
  };

  // ── Color controls (shared between desktop aside + mobile 'color' tab) ──
  const colorControls = (
    <>
      {/* Roue */}
      <div className="flex justify-center">
        <ColorWheel
          hue={h}
          saturation={s}
          onColorChange={handleWheelChange}
          harmonyColors={harmonyColors}
          harmonyMode={harmonyMode}
          size={220}
        />
      </div>

      {/* Champ HEX */}
      <div className="space-y-2">
        <label htmlFor="hex-input" className="text-xs font-bold text-muted uppercase tracking-wider">
          Entrer une couleur
        </label>
        <div
          className={`flex items-center gap-3 px-3 py-3 rounded-2xl border-2 transition-colors ${
            hexError
              ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
              : 'border-border bg-surface focus-within:border-accent'
          }`}
        >
          <div
            className="relative w-10 h-10 rounded-xl shrink-0 shadow-sm overflow-hidden border border-border/50 cursor-pointer"
            style={{ backgroundColor: currentHex }}
          >
            <input
              type="color"
              aria-label="Sélecteur de couleur natif"
              value={currentHex.toLowerCase()}
              onChange={handleNativePicker}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-muted font-mono text-base select-none">#</span>
              <input
                id="hex-input"
                type="text"
                aria-label="Code couleur HEX"
                value={hexInput}
                onChange={(e) => handleHexTyping(e.target.value)}
                placeholder="3A86FF"
                maxLength={6}
                spellCheck={false}
                className="flex-1 min-w-0 bg-transparent text-base font-mono font-bold uppercase text-foreground placeholder:text-muted/30 focus:outline-none"
              />
            </div>
            <p className="text-xs text-muted mt-0.5 truncate">
              {hexError ? 'Code invalide — 6 caractères hex' : colorName}
            </p>
          </div>
          <button
            type="button"
            onClick={copyHex}
            className="shrink-0 w-8 h-8 rounded-lg bg-background hover:bg-surface-hover border border-border flex items-center justify-center transition-colors text-foreground"
            title="Copier HEX"
          >
            {copied ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
          </button>
        </div>
        <p className="text-xs text-muted px-1 font-mono tabular-nums">
          H: {Math.round(h)}° · S: {Math.round(s)}% · L: {Math.round(l)}%
        </p>
      </div>

      {/* Sliders */}
      <ColorSliders
        hue={h} saturation={s} lightness={l}
        onHChange={setH} onSChange={setS} onLChange={setL}
      />

      {/* Bouton aléatoire */}
      <button
        type="button"
        onClick={randomize}
        className="w-full py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-hover text-sm font-semibold text-foreground transition-colors flex items-center justify-center gap-2"
      >
        <FiShuffle size={14} />
        Couleur aléatoire
        <kbd className="text-xs font-mono text-muted bg-background border border-border rounded px-1">R</kbd>
      </button>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">

      {/* ══ Header ══ */}
      <header className="flex items-center justify-between px-3 sm:px-4 h-12 border-b border-border bg-background/90 backdrop-blur-sm shrink-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
          >
            <FiArrowLeft size={13} />
            <span className="hidden sm:inline">Accueil</span>
          </Link>
          <span className="text-border select-none hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 rounded-lg bg-linear-to-br from-violet-500 via-pink-500 to-orange-400 flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-black">CA</span>
            </div>
            <span className="text-sm font-bold text-foreground">ColorArc</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile : chip couleur active → va sur l'onglet Couleur */}
          <button
            type="button"
            onClick={() => setActiveTab('color')}
            className="md:hidden flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface border border-border text-xs font-mono text-foreground hover:bg-surface-hover transition-colors"
            title="Voir les contrôles couleur"
          >
            <span className="w-4 h-4 rounded shrink-0 border border-border/40" style={{ backgroundColor: currentHex }} />
            #{hexInput || currentHex.replace('#', '')}
          </button>

          <span className="hidden lg:flex items-center gap-1.5 text-xs text-muted">
            <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded font-mono">R</kbd>
            aléatoire
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-surface hover:bg-surface-hover border border-border flex items-center justify-center transition-colors text-foreground"
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>
        </div>
      </header>

      {/* ══ Corps ══ */}
      <main className="flex flex-row flex-1 overflow-hidden">

        {/* ── Panneau gauche (desktop uniquement) ── */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 xl:w-80 border-r border-border shrink-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {colorControls}
          </div>
          {/* Formats — fixe en bas */}
          <div className="border-t border-border p-4 bg-surface/30 shrink-0">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Formats</p>
            <ColorFormats hue={h} saturation={s} lightness={l} />
          </div>
        </aside>

        {/* ── Panneau droit ── */}
        <section className="flex flex-col flex-1 overflow-hidden min-w-0">

          {/* Tabs desktop */}
          <div className="hidden md:flex items-stretch border-b border-border bg-surface/30 shrink-0 overflow-x-auto">
            {DESKTOP_TABS.map(({ id, icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 lg:px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors shrink-0 ${
                  contentTab === id
                    ? 'border-accent text-accent bg-background'
                    : 'border-transparent text-muted hover:text-foreground hover:bg-background/50'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
            {/* Couleur active */}
            <div className="ml-auto flex items-center gap-1.5 px-4 shrink-0">
              <span
                className="w-5 h-5 rounded-lg border border-border/50 shadow-sm shrink-0"
                style={{ backgroundColor: currentHex }}
              />
              <span className="text-xs font-mono text-muted hidden xl:block">{currentHex}</span>
            </div>
          </div>

          {/* Contenu onglet */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-5 lg:p-6 max-w-2xl">

              {/* ── Onglet Couleur (mobile uniquement) ── */}
              {activeTab === 'color' && (
                <div className="space-y-5 md:hidden">
                  {colorControls}
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Formats</p>
                    <ColorFormats hue={h} saturation={s} lightness={l} />
                  </div>
                </div>
              )}

              {/* ── Sur desktop, 'color' → harmony dans le panneau droit ── */}
              {activeTab === 'color' && (
                <div className="hidden md:block">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Mode d'harmonie</p>
                      <HarmonySelector current={harmonyMode} onChange={setHarmonyMode} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Couleurs harmoniques</p>
                      <HarmonyPalette colors={harmonyColors} onSelect={handleHarmonySelect} />
                      <p className="text-xs text-muted mt-3">
                        Cliquez sur une couleur pour la sélectionner comme couleur active.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'harmony' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Mode d'harmonie</p>
                    <HarmonySelector current={harmonyMode} onChange={setHarmonyMode} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Couleurs harmoniques</p>
                    <HarmonyPalette colors={harmonyColors} onSelect={handleHarmonySelect} />
                    <p className="text-xs text-muted mt-3">
                      Cliquez sur une couleur pour la sélectionner comme couleur active.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'palette' && (
                <div className="space-y-5">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">Générateur de palettes</p>
                  <PaletteGenerator
                    palette={currentPalette}
                    count={paletteCount}
                    lockedColors={lockedColors}
                    onCountChange={setPaletteCount}
                    onToggleLock={toggleLock}
                    onRandomize={randomize}
                    onSave={handleSavePalette}
                  />
                  <p className="text-xs text-muted">
                    Survolez une couleur puis cliquez sur l'icône cadenas pour la verrouiller.
                  </p>
                </div>
              )}

              {activeTab === 'wcag' && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">Vérification WCAG 2.1</p>
                  <ContrastChecker activeColor={currentHex} />
                </div>
              )}

              {activeTab === 'adjust' && (
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Mélangeur de couleurs</p>
                    <ColorMixer />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Nuancier Tailwind</p>
                    <ShadeScale hex={currentHex} />
                  </div>
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">Palettes sauvegardées</p>
                  <SavedPalettes
                    palettes={palettes}
                    onSave={save}
                    onDelete={remove}
                    currentPalette={currentPalette}
                  />
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      {/* ══ Barre de navigation mobile (bottom nav) ══ */}
      <nav className="md:hidden flex items-stretch border-t border-border bg-background/95 backdrop-blur-sm shrink-0 z-20">
        {MOBILE_TABS.map(({ id, icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors min-w-0 ${
              activeTab === id ? 'text-accent' : 'text-muted hover:text-foreground'
            }`}
          >
            {id === 'color' ? (
              <span
                className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${
                  activeTab === 'color' ? 'border-accent scale-110' : 'border-muted/40'
                }`}
                style={{ backgroundColor: currentHex }}
              />
            ) : icon}
            <span className="text-[10px] font-medium leading-tight truncate">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
