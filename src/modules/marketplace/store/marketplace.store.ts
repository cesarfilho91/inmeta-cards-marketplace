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
        async fetchTrades(loadMore = false) {
            this.loading = true
            this.error = null

            if (!loadMore) {
                this.page = 1
            }

            try {
                const response = await MarketplaceService.getTrades(this.page, this.rpp)

                if (loadMore) {
                    this.trades = [...this.trades, ...response.list]
                } else {
                    this.trades = response.list
                }

                this.more = response.more
            } catch (err: any) {
                this.error = 'Erro ao buscar trocas'
            } finally {
                this.loading = false
            }
        },
        async loadNextPage() {
            if (!this.more || this.loading) return

            this.page++
            await this.fetchTrades(true)
        }
    }
})