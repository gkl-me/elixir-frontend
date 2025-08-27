import {AppDispatch} from '@/redux/store'
import { adminLogout } from '../slices/adminSlice'
import { adminApi } from '../api/admin/adminApi'

export const handleAdminLogout = () => (dispatch:AppDispatch) => {
    dispatch(adminLogout())
    dispatch(adminApi.util.resetApiState())
}