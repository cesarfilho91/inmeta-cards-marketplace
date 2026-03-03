export type TradeType = 'OFFERING' | 'RECEIVING'

export interface TradeCardPayload {
    cardId: string
    type: TradeType
}

export interface Card {
    id: string
    name: string
    imageUrl: string
}

export interface TradeCard {
    id: string
    type: TradeType
    card: Card
}

export interface Trade {
    id: string
    userId: string
    createdAt: string
    tradeCards: TradeCard[]
}