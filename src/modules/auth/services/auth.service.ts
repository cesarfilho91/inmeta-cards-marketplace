import { api } from '@/api/axios'
import type {
    LoginPayload,
    RegisterPayload,
    AuthResponse,
    User
} from '@/modules/auth/types'

export const AuthService = {
    async login(data: LoginPayload): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/login', data)
        return response.data
    },

    async register(data: RegisterPayload): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/register', data)
        return response.data
    },

    async me(): Promise<User> {
        const response = await api.get<User>('/me')
        return response.data
    }
}