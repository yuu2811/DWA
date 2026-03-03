'use client';

import { DomainResult } from '@/lib/types';

interface RadarChartProps {
  domains: DomainResult[];
  previousDomains?: DomainResult[] | null;
}

const LABELS = ['睡眠', 'ストレス', '疲労', '食事', '運動'];
import { DOMAIN_COLORS } from '@/lib/constants';

const COLORS = DOMAIN_COLORS;

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

export default function RadarChart({ domains, previousDomains }: RadarChartProps) {
  const cx = 150;
  const cy = 150;
  const maxR = 110;
  const sides = 5;
  const angleStep = 360 / sides;

  const values = domains.map((d) => riskToValue(d.riskLevel));
  const prevValues = previousDomains?.map((d) => riskToValue(d.riskLevel));

  const rings = [0.25, 0.5, 0.75, 1.0];

  const gridPaths = rings.map((scale) => {
    const points = Array.from({ length: sides }, (_, i) => {
      const { x, y } = polarToCartesian(cx, cy, maxR * scale, angleStep * i);
      return `${x},${y}`;
    });
    return `M${points.join('L')}Z`;
  });

  const axes = Array.from({ length: sides }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, maxR, angleStep * i);
    return { x1: cx, y1: cy, x2: x, y2: y };
  });

  // Current polygon
  const dataPoints = values.map((v, i) => {
    const { x, y } = polarToCartesian(cx, cy, maxR * v, angleStep * i);
    return { x, y };
  });
  const dataPath = `M${dataPoints.map((p) => `${p.x},${p.y}`).join('L')}Z`;

  // Previous polygon
  let prevPath = '';
  let prevDataPoints: { x: number; y: number }[] = [];
  if (prevValues) {
    prevDataPoints = prevValues.map((v, i) => {
      const { x, y } = polarToCartesian(cx, cy, maxR * v, angleStep * i);
      return { x, y };
    });
    prevPath = `M${prevDataPoints.map((p) => `${p.x},${p.y}`).join('L')}Z`;
  }

  const labelPositions = Array.from({ length: sides }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, maxR + 28, angleStep * i);
    return { x, y };
  });

  // Change indicators
  const changes = previousDomains
    ? domains.map((d, i) => {
        const prev = previousDomains[i];
        if (!prev) return null;
        const currentVal = riskToValue(d.riskLevel);
        const prevVal = riskToValue(prev.riskLevel);
        if (currentVal === prevVal) return null;
        return { improved: currentVal > prevVal };
      })
    : null;

  return (
    <div className="flex justify-center" role="img" aria-label={`5領域バランスチャート: ${domains.map(d => `${LABELS[domains.indexOf(d)]} ${d.riskLevel === 'low' ? '良好' : d.riskLevel === 'moderate' ? '要改善' : '要対応'}`).join('、')}`}>
      <svg viewBox="0 0 300 300" className="w-full max-w-[320px]" aria-hidden="true">
        {gridPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}

        {axes.map((a, i) => (
          <line key={i} {...a} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}

        {/* Previous polygon (dashed) */}
        {prevPath && (
          <path d={prevPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="4 3" className="radar-polygon" />
        )}

        {/* Current polygon */}
        <path d={dataPath} fill="url(#radarGradient)" fillOpacity={0.2} stroke="url(#radarStroke)" strokeWidth={2} className="radar-polygon" />

        {/* Previous points */}
        {prevDataPoints.map((p, i) => (
          <circle key={`prev-${i}`} cx={p.x} cy={p.y} r={2.5} fill="rgba(255,255,255,0.3)" stroke="var(--bg-primary)" strokeWidth={1.5} />
        ))}

        {/* Current points */}
        {dataPoints.map((p, i) => {
          const domainKey = domains[i].domain;
          const color = COLORS[domainKey as keyof typeof COLORS] || '#638cff';
          return <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke="var(--bg-primary)" strokeWidth={2} />;
        })}

        {/* Labels with change arrows */}
        {labelPositions.map((pos, i) => (
          <g key={i}>
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" className="text-[11px] font-medium" fill="var(--text-secondary)">
              {LABELS[i]}
            </text>
            {changes && changes[i] && (
              <text
                x={pos.x + (pos.x > cx ? 18 : -18)}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-bold"
                fill={changes[i]!.improved ? '#34d399' : '#fb7185'}
              >
                {changes[i]!.improved ? '↑' : '↓'}
              </text>
            )}
          </g>
        ))}

        {/* Legend for previous */}
        {previousDomains && (
          <g>
            <line x1="20" y1="285" x2="36" y2="285" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x="40" y="285" dominantBaseline="middle" className="text-[9px]" fill="var(--text-muted)">前回</text>
          </g>
        )}

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
