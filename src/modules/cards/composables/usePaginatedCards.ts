import { ref } from 'vue'
import { api } from '@/api/axios'
import type { Card } from '../store/cards.store'

export function usePaginatedCards(rpp = 25) {
    const cards = ref<Card[]>([])
    const page = ref(1)
    const hasMore = ref(true)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchCards(reset = false) {
        if (loading.value) return

        if (!hasMore.value && !reset) return

        loading.value = true
        error.value = null

        try {
            if (reset) {
                page.value = 1
                cards.value = []
                hasMore.value = true
            }

            const { data } = await api.get('/cards', {
                params: {
                    page: page.value,
                    rpp
                }
            })

            cards.value.push(...data.list)

            if (data.list.length < rpp) {
                hasMore.value = false
            }

            page.value++
        } catch (err: any) {
            error.value =
                err.response?.data?.message || 'Erro ao buscar cartas'
        } finally {
            loading.value = false
        }
    }

    return {
        cards,
        loading,
        hasMore,
        error,
        fetchCards
    }
}