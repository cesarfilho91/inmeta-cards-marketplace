import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import router from '@/router'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000
})

api.interceptors.request.use((config) => {
    const auth = useAuthStore()

    if (auth.token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const auth = useAuthStore()

        if (error.response?.status === 401) {
            auth.logout()

            if (router.currentRoute.value.path !== '/login') {
                router.replace('/login')
            }
        }

        return Promise.reject(error)
    }
)