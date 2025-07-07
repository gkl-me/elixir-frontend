import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/user/userApi";
import { adminApi } from "./api/admin/adminApi";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]:userApi.reducer,
        [adminApi.reducerPath]:adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(adminApi.middleware)
        
})