import { defineStore } from 'pinia'
import { MarketplaceService } from '../services/marketplace.service'
import type { Trade } from '../types'

export const useMarketplaceStore = defineStore('marketplace', {
    state: () => ({
        trades: [] as Trade[],
        page: 1,
        rpp: 10,
        more: false,
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchTrades() {
            this.loading = true
            this.error = null

            try {
                const response = await MarketplaceService.getTrades(this.page, this.rpp)

                this.trades = response.list
                this.more = response.more
            } catch (err: any) {
                this.error = err?.message || 'Erro ao buscar trocas'
            } finally {
                this.loading = false
            }
        }
    }
})