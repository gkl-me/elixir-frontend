"use client"

import { useState } from "react"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import { OnboardingData } from "@/types/IOnboardingTypes"

interface Step3PaymentProps {
  onComplete: () => void
  onBack: () => void
  data: OnboardingData
}

export default function Step3Payment({ onComplete, onBack, data }: Step3PaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = () => {
    setIsProcessing(true)
    onComplete()
  }

  const isFree = data.planName === 'Free'

  return (
    <div className="max-w-xl mx-auto">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Review & Pay</h2>
              <p className="text-gray-400">Finalize your subscription to get started.</p>
           </div>

           {/* Summary Card */}
           <div className="bg-navy border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-white/5 p-6 border-b border-white/10">
                 <h3 className="text-lg font-semibold text-white">Order Summary</h3>
              </div>
              <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Plan</span>
                      <span className="text-purple font-bold uppercase tracking-wider">{data.planName}</span>
                  </div>
                  {data.planName === 'Enterprice' ? (
                     <>
                        <div className="flex justify-between items-center text-sm">
                             <span className="text-gray-400">Company</span>
                             <span className="text-white font-medium">{data.companyName} ({data.companySize})</span>
                        </div>
                     </>
                  ) : (
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-gray-400">Workspace</span>
                         <span className="text-white font-medium">{data.workspaceName}</span>
                    </div>
                  )}
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Total due today</span>
                      <div className="text-right">
                          <span className="block text-2xl font-bold text-white">
                             {data.planName === 'Free' ? "$0" : data.planName === 'Pro' ? "$29" : "$99"}
                          </span>
                          <span className="text-xs text-gray-500">/month</span>
                      </div>
                  </div>
              </div>
           </div>

           {/* Payment Action */}
           <div className="space-y-4">
                 {/* Redirect Notice */}
                 {!isFree && (
                     <div className="bg-purple/10 border border-purple/20 rounded-xl p-4 flex items-start gap-4">
                         <div className="p-2 bg-purple/20 rounded-lg">
                             <CreditCard className="w-5 h-5 text-purple" />
                         </div>
                         <div>
                             <h4 className="text-white font-medium text-sm">Secure Checkout via Stripe</h4>
                             <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                 By clicking &quot;Confirm Payment&quot;, you will be redirected to Stripe&apos;s hosted checkout page to complete your purchase securely.
                             </p>
                         </div>
                     </div>
                 )}

                 <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-purple hover:bg-purpleDark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple/20 hover:shadow-purple/40 hover:scale-[1.02] flex items-center justify-center gap-2 group"
                 >
                    {isProcessing ? (
                         <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                         </>
                    ) : (
                         <>
                            <span>{isFree ? "Complete Setup" : "Confirm Payment"}</span>
                            <Lock className="w-4 h-4 ml-1 group-hover:text-purple-200 transition-colors" />
                         </>
                    )}
                 </button>
                 
                 <button 
                    onClick={onBack} 
                    className="w-full text-gray-500 hover:text-white flex items-center justify-center gap-2 text-sm transition-colors py-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Details
                </button>
           </div>

        </div>
    </div>
  )
}
