import { adminAxios } from "@/api/axiosInstance";
import { Header } from "@/components/admin/header";
import { Sidebar } from "@/components/admin/sidebar";
import { ADMIN_ROUTES } from "@/constants/adminRoutes";
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
        
        await adminAxios.get(ADMIN_ROUTES.ME,{
            headers:{
                Cookie:cookieHeader
            }
        })
        return (
            <div className="min-h-screen bg-gradient-to-br from-navyDark via-navy to-blueDark">
            <Header/>
            <div className="flex ">
                <Sidebar/>
                {children}
            </div>
            </div>
        )

    } catch (error) {
        console.log(error)
        if(error instanceof AxiosError){
            errorMessage = error.response?.data?.message
        }
    }
    
    redirect(`/admin/login?error=${errorMessage}`)
}