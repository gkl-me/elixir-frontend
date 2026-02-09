import { AxiosErrorHandler } from "@/lib/errorHandler";
import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest){
    try {

        const {searchParams} = new URL(req.url)

        const search = searchParams.get("search") ?? ""
        const status = searchParams.get("status") ?? ""
        const page = searchParams.get("page") ?? "1"
        const limit = searchParams.get("limit") ?? "9"
        const sortBy = searchParams.get("sortBy") ?? ""
        const sortOrder = searchParams.get("sortOrder") ?? 'desc'

        const res = await userService.getAllUsers({
            search,
            status,
            page,
            limit,
            sortBy,
            sortOrder
        })

        return NextResponse.json({
            success:res.data.success,
            data:res.data.data,
            message:res.data.message,
        })
        
    } catch (error) {
        const err = AxiosErrorHandler(error)
        return NextResponse.json({
            success:false,
            message:err.message,
            errorCode:err.errorCode,
        },{
            status:err.statusCode ?? 500
        })
    }
}