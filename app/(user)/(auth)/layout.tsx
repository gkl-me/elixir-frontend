'use client'

import { useAuth } from "@/hooks/auth/useAuth"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useFindSubscriptionQuery } from "@/redux/api/subscription/userSubscriptionApi"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"



export default function Layout({children}:{children:React.ReactNode}){

  const {id} = useSelector((state:RootState) => state.user)
  const router = useRouter() 
  const check = useAuth()
  const {data,isLoading,isFetching,isError,error} = useFindSubscriptionQuery({userId:id||""})
  
   useEffect(() => {
    if (isError && error) {
      toast.error(AxiosErrorHandler(error))
    }
  }, [isError, error])

  useEffect(() => {
    if(!isLoading && check){
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
  },[isLoading,router,data,check])

  if(  !check ||isLoading || isFetching ){
    return null
  }

    return (
       <>
         {children} 
       </>
    )
}