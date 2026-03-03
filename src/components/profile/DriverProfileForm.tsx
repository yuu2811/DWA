'use client';

import { useState } from 'react';
import { DriverProfile, VehicleType } from '@/lib/types';

interface DriverProfileFormProps {
  initial?: DriverProfile | null;
  onSubmit: (profile: DriverProfile) => void;
  onSkip?: () => void;
}

const vehicleOptions: { value: VehicleType; label: string }[] = [
  { value: 'truck', label: 'トラック' },
  { value: 'bus', label: 'バス' },
  { value: 'taxi', label: 'タクシー' },
  { value: 'other', label: 'その他' },
];

export default function DriverProfileForm({ initial, onSubmit, onSkip }: DriverProfileFormProps) {
  const [form, setForm] = useState<DriverProfile>({
    employeeId: initial?.employeeId ?? '',
    name: initial?.name ?? '',
    age: initial?.age ?? null,
    vehicleType: initial?.vehicleType ?? 'truck',
    yearsOfService: initial?.yearsOfService ?? null,
    company: initial?.company ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const canSubmit = form.name.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 animate-scale-in">
      <div className="mb-6">
        <p className="text-[11px] font-medium text-[var(--text-muted)] tracking-wider uppercase mb-1.5">
          基本情報
        </p>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          ドライバー情報の入力
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          結果レポートと履歴管理に使用します。氏名のみ必須です。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name (required) */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
            氏名 <span className="text-[var(--accent-rose)]">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="山田 太郎"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          />
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
            社員番号
          </label>
          <input
            type="text"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            placeholder="例: D-12345"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
            所属事業者
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="例: 〇〇運輸株式会社"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          />
        </div>

        {/* Vehicle type */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
            車種
          </label>
          <div className="flex gap-2 flex-wrap">
            {vehicleOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, vehicleType: opt.value })}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  form.vehicleType === opt.value
                    ? 'bg-[var(--accent-blue)]/12 border-[var(--accent-blue)] text-[var(--accent-blue)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
            年齢
          </label>
          <input
            type="number"
            value={form.age ?? ''}
            onChange={(e) => setForm({ ...form, age: e.target.value ? parseInt(e.target.value, 10) : null })}
            placeholder="例: 45"
            min={18}
            max={99}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          />
        </div>

        {/* Years of service */}
        <div>
          <label className="block text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
            勤続年数
          </label>
          <input
            type="number"
            value={form.yearsOfService ?? ''}
            onChange={(e) => setForm({ ...form, yearsOfService: e.target.value ? parseInt(e.target.value, 10) : null })}
            placeholder="例: 10"
            min={0}
            max={60}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border-subtle)]">
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            スキップ
          </button>
        ) : (
          <div />
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`group flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all ${
            canSubmit
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/20'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] cursor-not-allowed'
          }`}
        >
          {initial ? '更新して診断開始' : '診断を開始する'}
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
