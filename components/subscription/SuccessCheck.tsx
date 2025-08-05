'use client'

import { useFindSubscriptionQuery } from "@/redux/api/subscription/userSubscriptionApi"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { CheckCircle, XCircle, ExternalLink, Loader2, CreditCard } from "lucide-react"

export default function SuccessCheck() {
  const { id } = useSelector((state: RootState) => state.user)
  const {
    refetch,
  } = useFindSubscriptionQuery({ userId: id })

  const [status, setStatus] = useState<string | null>(null)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!id) return

    // Start polling manually
    intervalRef.current = setInterval(async () => {
      const result = await refetch()
      const subscription = result.data.data

      if (subscription?.subscriptionStatus === 'active') {
        setStatus('active')
        clearInterval(intervalRef.current!)
        // Add small delay for better UX
        setTimeout(() => {
          router.push('/workspace')
        }, 3000)
      }

      if (subscription?.subscriptionStatus === 'incomplete') {
        setStatus('incomplete')
        setInvoiceUrl(subscription.invoiceUrl)

        // clearInterval(intervalRef.current!)
      }

    }, 3000)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [id, refetch, router])

  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-navy border border-purple/30 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">
          Processing Your Payment
        </h1>
        
        <p className="mb-6">
          Please wait while we confirm your subscription. This usually takes a few moments.
        </p>
      </div>
    </div>
  )

  const SuccessState = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-navy border border-purple/30 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="w-16 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">
          Payment Successful! 🎉
        </h1>
        
        <p className=" mb-6">
          Your subscription is now active. Redirecting you to your workspace...
        </p>
        
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4 mr-2" />
          Subscription Active
        </div>
      </div>
    </div>
  )

  const FailureState = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-navy border border-purple/30 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">
          Payment Failed
        </h1>
        
        <p className="mb-6">
          There was an issue with your payment. Please retry to complete your subscription.
        </p>
        
        {invoiceUrl && (
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 mb-4"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Retry Payment
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        )}
      </div>
    </div>
  )


  // Render states
  if (status === 'active') return <SuccessState />
  if (status === 'incomplete') return <FailureState />

  return <LoadingState />
}