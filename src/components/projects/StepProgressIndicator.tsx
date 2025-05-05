
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick: (step: number) => void;
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="p-4 border-b border-zinc-800 bg-zinc-900/90">
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, index) => (
          <button
            key={index}
            className={`text-xs font-medium ${
              index === currentStep 
                ? "text-green-500" 
                : index < currentStep 
                  ? "text-zinc-400"
                  : "text-zinc-600"
            } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded px-1`}
            onClick={() => {
              // Allow navigation to completed or current steps
              if (index <= currentStep) {
                onStepClick(index);
              }
            }}
            aria-current={index === currentStep ? "step" : undefined}
            disabled={index > currentStep}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="inline sm:hidden">{index + 1}</span>
          </button>
        ))}
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-1 bg-zinc-800" 
        style={{ "--progress-indicator-color": "rgb(34 197 94)" } as React.CSSProperties}
      />
    </div>
  );
};

export default StepProgressIndicator;
