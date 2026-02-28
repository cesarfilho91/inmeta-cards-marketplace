import { defineStore } from 'pinia'
import { TradeService } from '@/modules/trades/services/trade.service'
import type { TradeCardPayload } from '../types'

interface TradeState {
    myCards: any[]
    trades: any[]
    page: number
    rpp: number
    more: boolean
    loading: boolean
    error: string | null
}

export const useTradesStore = defineStore('trades', {
    state: (): TradeState => ({
        myCards: [],
        trades: [],
        page: 1,
        rpp: 10,
        more: true,
        loading: false,
        error: null
    }),

    actions: {
        async fetchMyCards() {
            try {
                this.loading = true
                this.error = null

                const data = await TradeService.getMyCards()
                this.myCards = data
            } catch (err: any) {
                this.error = 'Erro ao carregar suas cartas'
            } finally {
                this.loading = false
            }
        },

        async createTrade(cards: TradeCardPayload[]) {
            try {
                this.loading = true
                this.error = null

                await TradeService.create(cards)
            } catch (err: any) {
                this.error = 'Erro ao criar troca'
                throw err
            } finally {
                this.loading = false
            }
        },

        async fetchTrades(append = false) {
            try {
                this.loading = true

                const data = await TradeService.getAll(this.page, this.rpp)

                if (append) {
                    this.trades = [...this.trades, ...data.list]
                } else {
                    this.trades = data.list
                }

                this.more = data.more
            } finally {
                this.loading = false
            }
        },

        async loadMore() {
            if (!this.more) return
            this.page++
            await this.fetchTrades(true)
        }
    }
})