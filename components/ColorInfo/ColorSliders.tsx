'use client';

interface ColorSlidersProps {
  hue: number;
  saturation: number;
  lightness: number;
  onHChange: (h: number) => void;
  onSChange: (s: number) => void;
  onLChange: (l: number) => void;
}

export default function ColorSliders({
  hue, saturation, lightness,
  onHChange, onSChange, onLChange,
}: ColorSlidersProps) {
  return (
    <div className="space-y-3 w-full">
      <SliderRow
        label="Teinte"
        value={hue}
        min={0}
        max={360}
        onChange={onHChange}
        gradient={`linear-gradient(to right,
          hsl(0,${saturation}%,${lightness}%),
          hsl(60,${saturation}%,${lightness}%),
          hsl(120,${saturation}%,${lightness}%),
          hsl(180,${saturation}%,${lightness}%),
          hsl(240,${saturation}%,${lightness}%),
          hsl(300,${saturation}%,${lightness}%),
          hsl(360,${saturation}%,${lightness}%))`}
        unit="°"
      />
      <SliderRow
        label="Saturation"
        value={saturation}
        min={0}
        max={100}
        onChange={onSChange}
        gradient={`linear-gradient(to right, hsl(${hue},0%,${lightness}%), hsl(${hue},100%,${lightness}%))`}
        unit="%"
      />
      <SliderRow
        label="Luminosité"
        value={lightness}
        min={0}
        max={100}
        onChange={onLChange}
        gradient={`linear-gradient(to right, hsl(${hue},${saturation}%,5%), hsl(${hue},${saturation}%,50%), hsl(${hue},${saturation}%,95%))`}
        unit="%"
      />
    </div>
  );
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  gradient: string;
  unit: string;
}

function SliderRow({ label, value, min, max, onChange, gradient, unit }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-muted tracking-wide">{label}</label>
        <span className="text-xs font-mono font-bold text-foreground tabular-nums w-12 text-right">
          {Math.round(value)}{unit}
        </span>
      </div>
      {/* Track + thumb container — 20px tall to give the thumb room */}
      <div className="relative flex items-center h-5">
        {/* Colored track */}
        <div
          className="absolute inset-0 my-auto h-3 rounded-full shadow-inner"
          style={{ background: gradient }}
        />
        {/* Circular thumb */}
        <div
          className="absolute w-5 h-5 rounded-full bg-white shadow-md border-2 border-border pointer-events-none z-10"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
        {/* Invisible range input on top for interaction */}
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          value={Math.round(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
    </div>
  );
}
