import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { adminAxios } from "@/api/axiosInstance";
import { handleAdminLogout } from "@/redux/actions/adminActions";
import { createApi } from "@reduxjs/toolkit/query/react";


export const adminApi = createApi({
    reducerPath:'adminApi',
    baseQuery:axiosBaseQuery(
        adminAxios,
        'admin',
        (api) => api.dispatch(handleAdminLogout())
    ),
    tagTypes:['admin','plans'],
    endpoints:() => ({})
})