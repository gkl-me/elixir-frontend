import { create } from "zustand"


export type AuthState = {
    accessToken:string|null,
    isAuthenticated:boolean

    login:(token:string) => void,
    logout:() => void
}


export const useAuthStore = create<AuthState>()(
    (set) => ({
        accessToken:null,
        isAuthenticated:false,


        login:(token) => {
            set({
                accessToken:token,
                isAuthenticated:true
            })
        },

        logout:()=>{
            set({
                accessToken:null,
                isAuthenticated:false
            })
        }
    })
)