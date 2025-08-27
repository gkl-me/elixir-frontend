'use client'

import { Header } from "@/components/admin/layout/Header";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";

export default function ProtectedLayout({
    children
}:{children:React.ReactNode}){

        const check = useAdminAuth()

        if(!check) return null

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