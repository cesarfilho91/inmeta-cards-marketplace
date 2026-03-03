import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/axios'

export interface Card {
    id: string
    name: string
    description: string
    imageUrl: string
    createdAt: string
}

export const useCardsStore = defineStore('cards', () => {
    const cards = ref<Card[]>([])
    const myCards = ref<Card[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAllCards(page = 1, rpp = 500) {
        loading.value = true
        error.value = null

        try {
            const { data } = await api.get('/cards', {
                params: {
                    page,
                    rpp
                }
            })

            cards.value = data.list
        } catch (err: any) {
            error.value =
                err.response?.data?.message || 'Erro ao buscar cartas'
        } finally {
            loading.value = false
        }
    }

    async function fetchMyCards() {
        loading.value = true
        error.value = null

        try {
            const { data } = await api.get<Card[]>('/me/cards')
            myCards.value = data
        } catch (err: any) {
            error.value =
                err.response?.data?.message || 'Erro ao buscar suas cartas'
        } finally {
            loading.value = false
        }
    }

    async function addCards(cardIds: string[]) {
        loading.value = true
        error.value = null

        try {
            await api.post('/me/cards', { cardIds })
            await fetchMyCards()
        } catch (err: any) {
            error.value =
                err.response?.data?.message || 'Erro ao adicionar carta'
        } finally {
            loading.value = false
        }
    }

    return {
        cards,
        myCards,
        loading,
        error,
        fetchAllCards,
        fetchMyCards,
        addCards
    }
})