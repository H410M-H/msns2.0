"use client"

import { useState } from "react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { ClassCreationDialog } from "../forms/class/ClassCreation"

type StepComponent = React.ComponentType<NonNullable<unknown>>

interface Step {
  id: string
  name: string
  component: StepComponent
}


const ClassTable: StepComponent = () => (
  <div className="rounded-md border p-4">
    <ClassCreationDialog />
    {/* Add your ClassTable implementation here */}
  </div>
)

const RegistrationPortal: StepComponent = () => (
  <div className="rounded-md border p-4">
    <h2 className="text-lg font-semibold mb-4">Registration Portal</h2>
    <p>This is where the RegistrationPortal component will be rendered.</p>
    {/* Add your RegistrationPortal implementation here */}
  </div>
)

const steps: Step[] = [
  { id: "Step 1", name: "Classes Creation", component: ClassTable },
  { id: "Step 2", name: "Registration Portal", component: RegistrationPortal },
]

export default function SessionCreationSteps() {
  const [currentStep, setCurrentStep] = useState(0)

  const CurrentStepComponent = steps[currentStep]?.component

  return (
    <div className="w-full px-4 py-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={cn(
                  "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                  index <= currentStep
                    ? "border-blue-600"
                    : "border-gray-200"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    index <= currentStep ? "text-blue-600" : "text-gray-500"
                  )}
                >
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8">
        {CurrentStepComponent ? (
          <CurrentStepComponent />
        ) : (
          <p className="text-red-500">Error: Step component not found</p>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}