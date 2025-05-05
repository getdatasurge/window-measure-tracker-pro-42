
import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  stepErrors: Record<number, boolean>;
  completedSteps: number[];
  onStepClick?: (stepIndex: number) => void;
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps,
  stepLabels,
  stepErrors,
  completedSteps,
  onStepClick
}) => {
  return (
    <div className="flex px-6 py-4 border-b border-zinc-800">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center w-full">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <button 
                type="button"
                onClick={() => onStepClick && onStepClick(index)}
                className="group flex flex-col items-center"
                disabled={!onStepClick}
              >
                <div className={`
                  flex items-center justify-center h-8 w-8 rounded-full transition-all
                  ${currentStep === index 
                    ? 'bg-green-500 text-white scale-110' 
                    : stepErrors[index]
                      ? 'bg-red-500/70 text-white' 
                      : completedSteps.includes(index)
                        ? 'bg-green-500/70 text-white'
                        : index < currentStep
                          ? 'bg-green-500/50 text-white'
                          : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                  }
                `}>
                  {completedSteps.includes(index) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`
                  text-xs mt-2 transition-colors
                  ${currentStep === index 
                    ? 'text-white' 
                    : stepErrors[index]
                      ? 'text-red-400'
                      : completedSteps.includes(index)
                        ? 'text-green-400'
                        : 'text-zinc-500 group-hover:text-zinc-400'
                  }
                `}>
                  {stepLabels[index]}
                </span>
                {stepErrors[index] && currentStep !== index && (
                  <span className="text-xs text-red-400 mt-1">Fix errors</span>
                )}
              </button>
              
              {index < totalSteps - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-2
                  ${index < currentStep 
                    ? completedSteps.includes(index) 
                      ? 'bg-green-500' 
                      : 'bg-green-500/50'
                    : 'bg-zinc-800'}
                `}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepProgressIndicator;
