import { USER_ROUTES } from "@/constants/userRoutes"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"


export const useAuth = () => {
    const {isAuth} = useSelector((state:RootState) => state.user)
    const router = useRouter()

    const [check,setCheck] = useState(false)

    useEffect(() => {
        if(!isAuth){
            console.log("change")
            router.replace(USER_ROUTES.LOGIN)
        }else{
            setCheck(true)
        }
    },[isAuth,router])

    return check

}