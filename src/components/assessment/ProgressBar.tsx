'use client';

const steps = [
  { label: '睡眠', icon: '🌙' },
  { label: 'ストレス', icon: '🧠' },
  { label: '疲労', icon: '⚡' },
  { label: '食事', icon: '🥬' },
  { label: '運動', icon: '🏃' },
];

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-10">
      {/* Track */}
      <div className="progress-track rounded-full mb-5">
        <div
          className="progress-track-fill rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={step.label} className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all duration-300
                  ${isComplete
                    ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] scale-90'
                    : isCurrent
                      ? 'glass glow-blue scale-105'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                  }
                `}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isCurrent
                    ? 'text-[var(--text-primary)]'
                    : isComplete
                      ? 'text-[var(--accent-blue)]'
                      : 'text-[var(--text-muted)]'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
