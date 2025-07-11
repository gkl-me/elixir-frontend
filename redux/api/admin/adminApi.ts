import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { adminAxios } from "@/api/axiosInstance";
import { createApi } from "@reduxjs/toolkit/query/react";


export const adminApi = createApi({
    reducerPath:'adminApi',
    baseQuery:axiosBaseQuery(adminAxios),
    tagTypes:['admin','plans'],
    endpoints:() => ({})
})