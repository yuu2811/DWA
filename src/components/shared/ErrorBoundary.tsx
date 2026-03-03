'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="glass rounded-2xl p-6 text-center" role="alert">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-[var(--text-primary)] font-bold mb-2">エラーが発生しました</p>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            予期しないエラーが発生しました。ページを再読み込みしてください。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium rounded-xl transition-all"
          >
            再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
