import UsersListForm from "@/components/users/UserDataTable";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { userService } from "@/services/user.service";



export default async function UsersPage(){

    let data;

    try {
        const res = await userService.getAllUsers({})
        data = res.data.data
        console.log("server res",res.data.data)
    } catch (error) {
        throw new Error(AxiosErrorHandler(error).message)
    }

    return (
     <div className="space-y-6">
       <UsersListForm initialData={data.users} initialTotalCount={data.totalCount}  />
    </div>
    )
}