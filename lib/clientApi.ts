import { API_BASE_URL } from '@/constants/config'
import axios from 'axios'

export const clientApi = axios.create({
    baseURL:API_BASE_URL,
    withCredentials:true
})