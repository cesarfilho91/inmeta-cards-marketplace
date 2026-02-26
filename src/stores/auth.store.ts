import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth.service'
import type { User } from '@/types/user.types'
import type { AuthResponse } from '@/types/auth.types'

function getUserFromStorage(): User | null {
    try {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    } catch {
        return null
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        error: null as string | null,
        loading: false as boolean,
        initialized: false as boolean,
        token: localStorage.getItem('token') as string | null,
        user: getUserFromStorage() as User | null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(email: string, password: string): Promise<void> {
            this.loading = true
            this.error = null

            try {
                const { token, user }: AuthResponse = await AuthService.login({ email, password })

                this.token = token
                this.user = user

                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
            } catch (err: unknown) {
                const error = err as any

                this.error =
                    error?.response?.data?.message ||
                    error?.message ||
                    'Erro ao realizar login'

                throw err
            } finally {
                this.loading = false
            }
        },

        async register(name: string, email: string, password: string): Promise<void> {
            this.loading = true
            this.error = null

            try {
                const { token, user } = await AuthService.register({
                    name,
                    email,
                    password
                })

                this.token = token
                this.user = user

                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
            } catch (err: any) {
                this.error =
                    err.response?.data?.message ||
                    'Erro ao registrar usuário'
                throw err
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.token = null
            this.error = null

            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },

        async fetchUser() {
            if (!this.token) {
                this.initialized = true
                return
            }

            this.loading = true
            this.error = null

            try {
                const user = await AuthService.me()
                this.user = user
                localStorage.setItem('user', JSON.stringify(user))
            } catch {
                this.logout()
            } finally {
                this.loading = false
                this.initialized = true
            }
        }
    }
})