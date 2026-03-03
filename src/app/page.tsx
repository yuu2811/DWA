'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DriverProfile, StoredAssessment } from '@/lib/types';
import { getProfile, saveProfile, getLatestAssessment, getHistory } from '@/lib/storage';
import DriverProfileForm from '@/components/profile/DriverProfileForm';

const domains = [
  { icon: '🌙', name: '睡眠', scale: 'ESS', color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20' },
  { icon: '🧠', name: 'ストレス', scale: 'K6', color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20' },
  { icon: '⚡', name: '疲労', scale: '厚労省CL', color: 'from-rose-500/20 to-rose-600/5', border: 'border-rose-500/20' },
  { icon: '🥬', name: '食事', scale: '特定健診', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20' },
  { icon: '🏃', name: '運動', scale: 'IPAQ-SF', color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20' },
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
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="pt-8 pb-4 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">D</span>
              </div>
              <span className="text-sm font-medium text-[var(--text-muted)] tracking-wider uppercase">
                Driver Wellness Assessment
              </span>
            </div>
            {mounted && historyCount > 0 && (
              <Link
                href="/history"
                className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                履歴
              </Link>
            )}
          </div>
        </header>

        <main className="pt-12 sm:pt-20 pb-20">
          {/* Returning user card */}
          {isReturning && !showForm && (
            <div className="glass rounded-2xl p-6 mb-10 animate-fade-up border border-[var(--border-subtle)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] font-medium text-[var(--text-muted)] tracking-wider uppercase mb-1">
                    お帰りなさい
                  </p>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {profile!.name}
                    <span className="text-[var(--text-muted)] font-normal text-sm ml-2">さん</span>
                  </h2>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  情報を編集
                </button>
              </div>

              {latest && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-card)] mb-4">
                  <div className="flex-1">
                    <p className="text-[11px] text-[var(--text-muted)] mb-0.5">前回の診断</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {new Date(latest.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[var(--text-muted)] mb-0.5">総合判定</p>
                    <p className={`text-sm font-bold ${riskLabel[latest.result.overallRisk]?.color}`}>
                      {riskLabel[latest.result.overallRisk]?.text}
                    </p>
                  </div>
                  <Link
                    href={`/results?id=${latest.id}`}
                    className="text-[11px] text-[var(--accent-blue)] hover:underline shrink-0"
                  >
                    結果を見る
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartNew}
                  className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  新しい診断を開始
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                {historyCount > 0 && (
                  <Link
                    href="/history"
                    className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    履歴を見る（{historyCount}件）
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Profile form (shown for new users or when editing) */}
          {showForm && (
            <div className="mb-10 max-w-2xl animate-fade-up">
              <DriverProfileForm
                initial={profile}
                onSubmit={handleProfileSubmit}
                onSkip={() => {
                  // Save minimal profile and start
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

          {/* Hero (shown when not editing profile) */}
          {!showForm && (
            <>
              <div className="max-w-2xl mb-16 animate-fade-up">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                  <span className="gradient-text">ドライバーの</span>
                  <br />
                  健康を、可視化する。
                </h1>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
                  学術的に妥当性が検証された5つの尺度で、産業医・保健師が
                  受診勧奨の根拠を持てる健康スクリーニングを実現します。
                </p>
              </div>

              {/* Domain cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-16 animate-fade-up animate-delay-1">
                {domains.map((d) => (
                  <div
                    key={d.name}
                    className={`glass rounded-2xl p-4 border ${d.border} hover:scale-[1.02] transition-transform`}
                  >
                    <span className="text-2xl block mb-3">{d.icon}</span>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{d.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{d.scale}</p>
                  </div>
                ))}
              </div>

              {/* CTA area - for new users only */}
              {!isReturning && (
                <div className="animate-fade-up animate-delay-2">
                  <button
                    onClick={handleStartNew}
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                  >
                    診断を開始する
                    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-6 mt-6 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      約10〜15分
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      データはブラウザ内で完結
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      結果を印刷可能
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="pb-8 animate-fade-up animate-delay-3">
          <div className="border-t border-[var(--border-subtle)] pt-6">
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-2xl">
              本ツールは健康スクリーニングを目的としたものであり、医学的診断を行うものではありません。
              結果に基づく判断は必ず産業医等の医療専門職が行ってください。
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
