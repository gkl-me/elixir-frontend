import {  useLazyAdminMeQuery } from '@/redux/api/admin/adminAuthApi'
import { useEffect, useState } from 'react'

function useAdminAuth() {

  const [isLoading,setIsLoading] = useState(true)
  const [isAuth,setIsAuth] = useState(false)
  const [triggerMe,{error}] = useLazyAdminMeQuery()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await triggerMe({}).unwrap()
        setIsAuth(true)
      } catch (error) {
        if(error){
          setIsAuth(false)
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  },[])

  return {isAuth,isLoading,error}

}

export default useAdminAuth