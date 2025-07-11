import { configureStore, Store } from "@reduxjs/toolkit";
import { userApi } from "./api/user/userApi";
import { adminApi } from "./api/admin/adminApi";
import adminReducer from './slices/adminSlice'

export const store:Store = configureStore({
    reducer: {
        [userApi.reducerPath]:userApi.reducer,
        [adminApi.reducerPath]:adminApi.reducer,
        admin:adminReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(adminApi.middleware)
        
})


export type RootState = ReturnType<typeof store.getState>;