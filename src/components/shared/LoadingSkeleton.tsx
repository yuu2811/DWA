'use client';

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse" aria-busy="true" aria-label="読み込み中">
      <div className="h-3 w-24 bg-[var(--bg-card)] rounded mb-4" />
      <div className="h-5 w-48 bg-[var(--bg-card)] rounded mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-[var(--bg-card)] rounded mb-2" style={{ width: `${85 - i * 10}%` }} />
      ))}
    </div>
  );
}

export function ResultsLoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="結果を読み込み中">
      {/* Key findings skeleton */}
      <CardSkeleton lines={2} />

      {/* Overall + Radar grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton lines={4} />
        <div className="glass rounded-2xl p-6 animate-pulse flex items-center justify-center" style={{ minHeight: '280px' }}>
          <div className="w-48 h-48 rounded-full bg-[var(--bg-card)]" />
        </div>
      </div>

      {/* Domain cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <CardSkeleton key={i} lines={3} />
        ))}
      </div>
    </div>
  );
}
