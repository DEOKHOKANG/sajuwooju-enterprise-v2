"use client";

import { Check } from "lucide-react";
import { FormStep, FORM_STEPS } from "@/lib/saju-input-data";

interface ProgressStepperProps {
  currentStep: FormStep;
  onStepClick?: (step: FormStep) => void;
}

export function ProgressStepper({ currentStep, onStepClick }: ProgressStepperProps) {
  const steps: FormStep[] = [1, 2, 3, 4];

  return (
    <div className="w-full py-8">
      {/* Desktop/Tablet: Horizontal Stepper */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => onStepClick?.(step)}
                disabled={step > currentStep}
                className={`relative flex flex-col items-center cursor-pointer disabled:cursor-not-allowed transition-all ${
                  step <= currentStep ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    step < currentStep
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                      : step === currentStep
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white ring-4 ring-violet-200'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step < currentStep ? <Check className="w-6 h-6" /> : step}
                </div>
                <span
                  className={`mt-2 text-sm font-medium whitespace-nowrap ${
                    step === currentStep
                      ? 'text-violet-600'
                      : step < currentStep
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {FORM_STEPS[step]}
                </span>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4">
                  <div
                    className={`h-full rounded-full transition-all ${
                      step < currentStep
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Simplified Progress Bar */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-600">
            {FORM_STEPS[currentStep]}
          </span>
          <span className="text-sm font-medium text-violet-600">
            {currentStep}/4
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
