import { userApi } from "../api/user/userApi";
import { userLogout } from "../slices/userSlice";
import { AppDispatch } from "../store";



export const handleUserLogout = () => (dispatch:AppDispatch) => {
    dispatch(userLogout())
    dispatch(userApi.util.resetApiState())
}