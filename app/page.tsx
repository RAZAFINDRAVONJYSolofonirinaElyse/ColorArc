import Link from 'next/link';
import {
  FiDisc, FiGrid, FiEye, FiSliders, FiBookmark, FiHash, FiArrowRight,
} from 'react-icons/fi';
import type { ReactNode } from 'react';
import LandingNav from '@/components/LandingNav';

/* ── Data ─────────────────────────────────────── */

/* Palettes — objets avec hex (affiché) + cls (Tailwind compilé) */
const PALETTE_COOL = [
  { hex: '#1a1a2e', cls: 'bg-[#1a1a2e]' }, { hex: '#16213e', cls: 'bg-[#16213e]' },
  { hex: '#0f3460', cls: 'bg-[#0f3460]' }, { hex: '#533483', cls: 'bg-[#533483]' },
  { hex: '#6C5CE7', cls: 'bg-[#6C5CE7]' }, { hex: '#a29bfe', cls: 'bg-[#a29bfe]' },
  { hex: '#dfe6e9', cls: 'bg-[#dfe6e9]' }, { hex: '#b2bec3', cls: 'bg-[#b2bec3]' },
];
const PALETTE_WARM = [
  { hex: '#FF6B6B', cls: 'bg-[#FF6B6B]' }, { hex: '#FF8E53', cls: 'bg-[#FF8E53]' },
  { hex: '#FFC94A', cls: 'bg-[#FFC94A]' }, { hex: '#A8E063', cls: 'bg-[#A8E063]' },
  { hex: '#4ECDC4', cls: 'bg-[#4ECDC4]' }, { hex: '#45B7D1', cls: 'bg-[#45B7D1]' },
  { hex: '#2d3436', cls: 'bg-[#2d3436]' }, { hex: '#636e72', cls: 'bg-[#636e72]' },
];

interface Feature { icon: ReactNode; title: string; desc: string; bgClass: string; numClass: string }

/* bgClass / numClass sont des littéraux — Tailwind peut les scanner */
const FEATURES: Feature[] = [
  { icon: <FiDisc size={22} />,     title: 'Roue chromatique',     bgClass: 'bg-[#6C5CE7]', numClass: 'text-[#6C5CE7]/30', desc: 'Sélectionnez n\'importe quelle couleur par glisser-déposer sur une roue interactive dessinée pixel par pixel.' },
  { icon: <FiGrid size={22} />,     title: '7 modes d\'harmonie',  bgClass: 'bg-[#E056FD]', numClass: 'text-[#E056FD]/30', desc: 'Complémentaire, analogue, triadique, tétradique, split-complémentaire, carré, monochromatique.' },
  { icon: <FiEye size={22} />,      title: 'Accessibilité WCAG',   bgClass: 'bg-[#00CEC9]', numClass: 'text-[#00CEC9]/30', desc: 'Vérifiez le ratio de contraste texte/fond en temps réel. Badges AA, AAA et suggestions automatiques.' },
  { icon: <FiHash size={22} />,     title: 'Saisie HEX directe',   bgClass: 'bg-[#FDCB6E]', numClass: 'text-[#FDCB6E]/30', desc: 'Collez n\'importe quel code HEX — la roue et tous les sliders se synchronisent instantanément.' },
  { icon: <FiSliders size={22} />,  title: 'Nuancier & Mélangeur', bgClass: 'bg-[#74B9FF]', numClass: 'text-[#74B9FF]/30', desc: 'Nuancier 50→950 façon Tailwind. Mélangez deux couleurs avec un curseur de ratio précis.' },
  { icon: <FiBookmark size={22} />, title: 'Palettes sauvegardées',bgClass: 'bg-[#FF7675]', numClass: 'text-[#FF7675]/30', desc: 'Nommez et sauvegardez vos palettes localement. Retrouvez-les à chaque session.' },
];

const STATS = [
  { value: '7',    label: 'Modes d\'harmonie', cls: 'text-[#6C5CE7]' },
  { value: '6',    label: 'Formats d\'export', cls: 'text-[#E056FD]' },
  { value: '21',   label: 'Ratio max WCAG',    cls: 'text-[#00CEC9]' },
  { value: '100%', label: 'Local & gratuit',   cls: 'text-[#FDCB6E]' },
];

const STEPS = [
  { n: '1', label: 'Choisissez', cls: 'bg-[#6C5CE7]', desc: 'Cliquez sur la roue ou entrez un code HEX directement' },
  { n: '2', label: 'Explorez',   cls: 'bg-[#E056FD]', desc: 'Naviguez entre les 7 modes d\'harmonie et ajustez les teintes' },
  { n: '3', label: 'Exportez',   cls: 'bg-[#00CEC9]', desc: 'Copiez en HEX, RGB, HSL, CMYK ou variables CSS en un clic' },
];

const MOCK_HARMONIES = [
  { cls: 'mock-harmony-violet', name: 'Violet', hex: '#6C5CE7' },
  { cls: 'mock-harmony-mauve',  name: 'Mauve',  hex: '#CE56E0' },
  { cls: 'mock-harmony-coral',  name: 'Corail', hex: '#E0566C' },
  { cls: 'mock-harmony-honey',  name: 'Miel',   hex: '#E0CE56' },
];

/* Classe commune des swatches hero */
const SW = 'animate-float w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl shadow-lg';

/* ── Page ─────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ══ Nav ══ */}
      <LandingNav />

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-16 sm:pt-24 pb-0">

        {/* Orbs — couleurs Tailwind, délais via classes CSS */}
        <div className="animate-orb-pulse absolute top-0 left-1/2 -translate-x-1/2 w-175 h-125 rounded-full blur-[140px] -z-10 bg-violet-500 pointer-events-none" />
        <div className="animate-orb-pulse orb-delay-2 absolute top-40 right-1/4 w-72 h-72 rounded-full blur-[80px] -z-10 bg-pink-500 pointer-events-none" />
        <div className="animate-orb-pulse orb-delay-4 absolute top-56 left-1/5 w-56 h-56 rounded-full blur-[80px] -z-10 bg-cyan-400 pointer-events-none" />

        {/* Contenu hero */}
        <div className="animate-fade-up max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-medium text-muted shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block shrink-0" />
            Gratuit · Aucune inscription · Tout local
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black tracking-tight text-foreground leading-[1.04]">
            L'outil de couleurs
            <br />
            <span className="animate-gradient hero-text-gradient">pour designers</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Roue chromatique interactive, 7 modes d'harmonie, vérification WCAG,
            nuancier Tailwind et palettes sauvegardées — tout en un.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              href="/studio"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-white font-bold text-base transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 hover:-translate-y-0.5"
            >
              Lancer ColorArc
              <FiArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-2xl bg-surface hover:bg-surface-hover border border-border text-foreground font-semibold text-base transition-all hover:-translate-y-0.5"
            >
              Voir les fonctionnalités
            </a>
          </div>

          {/* Swatches — 8 éléments hardcodés, timing via classes float-N */}
          <div className="flex gap-2 sm:gap-2.5 justify-center flex-wrap pt-2">
            <div className={`${SW} float-0 bg-[#FF6B6B]`} />
            <div className={`${SW} float-1 bg-[#FF8E53]`} />
            <div className={`${SW} float-2 bg-[#FFC94A]`} />
            <div className={`${SW} float-3 bg-[#A8E063]`} />
            <div className={`${SW} float-4 bg-[#4ECDC4]`} />
            <div className={`${SW} float-5 bg-[#45B7D1]`} />
            <div className={`${SW} float-6 bg-[#6C5CE7]`} />
            <div className={`${SW} float-7 bg-[#E056FD]`} />
          </div>
        </div>

        {/* ── Maquette de l'app ── */}
        <div className="animate-fade-up fade-delay-025 animate-mock-float max-w-5xl mx-auto mt-12 sm:mt-16 relative">
          <div className="mockup-glow absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-20 blur-3xl -z-10 rounded-full opacity-40 pointer-events-none" />

          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.45)] bg-[#0e0e14]">

            {/* Barre de titre */}
            <div className="relative flex items-center px-4 py-2.5 bg-[#18181f] border-b border-[#2e2e3a] shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 text-[11px] text-[#7070a0] font-medium select-none">
                ColorArc Studio
              </span>
            </div>

            {/* Corps — hauteur fixe via Tailwind */}
            <div className="flex h-65">

              {/* Panneau gauche */}
              <div className="hidden sm:flex w-52 border-r border-[#2e2e3a] p-3 flex-col gap-3 overflow-hidden shrink-0">
                <div className="mock-wheel relative w-28 h-28 rounded-full mx-auto shadow-xl overflow-hidden shrink-0">
                  <div className="mock-wheel-overlay absolute inset-0 rounded-full pointer-events-none" />
                  <div className="absolute w-3 h-3 rounded-full bg-white border border-[#444] shadow-md z-10 top-[28%] left-[64%] -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="bg-[#22222c] border border-[#2e2e3a] rounded-xl px-2.5 py-2 flex items-center gap-2">
                  <div className="mock-hex-swatch w-6 h-6 rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5">
                      <span className="text-[#7070a0] font-mono text-xs">#</span>
                      <span className="text-[#ececf4] font-mono text-xs font-bold">6C5CE7</span>
                    </div>
                    <span className="text-[#7070a0] text-[9px]">Violet électrique</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[#7070a0] w-3 shrink-0">H</span>
                    <div className="mock-slider-hue relative flex-1 h-2 rounded-full">
                      <div className="absolute w-3 h-3 rounded-full bg-white border border-[#555] shadow-sm top-[50%] left-[71.6%] -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[9px] text-[#7070a0] w-6 text-right shrink-0">258°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[#7070a0] w-3 shrink-0">S</span>
                    <div className="mock-slider-sat relative flex-1 h-2 rounded-full">
                      <div className="absolute w-3 h-3 rounded-full bg-white border border-[#555] shadow-sm top-[50%] left-[72%] -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[9px] text-[#7070a0] w-6 text-right shrink-0">72%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[#7070a0] w-3 shrink-0">L</span>
                    <div className="mock-slider-lit relative flex-1 h-2 rounded-full">
                      <div className="absolute w-3 h-3 rounded-full bg-white border border-[#555] shadow-sm top-[50%] left-[65%] -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[9px] text-[#7070a0] w-6 text-right shrink-0">65%</span>
                  </div>
                </div>
              </div>

              {/* Panneau droit */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex border-b border-[#2e2e3a] bg-[#18181f] shrink-0 overflow-x-auto">
                  {['Harmonie','Palette','WCAG','Outils','Sauvegardés'].map((t, i) => (
                    <div
                      key={t}
                      className={`px-3 py-2 text-[10px] font-semibold whitespace-nowrap shrink-0 ${
                        i === 0 ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6] -mb-px' : 'text-[#7070a0]'
                      }`}
                    >
                      {t}
                    </div>
                  ))}
                </div>

                <div className="flex-1 p-3 sm:p-4 overflow-hidden">
                  <p className="text-[9px] text-[#7070a0] uppercase font-bold tracking-wider mb-3">
                    Couleurs harmoniques — Tétradique
                  </p>
                  <div className="flex gap-2 h-28">
                    {MOCK_HARMONIES.map(({ cls, name, hex }) => (
                      <div key={hex} className={`flex-1 rounded-xl relative overflow-hidden shadow-sm ${cls}`}>
                        <div className="absolute bottom-0 left-0 right-0 p-1.5">
                          <span className="block text-[8px] font-bold text-white/90 truncate">{name}</span>
                          <span className="block text-[8px] font-mono text-white/60 truncate">{hex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-3">
                    {['Comp.','Anal.','Triad.','Tétra.'].map((m, i) => (
                      <div key={m} className={`px-2 py-1 rounded text-[9px] font-semibold ${i === 3 ? 'bg-[#8b5cf6] text-white' : 'bg-[#22222c] text-[#7070a0]'}`}>
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Stats strip ══ */}
      <section className="border-y border-border bg-surface/40 py-10 mt-12 sm:mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label, cls }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <span className={`text-3xl sm:text-4xl font-black tabular-nums ${cls}`}>{value}</span>
                <span className="text-xs text-muted leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Features ══ */}
      <section id="features" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Fonctionnalités</p>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground">Tout l'outillage couleur</h2>
            <p className="text-muted mt-3 max-w-md mx-auto text-sm sm:text-base">
              6 outils essentiels pour concevoir, tester et exporter vos palettes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, title, desc, bgClass, numClass }, idx) => (
              <div
                key={title}
                className="group relative bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-transparent"
              >
                <div className={`h-0.75 w-full ${bgClass}`} />
                <div className="p-6">
                  <span className={`absolute top-5 right-5 text-sm font-black ${numClass}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${bgClass}`}>
                    {icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-base">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none ${bgClass}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Palette showcase ══ */}
      <section className="py-12 sm:py-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 text-center">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Palettes</p>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">Des harmonies instantanées</h2>
          <p className="text-muted mt-2 text-sm">
            Cliquez sur la roue, les couleurs harmoniques apparaissent automatiquement
          </p>
        </div>

        <div className="space-y-2">
          {[
            { name: 'Cosmos',  palette: PALETTE_COOL },
            { name: 'Sunrise', palette: PALETTE_WARM },
          ].map(({ name, palette }) => (
            <div key={name}>
              <div className="flex h-20 sm:h-28">
                {palette.map(({ hex, cls }) => (
                  <div key={hex} className={`flex-1 transition-all duration-300 hover:flex-[2.5] relative group overflow-hidden ${cls}`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    <span className="absolute bottom-1.5 left-0 right-0 text-center text-[8px] font-mono text-white/0 group-hover:text-white/80 transition-colors duration-200 hidden sm:block">
                      {hex}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex px-1 pt-1.5">
                <span className="text-[10px] text-muted font-semibold tracking-wider ml-1">Palette {name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Comment ça marche ══ */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-surface/40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Mode d'emploi</p>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-12">En trois étapes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-6 left-[calc(50%/3+24px)] right-[calc(50%/3+24px)] h-px border-t-2 border-dashed border-border" />
            {STEPS.map(({ n, label, desc, cls }) => (
              <div key={n} className="flex flex-col items-center gap-3 relative z-10">
                <div className={`w-12 h-12 rounded-2xl text-white text-xl font-black flex items-center justify-center shadow-lg ${cls}`}>
                  {n}
                </div>
                <p className="font-bold text-foreground">{label}</p>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA finale ══ */}
      <section className="cta-gradient animate-gradient relative overflow-hidden px-4 sm:px-6 py-20 sm:py-28 text-center">
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 -z-10 bg-white pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-15 -z-10 bg-yellow-300 pointer-events-none" />

        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Prêt à créer de belles palettes ?
          </h2>
          <p className="text-white/75 text-base sm:text-lg">
            Aucune inscription. Aucun abonnement. Entièrement gratuit.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-white/90 text-accent font-bold text-lg transition-all shadow-2xl hover:-translate-y-1"
          >
            Lancer ColorArc
            <FiArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer className="px-4 sm:px-6 py-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-linear-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-[9px] font-black">CA</span>
            </div>
            <span className="font-semibold text-foreground">ColorArc</span>
            <span className="text-border mx-1">·</span>
            <span>Outil de couleurs pour designers</span>
          </div>
          <Link href="/studio" className="hover:text-foreground transition-colors">
            Ouvrir le studio →
          </Link>
        </div>
      </footer>
    </div>
  );
}
