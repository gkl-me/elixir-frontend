"use client"

import { toggleUserStatusAction } from "@/app/actions/user.action"
import { useApi } from "@/hooks/useApi"
import { useEffect, useState } from "react"



export default function Demo({prop}:{prop:any}){

    const [data,setData] = useState("")
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        setData(prop)
    },[prop])


    const fetchData = async () => {
        setLoading(true)
        const res = await fetch('/api/users',{
            credentials:"include"
        })

        if(!res.ok){
            setLoading(false)
        }

        if(res.ok){
            const data = await res.json()
            setData(JSON.stringify(data))
            setLoading(false)
        }
    }




    return (
        <div>
            {loading ? "loading..... please wait": data}
            <br />
            <button
                onClick={() => fetchData()}
            >
                Get Data
            </button>
            <br />
            <button
             onClick={() => toggleUserStatusAction("697b4dd38b19228e5903438a")}
            >
                Block
            </button>
        </div>
    )
}