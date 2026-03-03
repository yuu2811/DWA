'use client';

import { useState } from 'react';
import { StoredAssessment, DomainType } from '@/lib/types';

interface TrendChartProps {
  history: StoredAssessment[];
}

const DOMAIN_CONFIG: Record<DomainType, { label: string; color: string }> = {
  sleep: { label: '睡眠', color: '#638cff' },
  stress: { label: 'ストレス', color: '#a78bfa' },
  fatigue: { label: '疲労', color: '#fb7185' },
  diet: { label: '食事', color: '#34d399' },
  exercise: { label: '運動', color: '#fbbf24' },
};

const RISK_ZONES = [
  { label: '良好', yStart: 0, yEnd: 33, color: 'rgba(52,211,153,0.06)' },
  { label: '要改善', yStart: 33, yEnd: 66, color: 'rgba(251,191,36,0.06)' },
  { label: '要対応', yStart: 66, yEnd: 100, color: 'rgba(251,113,133,0.06)' },
];

function normalizeScore(domain: DomainType, score: number, maxScore: number | null): number {
  // Normalize to 0-100 where 100 = worst
  // sleep/stress/fatigue: higher score = worse → direct normalize
  // diet: higher score = better → invert
  // exercise: higher MET = better → invert (capped at 6000 for display)
  if (domain === 'diet') {
    return maxScore ? Math.max(0, 100 - (score / maxScore) * 100) : 50;
  }
  if (domain === 'exercise') {
    return Math.max(0, 100 - Math.min(score / 6000, 1) * 100);
  }
  return maxScore ? (score / maxScore) * 100 : 50;
}

export default function TrendChart({ history }: TrendChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string } | null>(null);
  const [hiddenDomains, setHiddenDomains] = useState<Set<DomainType>>(new Set());

  if (history.length < 2) return null;

  // SVG dimensions
  const W = 600;
  const H = 240;
  const pad = { top: 16, right: 20, bottom: 32, left: 36 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const data = history.slice(-20); // Last 20 assessments
  const xStep = data.length > 1 ? plotW / (data.length - 1) : plotW;

  const toggleDomain = (d: DomainType) => {
    setHiddenDomains((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d); else next.add(d);
      return next;
    });
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">
            スコア推移
          </h3>
          <p className="text-[10px] text-[var(--text-muted)]">
            上部が高リスク・下部が良好（直近{data.length}回）
          </p>
        </div>
        {/* Domain toggles */}
        <div className="flex gap-1.5 flex-wrap justify-end">
          {(Object.keys(DOMAIN_CONFIG) as DomainType[]).map((d) => (
            <button
              key={d}
              onClick={() => toggleDomain(d)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                hiddenDomains.has(d) ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: DOMAIN_CONFIG[d].color }} />
              {DOMAIN_CONFIG[d].label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: '260px' }}>
          {/* Risk zone backgrounds */}
          {RISK_ZONES.map((zone) => (
            <rect
              key={zone.label}
              x={pad.left}
              y={pad.top + (zone.yStart / 100) * plotH}
              width={plotW}
              height={((zone.yEnd - zone.yStart) / 100) * plotH}
              fill={zone.color}
            />
          ))}

          {/* Horizontal gridlines */}
          {[0, 33, 66, 100].map((v) => (
            <line
              key={v}
              x1={pad.left}
              y1={pad.top + (v / 100) * plotH}
              x2={pad.left + plotW}
              y2={pad.top + (v / 100) * plotH}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}

          {/* Y-axis labels */}
          {[
            { v: 0, label: '良好' },
            { v: 50, label: '' },
            { v: 100, label: '高リスク' },
          ].map((item) => (
            <text
              key={item.v}
              x={pad.left - 4}
              y={pad.top + (item.v / 100) * plotH}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-[8px]"
              fill="var(--text-muted)"
            >
              {item.label}
            </text>
          ))}

          {/* X-axis date labels */}
          {data.map((a, i) => {
            const x = pad.left + (data.length === 1 ? plotW / 2 : i * xStep);
            const show = data.length <= 10 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0;
            if (!show) return null;
            return (
              <text
                key={a.id}
                x={x}
                y={H - 4}
                textAnchor="middle"
                className="text-[8px]"
                fill="var(--text-muted)"
              >
                {new Date(a.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
              </text>
            );
          })}

          {/* Domain lines */}
          {(Object.keys(DOMAIN_CONFIG) as DomainType[]).map((domain) => {
            if (hiddenDomains.has(domain)) return null;
            const cfg = DOMAIN_CONFIG[domain];

            const points = data.map((a, i) => {
              const dr = a.result.domains.find((d) => d.domain === domain);
              if (!dr) return null;
              const x = pad.left + (data.length === 1 ? plotW / 2 : i * xStep);
              const norm = normalizeScore(domain, dr.score, dr.maxScore);
              const y = pad.top + (norm / 100) * plotH;
              return { x, y, score: dr.score, unit: dr.scoreUnit, risk: dr.riskLevel };
            }).filter(Boolean) as { x: number; y: number; score: number; unit: string; risk: string }[];

            if (points.length < 2) return null;

            const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('');

            return (
              <g key={domain}>
                <path d={pathD} fill="none" stroke={cfg.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={3}
                    fill={cfg.color}
                    stroke="var(--bg-primary)"
                    strokeWidth={2}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y, label: `${cfg.label}: ${p.score}${p.unit}` })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </g>
            );
          })}

          {/* Tooltip */}
          {hoveredPoint && (
            <g>
              <rect
                x={hoveredPoint.x - 50}
                y={hoveredPoint.y - 24}
                width={100}
                height={18}
                rx={4}
                fill="var(--bg-card)"
                stroke="var(--border-subtle)"
              />
              <text
                x={hoveredPoint.x}
                y={hoveredPoint.y - 12}
                textAnchor="middle"
                className="text-[9px] font-medium"
                fill="var(--text-primary)"
              >
                {hoveredPoint.label}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
