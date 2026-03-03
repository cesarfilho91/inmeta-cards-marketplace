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
    const myCards = ref<Card[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const allCards = ref<Card[]>([])
    const page = ref(1)
    const more = ref(true)
    const loadingAll = ref(false)
    const rpp = 50

    async function fetchAllCards(reset = false) {
        if (loadingAll.value) return
        if (!more.value && !reset) return

        loadingAll.value = true

        try {
            if (reset) {
                page.value = 1
                allCards.value = []
                more.value = true
            }

            const { data } = await api.get('/cards', {
                params: { page: page.value, rpp }
            })

            allCards.value.push(...data.list)
            more.value = data.more
            page.value++
        } finally {
            loadingAll.value = false
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
        myCards,
        loading,
        error,
        allCards,
        loadingAll,
        more,
        fetchAllCards,
        fetchMyCards,
        addCards
    }
})