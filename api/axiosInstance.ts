import axios from 'axios'


const createAxiosInstance = (baseURL:string) => {
    const instance = axios.create({
        baseURL,
        withCredentials : true,
    })


    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken')
            if(token){
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    instance.interceptors.response.use(
        response => response.data,
        error => {
            throw error
        }
    )

    return instance
}


export const userAxios = createAxiosInstance('http://localhost:5000/api/v1/user')
