import { combineReducers, configureStore, Store } from "@reduxjs/toolkit";
import { userApi } from "./api/user/userApi";
import { adminApi } from "./api/admin/adminApi";
import adminReducer from './slices/adminSlice'
import userReducer from './slices/userSlice'
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";

const adminPersistConfig = {
    key:'admin',
    storage
}

const userPersistConfig = {
    key:'user',
    storage
}

const rootReducers = combineReducers({
    [userApi.reducerPath]:userApi.reducer,
    [adminApi.reducerPath]:adminApi.reducer,
    admin:persistReducer(adminPersistConfig,adminReducer),
    user:persistReducer(userPersistConfig,userReducer)
})

export const store:Store = configureStore({
    reducer:rootReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:false
        })
            .concat(userApi.middleware)
            .concat(adminApi.middleware)
        
})

export const persist = persistStore(store)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch