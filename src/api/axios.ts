import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const auth = useAuthStore()

            auth.logout()

            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)