import { api } from '@/api/axios'

export const CardService = {
    async getAll(page = 1, rpp = 10) {
        const response = await api.get('/cards', {
            params: { page, rpp }
        })
        return response.data
    },

    async getById(id: string) {
        const response = await api.get(`/cards/${id}`)
        return response.data
    },

    async getMyCards() {
        const response = await api.get('/me/cards')
        return response.data
    },

    async addToMyCards(cardIds: string[]) {
        const response = await api.post('/me/cards', { cardIds })
        return response.data
    }
}