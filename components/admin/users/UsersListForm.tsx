"use client"

import { DataTable, TableFetchParams } from "@/components/table/table"
import { AxiosErrorHandler } from "@/lib/errorHandler"
import { useGetAllUsersQuery, useToggleBlockStatusMutation } from "@/redux/api/admin/adminUserApi"
import { toast } from "sonner"
import { getUserColumns } from "./UserColumn"
import { useCallback, useState } from "react"


function UsersListForm() {

    const [params, setParams] = useState({  
    search: "",
    limit: 8,
    page: 0,
    status: "",
    sortBy: "",
    sortOrder: "",
  })

    const {data,isLoading,isFetching} = useGetAllUsersQuery(params)
    const [toggleVBlockStatus] = useToggleBlockStatusMutation()

    const fetchUser = useCallback( async (params:TableFetchParams) => {
            setParams(params)
            return {
                data: data?.data?.users || [],
                totalCount: data?.data?.totalCount || 0,
            }
    },[data])

    const handleToggleBlock = async (id:string) => {
        try {
            await toggleVBlockStatus({id}).unwrap()
        } catch (error) {
            toast.error(AxiosErrorHandler(error))
        }
    }

  return (
    <div className="absolute ml-32 p-6 flex justify-center">
      <div>
        <DataTable 
        isLoading={isLoading}
        isFetching={isFetching}
        columns={getUserColumns(handleToggleBlock)}
        title="Users"
        fetchData={fetchUser}
        pageSize={8}
        statusOptions={[
          { label: 'Blocked', value: 'true' },
          { label: 'Active', value: 'false' }
        ]}
      />
      </div>
  </div>
  )
}

export default UsersListForm