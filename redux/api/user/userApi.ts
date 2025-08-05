import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { userAxios } from "@/api/axiosInstance";
import { createApi } from "@reduxjs/toolkit/query/react";


export const userApi = createApi({
    reducerPath:"userApi",
    baseQuery:axiosBaseQuery(
        userAxios,
        'user',
        (api) => api.dispatch("hello")
    ),
    tagTypes:["user",'plans','subscription'],
    endpoints: () => ({}),
})