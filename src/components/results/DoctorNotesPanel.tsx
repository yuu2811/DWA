'use client';

import { useState, useEffect, useRef } from 'react';
import { saveNotes, saveFollowUpDate, getAssessmentById } from '@/lib/storage';

interface DoctorNotesPanelProps {
  assessmentId?: string;
}

export default function DoctorNotesPanel({ assessmentId }: DoctorNotesPanelProps) {
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!assessmentId) return;
    const stored = getAssessmentById(assessmentId);
    if (stored) {
      setNotes(stored.notes ?? '');
      setFollowUpDate(stored.followUpDate ?? '');
    }
  }, [assessmentId]);

  const triggerSave = (newNotes: string, newDate: string) => {
    if (!assessmentId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveNotes(assessmentId, newNotes);
      saveFollowUpDate(assessmentId, newDate);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    triggerSave(value, followUpDate);
  };

  const handleDateChange = (value: string) => {
    setFollowUpDate(value);
    triggerSave(notes, value);
  };

  if (!assessmentId) return null;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm">産業医所見・メモ</h3>
            <p className="text-[10px] text-[var(--text-muted)]">この評価に対する所見やコメントを記録</p>
          </div>
        </div>
        {saved && (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 animate-fade-up">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            保存済み
          </span>
        )}
      </div>

      <textarea
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        placeholder="所見、コメント、指導内容などを記録..."
        rows={4}
        className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)]/50 resize-y transition-colors"
      />

      <div className="mt-4 flex items-center gap-3">
        <label className="text-[11px] text-[var(--text-muted)] font-medium shrink-0">
          次回フォローアップ日
        </label>
        <input
          type="date"
          value={followUpDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]/50 transition-colors"
        />
      </div>
    </div>
  );
}
