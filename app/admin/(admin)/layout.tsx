import { adminAxios } from "@/api/axiosInstance";
import { AdminRoutes } from "@/constants/adminRoutes";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProtectedLayout({
    children
}:{children:React.ReactNode}){

    const cookieStore = await cookies();

  // Manually convert cookies to header string
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }:{name:string,value:string}) => `${name}=${value}`)
    .join('; ');

    let errorMessage = "";

    try {
        
        await adminAxios.get(AdminRoutes.ME,{
            headers:{
                Cookie:cookieHeader
            }
        })
        return (
            <>
            {children}
            </>
        )

    } catch (error) {
        console.log(error)
        if(error instanceof AxiosError){
            errorMessage = error.response?.data?.message
        }
    }
    
    redirect(`/admin/login?error=${errorMessage}`)
}