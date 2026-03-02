'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AssessmentResult } from '@/lib/types';
import ResultsDashboard from '@/components/results/ResultsDashboard';

export default function ResultsPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('dwa-result');
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200 no-print">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href="/"
              className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors"
            >
              DWA
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-slate-500 mb-4">
              評価結果が見つかりません。先に問診を完了してください。
            </p>
            <Link
              href="/assessment"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              問診を開始する
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors"
          >
            DWA
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              印刷
            </button>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              再診断
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 印刷用ヘッダー */}
          <div className="hidden print:block mb-6">
            <h1 className="text-xl font-bold">
              ドライバー健康診断レポート（DWA）
            </h1>
            <p className="text-sm text-slate-500">
              評価日: {result.assessmentDate}
            </p>
          </div>
          <ResultsDashboard result={result} />
        </div>
      </main>
    </div>
  );
}
