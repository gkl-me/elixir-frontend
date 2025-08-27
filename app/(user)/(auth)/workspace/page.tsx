'use client'

import { Button } from "@/components/ui/button"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useLogoutUserMutation } from "@/redux/api/auth/authApi"
import { userLogout } from "@/redux/slices/userSlice"
import { useDispatch } from "react-redux"
import { toast } from "sonner"


export default function Workspace(){

    const [logoutUser] = useLogoutUserMutation()
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            await logoutUser({})
            dispatch(userLogout())
        } catch (error) {
            toast.error(AxiosErrorHandler(error))
        }
    }

    return (
        <div>
            workspace
            <Button 
                variant={'light'}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </div>
    )
}