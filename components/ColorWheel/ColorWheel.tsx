'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { HarmonyMode } from '@/lib/colorUtils';
import chroma from 'chroma-js';

interface ColorWheelProps {
  hue: number;
  saturation: number;
  onColorChange: (h: number, s: number) => void;
  harmonyColors: string[];
  harmonyMode: HarmonyMode;
  size?: number;
}

export default function ColorWheel({
  hue,
  saturation,
  onColorChange,
  harmonyColors,
  size = 280,
}: ColorWheelProps) {
  const wheelRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  const drawWheel = useCallback(() => {
    const canvas = wheelRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 4;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          const h = ((angle % 360) + 360) % 360;
          const s = dist / radius;

          const color = chroma.hsl(h, s, 0.5);
          const [r, g, b] = color.rgb();
          const alpha = dist <= radius - 1 ? 255 : Math.round(255 * (1 - (dist - (radius - 1))));

          const idx = (y * size + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = alpha;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // White center fade
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.18);
    centerGrad.addColorStop(0, 'rgba(255,255,255,0.85)');
    centerGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.fill();
  }, [size]);

  const drawOverlay = useCallback(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 4;

    // Draw harmony lines
    const positions = harmonyColors.map((hex) => {
      const [h] = chroma(hex).hsl();
      const angle = (((h || 0) - 90) * Math.PI) / 180;
      const r = (saturation / 100) * radius;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });

    if (positions.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(positions[0].x, positions[0].y);
      for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i].x, positions[i].y);
      }
      if (positions.length > 2) ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw harmony dots (skip first = selected color)
    harmonyColors.slice(1).forEach((hex) => {
      const [h] = chroma(hex).hsl();
      const angle = (((h || 0) - 90) * Math.PI) / 180;
      const r = (saturation / 100) * radius;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = hex;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Main cursor
    const mainAngle = ((hue - 90) * Math.PI) / 180;
    const mainR = (saturation / 100) * radius;
    const mx = cx + mainR * Math.cos(mainAngle);
    const my = cy + mainR * Math.sin(mainAngle);

    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, Math.PI * 2);
    ctx.fillStyle = chroma.hsl(hue, saturation / 100, 0.5).hex();
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(mx, my, 13, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [hue, saturation, harmonyColors, size]);

  useEffect(() => { drawWheel(); }, [drawWheel]);
  useEffect(() => { drawOverlay(); }, [drawOverlay]);

  const getColorFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = wheelRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 4;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), radius);

      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const h = ((angle % 360) + 360) % 360;
      const s = (dist / radius) * 100;

      onColorChange(h, s);
    },
    [size, onColorChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    getColorFromEvent(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    getColorFromEvent(e.clientX, e.clientY);
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    const t = e.touches[0];
    getColorFromEvent(t.clientX, t.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const t = e.touches[0];
    getColorFromEvent(t.clientX, t.clientY);
  };

  return (
    <div
      className="relative cursor-crosshair select-none"
      style={{ width: size, height: size }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={wheelRef}
        style={{ width: size, height: size, position: 'absolute', top: 0, left: 0, borderRadius: '50%' }}
      />
      <canvas
        ref={overlayRef}
        style={{ width: size, height: size, position: 'absolute', top: 0, left: 0, borderRadius: '50%' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => { isDragging.current = false; }}
      />
    </div>
  );
}
