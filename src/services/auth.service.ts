import { api } from '@/api/axios'
import type {
    LoginPayload,
    RegisterPayload,
    AuthResponse
} from '@/types/auth.types'

export const AuthService = {
    async login(data: LoginPayload): Promise<AuthResponse> {
        const response = await api.post('/login', data)
        return response.data
    },

    async register(data: RegisterPayload): Promise<AuthResponse> {
        const response = await api.post('/register', data)
        return response.data
    },

    async me() {
        const response = await api.get('/me')
        return response.data
    }
}