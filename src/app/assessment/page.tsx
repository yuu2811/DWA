'use client';

import Link from 'next/link';
import QuestionnaireWizard from '@/components/assessment/QuestionnaireWizard';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors">
            DWA
          </Link>
          <span className="text-sm text-slate-500">問診票</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <QuestionnaireWizard />
        </div>
      </main>
    </div>
  );
}
