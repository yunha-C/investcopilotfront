import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  // Calculate progress to align with center of step labels
  // Each step takes up 1/(totalSteps) of the width
  // Progress should reach the center of the current step
  const stepWidth = 100 / totalSteps;
  const progressPercentage = (currentStep * stepWidth) + (stepWidth / 2);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="relative mb-3">
        <div className="w-full h-2 bg-neutral-300 dark:bg-gray-600 rounded-full">
          <div 
            className="h-2 bg-neutral-900 dark:bg-neutral-700 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Step Labels - Only show up to current step */}
      <div className="flex">
        {stepLabels.map((label, index) => (
          <div key={index} className="text-center flex-1">
            <span 
              className={`text-body-small transition-colors ${
                index <= currentStep 
                  ? 'text-neutral-900 dark:text-dark-text-primary font-medium' 
                  : 'text-transparent'
              }`}
            >
              {index <= currentStep ? label : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};