'use client'

import { USER_ROUTES } from "@/constants/userRoutes";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Layout(
    {children}:{children:React.ReactNode}
){

    const router = useRouter()
    const {isAuth} = useSelector((state:RootState) => state.user)
    const [check,setCheck] = useState(false)

    useEffect(() => {
        if(isAuth){
            router.replace(USER_ROUTES.WORKSPACE)
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