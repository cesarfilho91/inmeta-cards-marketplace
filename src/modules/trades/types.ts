export type TradeType = 'OFFERING' | 'RECEIVING'

export interface TradeCardPayload {
    cardId: string
    type: TradeType
}