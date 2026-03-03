import { defineStore } from 'pinia'
import { TradeService } from '@/modules/trades/services/trade.service'
import type { TradeCardPayload, Trade } from '../types'
import type { Card } from '@/modules/cards/types'

interface TradeState {
    myCards: Card[]
    trades: Trade[]
    page: number
    rpp: number
    more: boolean
    loading: boolean
    error: string | null
}

export const useTradesStore = defineStore('trades', {
    state: (): TradeState => ({
        myCards: [],
        trades: [] as Trade[],
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
        },

        async deleteTrade(id: string) {
            try {
                this.loading = true
                this.error = null

                await TradeService.deleteTrade(id)

                this.trades = this.trades.filter(trade => trade.id !== id)

            } catch (err: any) {
                this.error = 'Erro ao deletar troca'
                throw err
            } finally {
                this.loading = false
            }
        }
    }
})