import { api } from "@/lib/api"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { unstable_noStore as noStore } from "next/cache"
import Demo from "./component/Demo"
import { cookies } from "next/headers"
import { withAuth } from "@/lib/withAuth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { getAllUserAction } from "@/app/actions/user.action"
import { error } from "console"
import { Suspense } from "react"

export default async function DemoPage(){

    const cookieStore = await cookies()

    console.log(cookieStore)

    noStore()

    let data =null


        const res = await getAllUserAction()
        console.log(res)

        data=res.data
        if(!res.success){
            throw new Error(res.error)
        }
        


    return (
        <div>
            <Demo prop={JSON.stringify(data)} />
        </div>
    )
}