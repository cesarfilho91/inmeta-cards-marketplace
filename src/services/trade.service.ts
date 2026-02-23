import { api } from '@/api/axios'

export const TradeService = {
    async create(cards: { cardId: string; type: string }[]) {
        const response = await api.post('/trades', { cards })
        return response.data
    },

    async getAll(page = 1, rpp = 10) {
        const response = await api.get('/trades', {
            params: { page, rpp }
        })
        return response.data
    },

    async delete(id: string) {
        await api.delete(`/trades/${id}`)
    }
}