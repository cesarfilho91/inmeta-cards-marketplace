import { api } from '@/api/axios'

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    name: string
    email: string
    password: string
}

export const AuthService = {
    async login(data: LoginPayload) {
        const response = await api.post('/login', data)
        return response.data
    },

    async register(data: RegisterPayload) {
        const response = await api.post('/register', data)
        return response.data
    },

    async me() {
        const response = await api.get('/me')
        return response.data
    }
}