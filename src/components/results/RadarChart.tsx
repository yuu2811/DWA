'use client';

import { DomainResult } from '@/lib/types';

interface RadarChartProps {
  domains: DomainResult[];
}

const LABELS = ['睡眠', 'ストレス', '疲労', '食事', '運動'];
const COLORS = {
  sleep: '#638cff',
  stress: '#a78bfa',
  fatigue: '#fb7185',
  diet: '#34d399',
  exercise: '#fbbf24',
};

function riskToValue(level: string): number {
  switch (level) {
    case 'low': return 1;
    case 'moderate': return 0.55;
    case 'high': return 0.2;
    default: return 0.5;
  }
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

export default function RadarChart({ domains }: RadarChartProps) {
  const cx = 150;
  const cy = 150;
  const maxR = 110;
  const sides = 5;
  const angleStep = 360 / sides;

  const values = domains.map((d) => riskToValue(d.riskLevel));

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Grid lines (pentagon outlines)
  const gridPaths = rings.map((scale) => {
    const points = Array.from({ length: sides }, (_, i) => {
      const { x, y } = polarToCartesian(cx, cy, maxR * scale, angleStep * i);
      return `${x},${y}`;
    });
    return `M${points.join('L')}Z`;
  });

  // Axis lines
  const axes = Array.from({ length: sides }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, maxR, angleStep * i);
    return { x1: cx, y1: cy, x2: x, y2: y };
  });

  // Data polygon
  const dataPoints = values.map((v, i) => {
    const { x, y } = polarToCartesian(cx, cy, maxR * v, angleStep * i);
    return { x, y };
  });
  const dataPath = `M${dataPoints.map((p) => `${p.x},${p.y}`).join('L')}Z`;

  // Label positions
  const labelPositions = Array.from({ length: sides }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, maxR + 28, angleStep * i);
    return { x, y };
  });

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-[320px]">
        {/* Grid */}
        {gridPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}

        {/* Axes */}
        {axes.map((a, i) => (
          <line key={i} {...a} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}

        {/* Data fill */}
        <path
          d={dataPath}
          fill="url(#radarGradient)"
          fillOpacity={0.2}
          stroke="url(#radarStroke)"
          strokeWidth={2}
          className="radar-polygon"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => {
          const domainKey = domains[i].domain;
          const color = COLORS[domainKey as keyof typeof COLORS] || '#638cff';
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={4}
              fill={color}
              stroke="var(--bg-primary)"
              strokeWidth={2}
            />
          );
        })}

        {/* Labels */}
        {labelPositions.map((pos, i) => (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[11px] font-medium"
            fill="var(--text-secondary)"
          >
            {LABELS[i]}
          </text>
        ))}

        {/* Gradient defs */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#638cff" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#638cff" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
