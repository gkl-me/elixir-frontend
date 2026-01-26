import { toast } from "sonner"


interface IRes{
    success:boolean,
    error?:string,
    message?:string
}

export function toastHandler(res:IRes){
    if(res.success){
        toast.success(res.message)
    }else if(!res.success){
        toast.error(res.error)
    }
}