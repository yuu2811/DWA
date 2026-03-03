'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DriverProfile, StoredAssessment } from '@/lib/types';
import { getProfile, saveProfile, getLatestAssessment, getHistory } from '@/lib/storage';
import DriverProfileForm from '@/components/profile/DriverProfileForm';

const domains = [
  { icon: '🌙', name: '睡眠', scale: 'ESS', color: '#638cff', border: 'border-blue-500/20' },
  { icon: '🧠', name: 'ストレス', scale: 'K6', color: '#a78bfa', border: 'border-purple-500/20' },
  { icon: '⚡', name: '疲労', scale: '厚労省CL', color: '#fb7185', border: 'border-rose-500/20' },
  { icon: '🥬', name: '食事', scale: '特定健診', color: '#34d399', border: 'border-emerald-500/20' },
  { icon: '🏃', name: '運動', scale: 'IPAQ-SF', color: '#fbbf24', border: 'border-amber-500/20' },
];

const riskLabel: Record<string, { text: string; color: string }> = {
  low: { text: '良好', color: 'text-emerald-400' },
  moderate: { text: '要改善', color: 'text-amber-400' },
  high: { text: '要対応', color: 'text-rose-400' },
};

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [latest, setLatest] = useState<StoredAssessment | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setLatest(getLatestAssessment());
    setHistoryCount(getHistory().length);
    setMounted(true);
  }, []);

  const handleProfileSubmit = (p: DriverProfile) => {
    saveProfile(p);
    setProfile(p);
    router.push('/assessment');
  };

  const handleStartNew = () => {
    if (!profile) {
      setShowForm(true);
    } else {
      router.push('/assessment');
    }
  };

  const isReturning = mounted && profile !== null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-60"
          style={{
            top: '-15%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(99,140,255,0.06) 0%, transparent 70%)',
            animation: 'orb-drift-1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            bottom: '-15%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
            animation: 'orb-drift-2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-40"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)',
            animation: 'orb-drift-1 30s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <main className="pt-8 sm:pt-16 pb-20">
          {/* Returning user card */}
          {isReturning && !showForm && (
            <div className="glass-elevated rounded-2xl p-6 sm:p-8 mb-12 animate-fade-up card-hover">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[11px] font-medium text-[var(--accent-blue)] tracking-wider uppercase mb-1.5">
                    お帰りなさい
                  </p>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {profile!.name}
                    <span className="text-[var(--text-muted)] font-normal text-sm ml-2">さん</span>
                  </h2>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  編集
                </button>
              </div>

              {latest && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] mb-5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">前回の診断</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {new Date(latest.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">総合判定</p>
                    <p className={`text-sm font-bold ${riskLabel[latest.result.overallRisk]?.color}`}>
                      {riskLabel[latest.result.overallRisk]?.text}
                    </p>
                  </div>
                  <Link
                    href={`/results?id=${latest.id}`}
                    className="shrink-0 w-8 h-8 rounded-lg bg-[var(--accent-blue)]/10 flex items-center justify-center text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartNew}
                  className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98]"
                >
                  新しい診断を開始
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                {historyCount > 0 && (
                  <Link
                    href="/history"
                    className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all hover:bg-[var(--bg-card-hover)]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    履歴（{historyCount}件）
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Profile form */}
          {showForm && (
            <div className="mb-10 max-w-2xl animate-fade-up">
              <DriverProfileForm
                initial={profile}
                onSubmit={handleProfileSubmit}
                onSkip={() => {
                  const minimal: DriverProfile = {
                    employeeId: '',
                    name: '未入力',
                    age: null,
                    vehicleType: 'truck',
                    yearsOfService: null,
                    company: '',
                  };
                  saveProfile(minimal);
                  setProfile(minimal);
                  router.push('/assessment');
                }}
              />
            </div>
          )}

          {/* Hero */}
          {!showForm && (
            <>
              <div className="max-w-2xl mb-16 animate-fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-[11px] text-[var(--accent-blue)] font-medium mb-6 animate-glow-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
                  産業医・保健師向け健康スクリーニング
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-6">
                  <span className="gradient-text">ドライバーの</span>
                  <br />
                  <span className="text-[var(--text-primary)]">健康を、可視化する。</span>
                </h1>
                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  学術的に妥当性が検証された<span className="text-[var(--text-primary)] font-medium">5つの尺度</span>で、産業医・保健師が
                  受診勧奨の根拠を持てる健康スクリーニングを実現します。
                </p>
              </div>

              {/* Domain cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-16">
                {domains.map((d, i) => (
                  <div
                    key={d.name}
                    className={`glass rounded-2xl p-4 sm:p-5 border ${d.border} card-hover animate-fade-up`}
                    style={{
                      animationDelay: `${0.1 + i * 0.08}s`,
                      animation: `fade-up 0.6s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.08}s both, float-slow 6s ease-in-out ${i * 0.8}s infinite`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                      style={{ background: `${d.color}10` }}
                    >
                      {d.icon}
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)] mb-0.5">{d.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)] font-medium tracking-wide">{d.scale}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {!isReturning && (
                <div className="animate-fade-up animate-delay-4">
                  <button
                    onClick={handleStartNew}
                    className="group relative inline-flex items-center gap-3 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" style={{ backgroundSize: '200% 200%', animation: 'gradient-shift 4s ease infinite' }} />
                    <span className="relative flex items-center gap-3">
                      診断を開始する
                      <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>

                  <div className="flex items-center gap-6 mt-8 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      約10〜15分
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      データはブラウザ内で完結
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </div>
                      結果を印刷可能
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="pb-8 animate-fade-up animate-delay-5">
          <div className="section-divider mb-6" />
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-2xl">
            本ツールは健康スクリーニングを目的としたものであり、医学的診断を行うものではありません。
            結果に基づく判断は必ず産業医等の医療専門職が行ってください。
          </p>
        </footer>
      </div>
    </div>
  );
}
