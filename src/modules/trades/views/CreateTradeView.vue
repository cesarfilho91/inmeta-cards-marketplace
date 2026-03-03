<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTradesStore } from '../store/trades.store'
import { useCardsStore } from '@/modules/cards/store/cards.store'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { usePaginatedCards } from '@/modules/cards/composables/usePaginatedCards'
import ScrollTopButton from '@/components/ui/ScrollTopButton.vue'
import type { TradeCardPayload } from '../types'
import '@/assets/styles/cards.css'

const tradesStore = useTradesStore()
const cardsStore = useCardsStore()
const authStore = useAuthStore()
const router = useRouter()

const selectedOffering = ref<string[]>([])
const selectedReceiving = ref<string[]>([])

const {
    cards: allCards,
    loading: loadingAll,
    hasMore,
    fetchCards
} = usePaginatedCards(25)

onMounted(async () => {
    await Promise.all([
        cardsStore.fetchMyCards(),
        tradesStore.fetchTrades()
    ])

    await fetchCards(true)
})

const blockedCardIds = computed(() => {
    if (!authStore.user) return []

    return tradesStore.trades
        .filter(trade => trade.userId === authStore.user!.id)
        .flatMap(trade =>
            trade.tradeCards.map((tc: any) => tc.cardId)
        )
})

function isBlocked(cardId: string) {
    return blockedCardIds.value.includes(cardId)
}

const canSubmit = computed(() => {
    return selectedOffering.value.length > 0 &&
        selectedReceiving.value.length > 0
})

const cardsINotHave = computed(() => {
    return allCards.value.filter(card =>
        !cardsStore.myCards.some(my => my.id === card.id)
    )
})

watch(selectedReceiving, (newValues) => {
    selectedOffering.value = selectedOffering.value.filter(
        id => !newValues.includes(id)
    )
})

async function submitTrade() {
    if (!canSubmit.value) return

    const payload: TradeCardPayload[] = [
        ...selectedOffering.value.map<TradeCardPayload>(id => ({
            cardId: id,
            type: 'OFFERING'
        })),
        ...selectedReceiving.value.map<TradeCardPayload>(id => ({
            cardId: id,
            type: 'RECEIVING'
        }))
    ]

    try {
        await tradesStore.createTrade(payload)
        router.push({ name: 'marketplace' })
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <div class="page-container">
        <h1>Criar Nova Troca</h1>

        <div v-if="tradesStore.loading" class="loading-state">
            Carregando...
        </div>

        <div v-else>
            <h2>Suas Cartas</h2>

            <div v-if="cardsStore.myCards.length === 0" class="empty-state">
                <p>Você não possui cartas para oferecer.</p>
            </div>

            <div v-else class="cards-grid">
                <div v-for="card in cardsStore.myCards" :key="card.id" class="card-item selectable" :class="{
                    selected: selectedOffering.includes(card.id),
                    disabled: isBlocked(card.id)
                }" @click="() => {
                    if (isBlocked(card.id)) return

                    selectedOffering.includes(card.id)
                        ? selectedOffering = selectedOffering.filter(id => id !== card.id)
                        : selectedOffering.push(card.id)
                }">
                    <div class="badge" v-if="selectedOffering.includes(card.id)">
                        ✓
                    </div>

                    <img :src="card.imageUrl" :alt="card.name" />
                    <h3 class="card-name">{{ card.name }}</h3>
                </div>
            </div>
            <br />
            <hr />
            <h2 style="margin-top: 25px;">Quero Receber</h2>

            <div v-if="cardsStore.loading" class="empty-state">
                <p>Carregando cartas disponíveis...</p>
            </div>

            <div v-else-if="allCards.length === 0" class="empty-state">
                <p>Nenhuma carta cadastrada no sistema.</p>
            </div>

            <div v-else-if="cardsINotHave.length === 0" class="empty-state">
                <p>Você já possui todas as cartas disponíveis.</p>
            </div>

            <div v-else class="cards-grid">
                <div v-for="card in cardsINotHave" :key="card.id" class="card-item selectable" :class="{
                    selected: selectedReceiving.includes(card.id),
                    disabled: isBlocked(card.id)
                }" @click="() => {
                    if (isBlocked(card.id)) return

                    selectedReceiving.includes(card.id)
                        ? selectedReceiving = selectedReceiving.filter(id => id !== card.id)
                        : selectedReceiving.push(card.id)
                }">
                    <div class="badge" v-if="selectedReceiving.includes(card.id)">
                        ✓
                    </div>

                    <img :src="card.imageUrl" :alt="card.name" />
                    <h3 class="card-name">{{ card.name }}</h3>
                </div>
            </div>
            <div v-if="hasMore" class="load-more">
                <button type="button" class="secondary-btn" :disabled="loadingAll" @click="fetchCards()">
                    {{ loadingAll ? 'Carregando...' : 'Carregar mais' }}
                </button>
            </div>
            <div style="margin-top: 40px;">
                <button class="primary-btn" :disabled="!canSubmit || tradesStore.loading" @click="submitTrade">
                    Criar Troca
                </button>
            </div>
        </div>
    </div>
    <ScrollTopButton />
</template>