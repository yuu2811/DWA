'use client';

const steps = [
  { label: '睡眠', icon: '🌙', color: '#638cff' },
  { label: 'ストレス', icon: '🧠', color: '#a78bfa' },
  { label: '疲労', icon: '⚡', color: '#fb7185' },
  { label: '食事', icon: '🥬', color: '#34d399' },
  { label: '運動', icon: '🏃', color: '#fbbf24' },
];

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-10" role="navigation" aria-label="問診の進捗">
      {/* Track */}
      <div className="progress-track rounded-full mb-6">
        <div
          className="progress-track-fill rounded-full"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`ステップ ${currentStep + 1} / ${steps.length}: ${steps[currentStep].label}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={step.label} className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center text-sm transition-all duration-500
                  ${isComplete
                    ? 'scale-90'
                    : isCurrent
                      ? 'glass scale-110'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                  }
                `}
                style={
                  isComplete
                    ? { background: `${step.color}20`, color: step.color }
                    : isCurrent
                      ? { boxShadow: `0 0 24px ${step.color}30, 0 0 48px ${step.color}10, inset 0 1px 0 rgba(255,255,255,0.05)` }
                      : undefined
                }
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={isCurrent ? 'animate-float' : ''}>{step.icon}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold transition-all duration-300 ${
                  isCurrent
                    ? 'text-[var(--text-primary)]'
                    : isComplete
                      ? ''
                      : 'text-[var(--text-muted)]'
                }`}
                style={isComplete ? { color: step.color } : undefined}
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
