

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { AxiosErrorHandler } from '@/lib/errorHandler'

export const useQueryErrorHandler = (isError: boolean, error: unknown) => {
  const hasShownError = useRef(false)
  
  useEffect(() => {
    if (isError && error && !hasShownError.current) {
      hasShownError.current = true

      toast.error(AxiosErrorHandler(error))
    }
    
    
    if (!isError) {
      hasShownError.current = false
    }
  }, [isError, error])
  
  return hasShownError.current
}