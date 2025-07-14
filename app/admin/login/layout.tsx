'use client'

import { ADMIN_ROUTES } from '@/constants/adminRoutes'
import useAdminAuth from '@/hooks/useAdminAuth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Layout({
    children
}:{
    children:React.ReactNode
}) {


    //check if admin is authenicated

    const {isAuth,isLoading} = useAdminAuth()
    const router = useRouter()

    useEffect(() => {
        if(isAuth && !isLoading){
            router.replace(ADMIN_ROUTES.ADMIN+ADMIN_ROUTES.DASHBOARD)
        }
    },[router,isAuth,isLoading])

    if(isLoading || isAuth){
        return null
    }

  return (
    <>
        {children}
    </>
  )
}

export default Layout