import { defineStore } from 'pinia'

interface Toast {
    id: number
    message: string
    type: 'success' | 'error'
}

export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: [] as Toast[]
    }),

    actions: {
        show(message: string, type: 'success' | 'error' = 'success') {
            const id = Date.now()

            this.toasts.push({ id, message, type })

            setTimeout(() => {
                this.remove(id)
            }, 3000)
        },

        remove(id: number) {
            this.toasts = this.toasts.filter(t => t.id !== id)
        }
    }
})