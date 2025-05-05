
import React from 'react';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick: (stepIndex: number) => void;
  errors?: Partial<Record<string, string>>;
  tabToStepMap: Record<string, number>;
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps,
  stepLabels,
  onStepClick,
  errors = {},
  tabToStepMap
}) => {
  // Function to check if a step has any errors
  const stepHasErrors = (stepIndex: number): boolean => {
    // Convert step index back to tab name
    const tabNames = Object.keys(tabToStepMap);
    const tabName = tabNames[stepIndex];
    
    // Check if any error keys match the tab's fields
    if (tabName === 'project-info') {
      return Object.keys(errors).some(key => ['name', 'type'].includes(key));
    } else if (tabName === 'location-timeline') {
      return Object.keys(errors).some(key => 
        key.startsWith('location.') || key.startsWith('timeline.')
      );
    } else if (tabName === 'team-requirements') {
      return Object.keys(errors).some(key => 
        key.startsWith('team.') || ['estimatedWindows', 'instructions'].includes(key)
      );
    } else if (tabName === 'attachments-metadata') {
      return Object.keys(errors).some(key => 
        key.startsWith('attachments.') || ['tags', 'priority', 'budgetEstimate'].includes(key)
      );
    }
    
    return false;
  };
  
  return (
    <div className="flex px-6 py-4 border-b border-zinc-800">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center w-full">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <button 
                type="button"
                onClick={() => onStepClick(index)}
                className="group flex flex-col items-center"
              >
                <div className={`
                  flex items-center justify-center h-8 w-8 rounded-full transition-colors
                  ${currentStep === index 
                    ? 'bg-green-500 text-white' 
                    : stepHasErrors(index) 
                      ? 'bg-red-500/70 text-white' 
                      : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                  }
                `}>
                  {index + 1}
                </div>
                <span className={`
                  text-xs mt-2 transition-colors
                  ${currentStep === index 
                    ? 'text-white' 
                    : stepHasErrors(index)
                      ? 'text-red-400'
                      : 'text-zinc-500 group-hover:text-zinc-400'
                  }
                `}>
                  {stepLabels[index]}
                </span>
                {stepHasErrors(index) && currentStep !== index && (
                  <span className="text-xs text-red-400 mt-1">Fix errors</span>
                )}
              </button>
              
              {index < totalSteps - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-2
                  ${index < currentStep ? 'bg-green-500' : 'bg-zinc-800'}
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
