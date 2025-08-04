'use client'

import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";


export default function OnboardingLayout({children}:{children:React.ReactNode}){

    const {firstTimeLogin} = useSelector((state:RootState) => state.user)
    const router = useRouter()

    useEffect(() => {
        if(!firstTimeLogin){
            router.replace('/workspace')
        }
    },[])
    return (
       <>
         {children} 
       </>
    )
}