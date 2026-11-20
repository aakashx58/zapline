'use client';

import {useEffect, useRef} from 'react';

interface PlanetRimCanvasProps {
  width: number;
  height: number;
  className?: string;
}

// Polar colour lookup table from deep inner planet shadow -> bright magenta-violet rim -> outer corona
const POLAR_COLOR_TABLE: Array<{pos: number; r: number; g: number; b: number; a: number}> = [
  {pos: 0.0, r: 0, g: 0, b: 0, a: 0.0},
  {pos: 0.22, r: 22, g: 4, b: 44, a: 0.18},
  {pos: 0.36, r: 92, g: 12, b: 196, a: 0.55},
  {pos: 0.45, r: 160, g: 32, b: 255, a: 0.92},
  {pos: 0.495, r: 244, g: 162, b: 255, a: 1.0}, // crisp horizon limb
  {pos: 0.53, r: 196, g: 44, b: 248, a: 0.88},
  {pos: 0.62, r: 147, g: 18, b: 255, a: 0.46},
  {pos: 0.78, r: 78, g: 10, b: 158, a: 0.16},
  {pos: 1.0, r: 0, g: 0, b: 0, a: 0.0},
];

function samplePolarTable(t: number): [number, number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < POLAR_COLOR_TABLE.length - 1; i++) {
    const c0 = POLAR_COLOR_TABLE[i];
    const c1 = POLAR_COLOR_TABLE[i + 1];
    if (clamped >= c0.pos && clamped <= c1.pos) {
      const u = (clamped - c0.pos) / (c1.pos - c0.pos || 1);
      return [
        Math.round(c0.r + (c1.r - c0.r) * u),
        Math.round(c0.g + (c1.g - c0.g) * u),
        Math.round(c0.b + (c1.b - c0.b) * u),
        c0.a + (c1.a - c0.a) * u,
      ];
    }
  }
  return [0, 0, 0, 0];
}

export default function PlanetRimCanvas({width, height, className = ''}: PlanetRimCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    // Render into a clean offscreen buffer for crisp polar gradient & smooth upscaling
    const scale = 0.5;
    const w = Math.max(320, Math.floor(width * scale));
    const h = Math.max(160, Math.floor(height * scale));

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = ctx.createImageData(w, h);
    const data = img.data;

    // Giant planet center well below the top rim so the upper arc spans across the top
    const cx = w * 0.5;
    const isNarrow = width < 900;
    const radius = isNarrow ? w * 1.45 : w * 0.92;
    const limbPeakY = isNarrow ? h * 0.34 : h * 0.16;
    const cy = limbPeakY + radius;
    const bandHalfWidth = isNarrow ? h * 0.52 : h * 0.34;

    for (let y = 0; y < h; y++) {
      const dy = y - cy;
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx); // top center is -PI/2

        // Angular falloff toward left/right edges so the arc tapers organically into black
        const angularOffset = Math.abs(angle + Math.PI / 2);
        const angularFalloff = Math.max(0, 1 - Math.pow(angularOffset / 0.72, 2.1));

        // Subtle deterministic polar ripple along the rim
        const streakMod =
          0.92 +
          0.08 * Math.sin(angle * 26.0) +
          0.05 * Math.cos(angle * 47.0 + 1.2);

        const radialDelta = dist - radius;
        const normalizedT = 0.495 + radialDelta / (bandHalfWidth * 2.0);
        const [r, g, b, a] = samplePolarTable(normalizedT);

        // Mask the deep interior of the planet sphere to pure black so stars behind it stay occulted or dark
        const finalAlpha = Math.min(1, a * angularFalloff * streakMod);

        const idx = (y * w + x) * 4;
        data[idx] = Math.round(r * finalAlpha);
        data[idx + 1] = Math.round(g * finalAlpha);
        data[idx + 2] = Math.round(b * finalAlpha);
        data[idx + 3] = Math.round(finalAlpha * 255);
      }
    }

    ctx.putImageData(img, 0, 0);

    // Add soft upper atmospheric violet bloom and subtle outward light streaks
    ctx.globalCompositeOperation = 'screen';
    const bloom = ctx.createRadialGradient(
      cx,
      limbPeakY + h * 0.04,
      w * 0.05,
      cx,
      limbPeakY + h * 0.12,
      w * 0.56
    );
    bloom.addColorStop(0, 'rgba(216, 118, 255, 0.34)');
    bloom.addColorStop(0.35, 'rgba(147, 18, 255, 0.24)');
    bloom.addColorStop(0.75, 'rgba(92, 12, 185, 0.08)');
    bloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);

    // Subtle radial streaks along the upper arc
    const streakAngles = [-0.42, -0.26, -0.11, 0.04, 0.18, 0.34];
    for (const offset of streakAngles) {
      const a = -Math.PI / 2 + offset;
      const x0 = cx + Math.cos(a) * (radius - 4);
      const y0 = cy + Math.sin(a) * (radius - 4);
      const x1 = cx + Math.cos(a) * (radius + bandHalfWidth * 0.85);
      const y1 = cy + Math.sin(a) * (radius + bandHalfWidth * 0.85);

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, 'rgba(244, 178, 255, 0.26)');
      grad.addColorStop(0.4, 'rgba(147, 18, 255, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{mixBlendMode: 'screen'}}
      className={`pointer-events-none block ${className}`}
    />
  );
}
