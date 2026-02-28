import type { Card } from "@/shared/types"

export interface TradeCard {
    id: string
    cardId: string
    tradeId: string
    type: 'OFFERING' | 'RECEIVING'
    card: Card
}

export interface TradeUser {
    name: string
}

export interface Trade {
    id: string
    userId: string
    createdAt: string
    user: TradeUser
    tradeCards: TradeCard[]
}

export interface TradesResponse {
    list: Trade[]
    rpp: number
    page: number
    more: boolean
}