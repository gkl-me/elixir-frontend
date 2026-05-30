"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Loader2, ArrowRight, RefreshCcw, LayoutDashboard, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { retryPaymentAction, verifyPaymentAction } from "@/app/actions/payment.action"
import { USER_CLIENT_ROUTES } from "@/constants/clientRoutes"
import { toastHandler } from "@/lib/toastHandler"
import { changePlanAction, completeOnboadringPaymentAction } from "@/app/actions/onboarding.action"

type PaymentStatus = "pending" | "success" | "failed" | "incomplete"

export default function PaymentVerifyPage() {
  const [status, setStatus] = useState<PaymentStatus>("pending")
  const [message, setMessage] = useState("Verifying your payment...")
  const router = useRouter()

  const handleVerify = useCallback(async () => {
      setStatus("pending")
      const res = await verifyPaymentAction()

      // console.log(res)
      
      if (res.success) {
        const paymentData = res.data  
        if (paymentData.paymentStatus === "success") {
          setStatus("success")
          setMessage(res.message)
          setTimeout(() => {
            router.push(USER_CLIENT_ROUTES.WORKSPACE)
          }, 2000)
        } else if (paymentData.paymentStatus === "incomplete") {
          setStatus("incomplete")
          setMessage(res.message)
        } else if (paymentData.paymentStatus === "pending") {
            setStatus("pending")
            setMessage(res.message)
            setTimeout(handleVerify, 5000)
        } else {
          setStatus("failed")
          setMessage(res.data.message || "Payment verification failed.")
        }
      } else {
        setStatus("failed")
        setMessage(res.error)
      }
  },[router])


  const handleRetry = async () => {
      setStatus("pending")
      setMessage("Initiating retry...")
      const res = await retryPaymentAction()
      router.push(res.data.payment_url)
      if (res && !res.success) {
        setStatus("failed")
        setMessage(res.error)
        toastHandler(res)
      }
  }


  const handleChangePlan = async () => {
        setStatus("pending")
        setMessage("Redirecting to onboarding...")
        await changePlanAction()
  }

  const handleCompletePayment = async () =>{
      setStatus("pending")
      setMessage("Completing payment")
      const res = await completeOnboadringPaymentAction()
      router.push(res.data.payment_url)
      if (res && !res.success) {
        setStatus("failed")
        setMessage(res.error)
        toastHandler(res)
      }
  }

  
  useEffect(() => {
    handleVerify()
  },[handleVerify])

  return (
    <div className="min-h-screen bg-navyDark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {status === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-navy border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-purple/20 blur-3xl rounded-full" />
                <Loader2 className="w-16 h-16 text-purple animate-spin mx-auto relative" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Verifying Payment</h2>
                <p className="text-gray-400">{message}</p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Payment Confirmed!</h2>
                <p className="text-gray-400">{message}</p>
              </div>
              <button
                onClick={() => router.push(USER_CLIENT_ROUTES.WORKSPACE)}
                className="w-full py-4 bg-purple hover:bg-purpleDark text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <LayoutDashboard className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {status === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Payment Failed</h2>
                <p className="text-gray-400">{message}</p>
              </div>
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleRetry}
                  className="w-full py-4 bg-purple hover:bg-purpleDark text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Retry Payment
                </button>
                <button
                  onClick={handleChangePlan}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-semibold transition-all border border-white/10"
                >
                  Change Plan
                </button>
              </div>
            </motion.div>
          )}

          {status === "incomplete" && (
            <motion.div
              key="incomplete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-navy border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-12 h-12 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Action Required</h2>
                <p className="text-gray-400">{message}</p>
              </div>
              <div className="space-y-3 pt-4">

                 <button
                  onClick={handleCompletePayment}
                  className="w-full py-4 bg-purple hover:bg-purpleDark text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group"
                >
                <CreditCard className="w-5 h-5" />
                Complete Payment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleChangePlan}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-semibold transition-all border border-white/10"
                >
                  Change Plan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Having trouble? <span className="text-purple cursor-pointer hover:underline">Contact Support</span>
        </p>
      </div>
    </div>
  )
}
