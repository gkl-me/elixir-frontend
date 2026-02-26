"use client"

import { logoutAction } from "@/app/actions/auth.action"




export default function  DashboardPage(){
    
    return (
        <div>
            Hello this is dashboard 
            <br />
            <button
                onClick={() => {
                    logoutAction()
                }}
            >Logout</button>
        </div>
    )
}