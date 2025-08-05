'use client'

import { useFindSubscriptionQuery } from "@/redux/api/subscription/userSubscriptionApi"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSelector } from "react-redux"



export default function OnboardingLayout({children}:{children:React.ReactNode}){

  const {id} = useSelector((state:RootState) => state.user)
  const {data,isLoading,isFetching} = useFindSubscriptionQuery({userId:id})
  const router = useRouter()

  useEffect(() => {

    if(!isLoading){
      const status = data?.data?.subscriptionStatus || null
      switch (status){
        case 'incomplete':
          router.push('/subscription/retry')
          break;
          case 'active':
            router.push('/workspace')
            break;
            default:
              router.push('/onboarding')
            }
    }
  },[isLoading])

  if(isLoading && isFetching && !data){
    return null
  }

    return (
       <>
         {children} 
       </>
    )
}