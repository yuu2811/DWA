'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { DriverProfile } from '@/lib/types';
import {
  getProfile,
  saveProfile,
  getHistory,
  exportHistoryJSON,
  importData,
  clearAllData,
} from '@/lib/storage';

export default function SettingsPage() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(getProfile());
    setHistoryCount(getHistory().length);
    setMounted(true);
  }, []);

  const handleProfileSave = () => {
    if (!profile) return;
    saveProfile(profile);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleExport = () => {
    const json = exportHistoryJSON();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dwa-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importData(reader.result as string);
      if (result.success) {
        setImportResult({ success: true, message: `${result.count}件のデータをインポートしました` });
        setHistoryCount(getHistory().length);
        setProfile(getProfile());
      } else {
        setImportResult({ success: false, message: 'インポートに失敗しました。ファイル形式を確認してください。' });
      }
      setTimeout(() => setImportResult(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    clearAllData();
    setProfile(null);
    setHistoryCount(0);
    setShowClearConfirm(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
        <main className="pt-8 pb-20">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">設定</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5">
              プロフィール編集・データ管理
            </p>
          </div>

          {/* Profile section */}
          <section className="glass rounded-2xl p-6 mb-6 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                プロフィール
              </h2>
              {profileSaved && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 animate-fade-up">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  保存済み
                </span>
              )}
            </div>

            {profile ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">氏名</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">社員番号</label>
                    <input
                      type="text"
                      value={profile.employeeId}
                      onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                      className="w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">所属</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">年齢</label>
                    <input
                      type="number"
                      value={profile.age ?? ''}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]/50"
                    />
                  </div>
                </div>
                <button
                  onClick={handleProfileSave}
                  className="mt-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  保存
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-[var(--text-secondary)] mb-3">プロフィールが未登録です</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-xl"
                >
                  ホームで登録する
                </Link>
              </div>
            )}
          </section>

          {/* Data management */}
          <section className="glass rounded-2xl p-6 mb-6 animate-fade-up animate-delay-1">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 mb-5">
              <svg className="w-4 h-4 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              データ管理
            </h2>

            <div className="space-y-4">
              {/* Stats */}
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-card)] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[var(--accent-blue)]">{historyCount}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">保存済み診断データ</p>
                  <p className="text-[10px] text-[var(--text-muted)]">ブラウザのローカルストレージに保存</p>
                </div>
              </div>

              {/* Export */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExport}
                  disabled={historyCount === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  バックアップ出力
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  データ復元
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </div>

              {/* Import result message */}
              {importResult && (
                <div
                  className={`p-3 rounded-xl text-sm animate-fade-up ${
                    importResult.success
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {importResult.message}
                </div>
              )}

              {/* Clear all */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    すべてのデータを削除
                  </button>
                ) : (
                  <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5">
                    <p className="text-sm font-bold text-rose-400 mb-2">本当に削除しますか？</p>
                    <p className="text-[11px] text-[var(--text-secondary)] mb-3">
                      プロフィール、診断履歴、下書きなどすべてのデータが完全に削除されます。この操作は取り消せません。
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-xl transition-colors"
                      >
                        削除する
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-4 py-2 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* App info */}
          <section className="glass-light rounded-2xl p-5 animate-fade-up animate-delay-2">
            <h2 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-3">
              アプリ情報
            </h2>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>アプリ名</span>
                <span className="text-[var(--text-primary)] font-medium">DWA - Driver Wellness Assessment</span>
              </div>
              <div className="flex justify-between">
                <span>データ保存</span>
                <span>ブラウザ内（localStorage）</span>
              </div>
              <div className="flex justify-between">
                <span>通信</span>
                <span>なし（完全オフライン対応）</span>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-[var(--text-muted)] leading-relaxed">
              本ツールは健康スクリーニングを目的としています。
              データはすべてお使いのブラウザ内に保存され、外部サーバーには送信されません。
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
