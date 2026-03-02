'use client';

const steps = [
  { label: '睡眠', icon: '🌙' },
  { label: 'ストレス', icon: '🧠' },
  { label: '食事', icon: '🥗' },
  { label: '運動', icon: '🏃' },
];

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-colors ${
                  index < currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : index === currentStep
                      ? 'bg-white border-blue-600 text-blue-600'
                      : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm">{step.icon}</span>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  index <= currentStep ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 -mt-5 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
