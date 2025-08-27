"use client"
import { ADMIN_ROUTES } from '@/constants/adminRoutes'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


function Layout({
    children
}:{
    children:React.ReactNode
}) {

  const router = useRouter()
  const {isAuth} = useSelector((state:RootState) => state.admin)
  const [check,setCheck] = useState(false)
 
  useEffect(() => {
    if(isAuth){
      router.replace(ADMIN_ROUTES.ADMIN+ADMIN_ROUTES.DASHBOARD)
    }else{
      setCheck(true)
    }
  },[isAuth,router])

  if(!check) return null

  return (
    <>
        {children}
    </>
  )
}

export default Layout