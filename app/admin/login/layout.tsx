import { adminAxios } from "@/api/axiosInstance";
import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginLayout({
    children
}:{children:React.ReactNode}){

    const cookieStore = await cookies();
    let loggedIn = false

  // Manually convert cookies to header string
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }:{name:string,value:string}) => `${name}=${value}`)
    .join('; ');

    try {
        
        await adminAxios.get(ADMIN_ROUTES.ME,{
            headers:{
                Cookie:cookieHeader
            }
        })
        loggedIn = true
        
    } catch (error) {
        loggedIn= false
        console.log(error)
    }
    
    if(loggedIn){
         redirect('/admin/dashboard')
    }
    
    return (
        <>
        {children}
        </>
    )
}