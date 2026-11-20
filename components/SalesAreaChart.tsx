'use client';

import {useMemo, useState} from 'react';

interface SalesAreaChartProps {
  timeframe: '30D' | '7D';
}

const DATA_30D = [
  {label: 'Jan 01', value: 4280},
  {label: 'Jan 03', value: 4820},
  {label: 'Jan 05', value: 4510},
  {label: 'Jan 07', value: 5640},
  {label: 'Jan 09', value: 6180},
  {label: 'Jan 11', value: 5890},
  {label: 'Jan 13', value: 6940},
  {label: 'Jan 15', value: 7420},
  {label: 'Jan 17', value: 6810},
  {label: 'Jan 19', value: 8190},
  {label: 'Jan 21', value: 7920},
  {label: 'Jan 23', value: 8860},
  {label: 'Jan 25', value: 9410},
  {label: 'Jan 27', value: 9120},
  {label: 'Jan 30', value: 10680},
];

const DATA_7D = [
  {label: 'Jan 24', value: 8340},
  {label: 'Jan 25', value: 9410},
  {label: 'Jan 26', value: 8960},
  {label: 'Jan 27', value: 9120},
  {label: 'Jan 28', value: 9780},
  {label: 'Jan 29', value: 10240},
  {label: 'Jan 30', value: 10680},
];

function buildSmoothPath(points: Array<{x: number; y: number}>): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

export default function SalesAreaChart({timeframe}: SalesAreaChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const series = timeframe === '30D' ? DATA_30D : DATA_7D;

  const width = 560;
  const height = 132;
  const padX = 8;
  const padTop = 14;
  const padBottom = 18;

  const {points, linePath, areaPath} = useMemo(() => {
    const minVal = Math.min(...series.map((d) => d.value)) * 0.88;
    const maxVal = Math.max(...series.map((d) => d.value)) * 1.06;
    const span = maxVal - minVal || 1;
    const innerW = width - padX * 2;
    const innerH = height - padTop - padBottom;

    const pts = series.map((item, idx) => ({
      x: padX + (idx / Math.max(1, series.length - 1)) * innerW,
      y: padTop + (1 - (item.value - minVal) / span) * innerH,
      ...item,
    }));

    const line = buildSmoothPath(pts);
    const last = pts[pts.length - 1];
    const first = pts[0];
    const area = `${line} L ${last.x.toFixed(2)} ${(height - padBottom).toFixed(2)} L ${first.x.toFixed(2)} ${(height - padBottom).toFixed(2)} Z`;

    return {points: pts, linePath: line, areaPath: area};
  }, [series]);

  const activePoint = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div className="relative w-full select-none">
      {/* Subtle embedded violet chart texture aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-4 top-2 rounded-lg opacity-45"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 62% 58%, rgba(147, 18, 255, 0.2), rgba(147, 18, 255, 0.04) 55%, transparent 80%)',
        }}
      />

      {activePoint && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md border border-[#9312ff]/45 bg-[#120b1e]/95 px-2.5 py-1 text-[11px] shadow-lg backdrop-blur-md"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
          }}
        >
          <span className="text-[#8b8988]">{activePoint.label}</span>
          <span className="ml-2 font-semibold text-[#f7f7f8] tabular-nums">
            ${activePoint.value.toLocaleString()}
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[132px] w-full overflow-visible"
        onMouseLeave={() => setHoverIdx(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = ((e.clientX - rect.left) / rect.width) * width;
          let nearest = 0;
          let bestDist = Infinity;
          for (let i = 0; i < points.length; i++) {
            const d = Math.abs(points[i].x - relX);
            if (d < bestDist) {
              bestDist = d;
              nearest = i;
            }
          }
          setHoverIdx(nearest);
        }}
        role="img"
        aria-label="Daily dynamics of sales violet area chart"
      >
        <defs>
          <linearGradient id="zapChartAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9312ff" stopOpacity="0.46" />
            <stop offset="55%" stopColor="#9312ff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#9312ff" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="zapChartStrokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a1cf8" />
            <stop offset="55%" stopColor="#a020ff" />
            <stop offset="100%" stopColor="#df99ff" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0.2, 0.5, 0.8].map((ratio) => {
          const gy = padTop + ratio * (height - padTop - padBottom);
          return (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={gy}
              y2={gy}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 4"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#zapChartAreaGrad)" />

        {/* Glow stroke underneath */}
        <path
          d={linePath}
          fill="none"
          stroke="rgba(160, 32, 255, 0.45)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Main crisp curve */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#zapChartStrokeGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Active hover indicator */}
        {activePoint && (
          <g>
            <line
              x1={activePoint.x}
              x2={activePoint.x}
              y1={padTop}
              y2={height - padBottom}
              stroke="rgba(160, 32, 255, 0.55)"
              strokeDasharray="2 3"
              strokeWidth="1"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="5.5"
              fill="rgba(160, 32, 255, 0.28)"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="3"
              fill="#f7f7f8"
              stroke="#9312ff"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* X-axis sparse labels */}
        {points
          .filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1)
          .map((pt) => (
            <text
              key={pt.label}
              x={pt.x}
              y={height - 2}
              textAnchor={
                pt.x < 30 ? 'start' : pt.x > width - 30 ? 'end' : 'middle'
              }
              fill="#8b8988"
              fontSize="10"
              fontFamily="var(--font-inter), sans-serif"
            >
              {pt.label}
            </text>
          ))}
      </svg>
    </div>
  );
}
