import { defineStore } from 'pinia'
import { AuthService } from '@/services/auth.service'

interface User {
    id: string
    name: string
    email: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: localStorage.getItem('token') || null,
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(email: string, password: string) {
            try {
                this.loading = true

                const { token, user } = await AuthService.login({ email, password })

                this.token = token
                this.user = user

                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
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

            const user = await AuthService.me()
            this.user = user
        }
    }
})