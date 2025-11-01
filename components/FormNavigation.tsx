"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  stepLabels: string[];
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  stepLabels
}: FormNavigationProps) {
  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${
              index < stepLabels.length - 1 ? "relative" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentStep
                    ? "bg-blue-600 text-white"
                    : index < currentStep
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 ${
                index === currentStep ? "text-blue-600 font-medium" : "text-gray-500"
              }`}>
                {label}
              </span>
            </div>
            {index < stepLabels.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 ${
                  index < currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
                style={{ zIndex: -1 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={currentStep === totalSteps - 1}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
