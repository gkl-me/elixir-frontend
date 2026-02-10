"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import Step1Plan from "./steps/Step1Plan"
import Step2Details from "./steps/Step2Details"
import Step3Payment from "./steps/Step3Payment"
import { OnboardingState } from "@/types/IOnboardingTypes"

const demoData: OnboardingState = {
  currentStep: 1,
  isCompleted: false,
  paymentStatus: "pending",
  data: {
    planName: "Free",
    workspaceName: "",
    companyName: "",
    companySize: "",
    role: "",
    paymentMethod: "",
  },
}

export default function OnboardingWizard() {

  // Start directly from demo data
  const [state, setState] = useState<OnboardingState>(demoData)
  const [loading] = useState(false)

  /**
   * NEXT STEP
   * Updates local demo state instead of calling service
   */
  const handleNext = (data: Partial<OnboardingState["data"]>) => {
    setState((prev) => {
      const nextStep = Math.min(prev.currentStep + 1, 3)

      return {
        ...prev,
        currentStep: nextStep,
        data: { ...prev.data, ...data },
      }
    })
  }

  /**
   * BACK STEP
   */
  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }))
  }

  /**
   * COMPLETE ONBOARDING
   */
  const handleComplete = () => {
    setState((prev) => ({
      ...prev,
      isCompleted: true,
      paymentStatus: "completed",
    }))
  }

  /**
   * LOADING UI
   */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-purple animate-spin" />
      </div>
    )
  }

  /**
   * PROGRESS CALCULATION
   */
  const progress = ((state.currentStep - 0.5) / 2.5) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12 relative">
        <div className="h-1 bg-navy/50 border border-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple to-pink-500 box-shadow-glow"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="flex justify-between mt-4 text-sm font-medium">
          <div className={state.currentStep >= 1 ? "text-white" : "text-gray-600"}>
            <span className="block text-xs text-gray-500 mb-1">STEP 1</span>
            Select Plan
          </div>

          <div
            className={`text-center ${
              state.currentStep >= 2 ? "text-white" : "text-gray-600"
            }`}
          >
            <span className="block text-xs text-gray-500 mb-1">STEP 2</span>
            Details
          </div>

          <div
            className={`text-right ${
              state.currentStep >= 3 ? "text-white" : "text-gray-600"
            }`}
          >
            <span className="block text-xs text-gray-500 mb-1">STEP 3</span>
            Payment
          </div>
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {state.currentStep === 1 && (
            <Step1Plan onNext={handleNext} initialData={state.data} />
          )}

          {state.currentStep === 2 && (
            <Step2Details onNext={handleNext} onBack={handleBack} data={state.data} />
          )}

          {state.currentStep === 3 && (
            <Step3Payment onComplete={handleComplete} onBack={handleBack} data={state.data} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
