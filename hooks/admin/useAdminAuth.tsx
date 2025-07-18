import { ADMIN_ROUTES } from "@/constants/adminRoutes"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export const useAdminAuth = () => {
    const {isAuth} = useSelector((state:RootState) => state.admin)
    const router = useRouter()
    const [check,setCheck] = useState(false)


    useEffect(() => {
        if(!isAuth){
            router.replace(ADMIN_ROUTES.ADMIN+ADMIN_ROUTES.LOGIN)
        }else{
            setCheck(true)
        }
    },[isAuth])

    return check
}