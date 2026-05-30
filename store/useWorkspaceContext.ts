import { create } from "zustand"


export type WorkspaceContext = {
    name:string,
    email:string,
    avatarUrl:string,
    workspaceId:string,
    memberId:string,
    roleId:string
}

export const useWorkspaceContext = create<WorkspaceContext>()(
    (set) => ({
        name:"",
        email:"",
        avatarUrl:"",
        workspaceId:"",
        memberId:"",
        roleId:"",


        setWorkspaceContext:(context) => {
            set({
                name:context.name,
                email:context.email,

                workspaceId:context.workspaceId,
                memberId:context.memberId,
                roleId:context.roleId
            })
        },

        updateUser:(name) => {
            set({
                name
            })
        },

        updateProfile:(avatarUrl) => {
            set({
                avatarUrl
            })
        }

    })
)