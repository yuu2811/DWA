'use client';

import Link from 'next/link';
import QuestionnaireWizard from '@/components/assessment/QuestionnaireWizard';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen">
      <header className="no-print">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">D</span>
            </div>
            <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
              DWA
            </span>
          </Link>
          <span className="text-[11px] text-[var(--text-muted)] tracking-wider uppercase">
            問診票
          </span>
        </div>
      </header>

      <main className="px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <ErrorBoundary>
            <QuestionnaireWizard />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
