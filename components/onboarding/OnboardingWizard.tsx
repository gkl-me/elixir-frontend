"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import Step1Plan from "./steps/Step1Plan"
import Step2Details from "./steps/Step2Details"
import Step3Payment from "./steps/Step3Payment"
import { IOnboardingState } from "@/types/IOnboardingTypes"
import { useApi } from "@/hooks/useApi"
import { completeOnboardingAction, saveOnboardingStepAction } from "@/app/actions/onboarding.action"
import { useRouter } from "next/navigation"


export default function OnboardingWizard() {

  // Start directly from demo data
  const [state, setState] = useState<IOnboardingState>(null)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const { execute, isLoading } = useApi({
    url: '/api/onboarding',
    method: "GET"
  })

  useEffect(() => {
    console.log("rendering")
    fetchOnboarding()
  }, [])

  const findProgress = (step) => {
    return ((step - 0.5) / 2.5) * 100
  }

  const fetchOnboarding = async () => {
    const res = await execute()
    console.log("res rendered", res)
    setState(res.data.onboarding)
    const prog = findProgress(res.data.onboarding.currentStep)
    setProgress(prog)
  }

  //on next calls the server action 
  const handleNext = async (data: Partial<IOnboardingState>) => {
    //call the server action here 
    console.log(data)
    const res = await saveOnboardingStepAction({ ...data, currentStep: state.currentStep + 1 })
    setState(res.data)
    const prog = findProgress(state.currentStep)
    setProgress(prog)

  }

  //go back function
  const handleBack = async () => {
    const res = await saveOnboardingStepAction({ currentStep: state.currentStep - 1 })
    setState(res.data)
    const prog = findProgress(state.currentStep - 1)
    setProgress(prog)
  }


  //on complete function
  const handleComplete = async () => {
    const res = await completeOnboardingAction()
    if (res.success) {
      console.log(res)
      router.push(res.data.payment_url)
    }
  }


  if (isLoading || !state) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-purple animate-spin" />
      </div>
    )
  }

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
            className={`text-center ${state.currentStep >= 2 ? "text-white" : "text-gray-600"
              }`}
          >
            <span className="block text-xs text-gray-500 mb-1">STEP 2</span>
            Details
          </div>

          <div
            className={`text-right ${state.currentStep >= 3 ? "text-white" : "text-gray-600"
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
            <Step1Plan onNext={handleNext} initialData={state} />
          )}

          {state.currentStep === 2 && (
            <Step2Details onNext={handleNext} onBack={handleBack} data={state} />
          )}

          {state.currentStep === 3 && (
            <Step3Payment onComplete={handleComplete} onBack={handleBack} data={state} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
