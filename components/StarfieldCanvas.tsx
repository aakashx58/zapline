'use client';

import {useEffect, useRef} from 'react';

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Deterministic static starfield (nothing in the sky is animated in code)
      const rand = mulberry32(20261120);
      const area = width * height;
      const count = Math.min(420, Math.max(120, Math.floor(area / 4200)));

      for (let i = 0; i < count; i++) {
        const x = rand() * width;
        const y = rand() * height;
        const tier = rand();
        const radius = tier > 0.96 ? 1.35 : tier > 0.78 ? 0.95 : 0.6;
        const alpha =
          tier > 0.96
            ? 0.75 + rand() * 0.25
            : tier > 0.78
              ? 0.35 + rand() * 0.35
              : 0.14 + rand() * 0.24;

        // Subtle cool-white tint on brighter stars
        ctx.fillStyle =
          tier > 0.92
            ? `rgba(235, 224, 255, ${alpha.toFixed(3)})`
            : `rgba(247, 247, 248, ${alpha.toFixed(3)})`;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
