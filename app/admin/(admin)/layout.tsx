'use client'

import { Header } from "@/components/admin/header";
import { Sidebar } from "@/components/admin/sidebar";
import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import useAdminAuth from "@/hooks/useAdminAuth";
import { adminLogout } from "@/redux/slices/adminSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function ProtectedLayout({
    children
}:{children:React.ReactNode}){

    const {isAuth,isLoading,error} = useAdminAuth()
    const router  = useRouter()
    const dispatch = useDispatch()


    useEffect(() => {
        if(!isAuth && !isLoading){
            //redirect to login page
            router.replace(ADMIN_ROUTES.ADMIN+ADMIN_ROUTES.LOGIN)
            dispatch(adminLogout())
            toast.error(error as string)
        }
    },[isAuth,isLoading,dispatch,error,router])

    if(isLoading || !isAuth) {
        return null
    }

        return (
            <div className="min-h-screen bg-gradient-to-br from-navyDark via-navy to-blueDark">
            <Header/>
            <div className="flex ">
                <Sidebar/>
                {children}
            </div>
            </div>
        )
}