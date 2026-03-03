'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AssessmentResult, StoredAssessment } from '@/lib/types';
import { getAssessmentById, getPreviousAssessment } from '@/lib/storage';
import { generateActionPlan } from '@/lib/scoring/actionPlan';
import ResultsDashboard from '@/components/results/ResultsDashboard';
import PrintReport from '@/components/results/PrintReport';

function ResultsContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('id');

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [previous, setPrevious] = useState<StoredAssessment | null>(null);
  const [currentStored, setCurrentStored] = useState<StoredAssessment | null>(null);

  useEffect(() => {
    if (assessmentId) {
      // Load from localStorage history
      const stored = getAssessmentById(assessmentId);
      if (stored) {
        setResult(stored.result);
        setCurrentStored(stored);
        setPrevious(getPreviousAssessment(assessmentId));
        return;
      }
    }
    // Fallback: load from sessionStorage (anonymous)
    const sessionData = sessionStorage.getItem('dwa-result');
    if (sessionData) {
      setResult(JSON.parse(sessionData));
    }
  }, [assessmentId]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="no-print">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">D</span>
              </div>
              <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                DWA
              </span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)] mb-6">
              評価結果が見つかりません。<br />先に問診を完了してください。
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              問診を開始する
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.02] blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/[0.03] blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="no-print">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">D</span>
              </div>
              <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                DWA
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/history"
                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                履歴
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                印刷
              </button>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                再診断
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Print header */}
            <div className="hidden print:block mb-6">
              <h1 className="text-xl font-bold">
                ドライバー健康診断レポート（DWA）
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                評価日: {result.assessmentDate}
              </p>
              {currentStored?.profile && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {currentStored.profile.name}
                  {currentStored.profile.employeeId && ` (${currentStored.profile.employeeId})`}
                  {currentStored.profile.company && ` / ${currentStored.profile.company}`}
                </p>
              )}
            </div>
            <ResultsDashboard
              result={result}
              previousResult={previous?.result ?? null}
              assessmentId={assessmentId ?? undefined}
            />
            <PrintReport
              result={result}
              stored={currentStored}
              actionPlan={generateActionPlan(result)}
              previousResult={previous?.result ?? null}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
