import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth.service'
import type { User } from '@/types/user.types'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null as string | null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(email: string, password: string) {
            this.loading = true
            this.error = null

            try {
                const { token, user } = await AuthService.login({ email, password })

                this.token = token
                this.user = user

                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
            } catch (err: any) {
                this.error =
                    err.response?.data?.message ||
                    'Erro ao realizar login'
                throw err
            } finally {
                this.loading = false
            }
        },

        async register(name: string, email: string, password: string) {
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
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },

        async fetchUser() {
            if (!this.token) return

            try {
                const user = await AuthService.me()
                this.user = user
            } catch {
                this.logout()
            }
        }
    }
})