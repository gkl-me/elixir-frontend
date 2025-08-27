'use client'

import { useFindSubscriptionQuery } from "@/redux/api/subscription/userSubscriptionApi"
import { RootState } from "@/redux/store"
import { CreditCard, ExternalLink, XCircle } from "lucide-react"
import { useSelector } from "react-redux"

export default function RetryCheck(){

    const {id} = useSelector((state:RootState) => state.user)
    const {data,isLoading,isFetching} = useFindSubscriptionQuery({userId:id})



    if(isLoading && isFetching && !data){
        return null
    }

    return  (
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
        
        {data.data.invoiceUrl && (
            <a
            href={data.data.invoiceUrl}
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
}