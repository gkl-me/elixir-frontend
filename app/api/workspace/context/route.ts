import { AxiosErrorHandler } from "@/lib/errorHandler";
import { workspaceService } from "@/services/workspace.service";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req:NextRequest){
    try {


        const res = await workspaceService.handleWorkspaceContext()

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