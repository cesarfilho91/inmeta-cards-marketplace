<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { type Card } from '../store/cards.store'
import { usePaginatedCards } from '../composables/usePaginatedCards'
import { useScrollLock } from '@/composables/useScrollLock'
import ScrollTopButton from '@/components/ui/ScrollTopButton.vue'
import TradeCardSkeleton from '@/modules/marketplace/components/TradeCardSkeleton.vue'
import '@/assets/styles/cards.css'

const selectedCard = ref<Card | null>(null)

const { lock, unlock } = useScrollLock()

const {
    cards: allCards,
    loading: loadingAll,
    hasMore,
    fetchCards
} = usePaginatedCards(25)

onMounted(() => {
    fetchCards(true)
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

watch(selectedCard, (val) => {
    if (val) {
        lock()
    } else {
        unlock()
    }
})

function openCardDetails(card: Card) {
    selectedCard.value = card
}

function closeDetails() {
    selectedCard.value = null
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && selectedCard.value) {
        closeDetails()
    }
}
</script>

<template>
    <div class="page-container">
        <h1>Guia de Cards</h1>

        <div v-if="loadingAll && allCards.length === 0">
            <TradeCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <div v-else-if="allCards.length === 0" class="empty-state">
            <h2>Nenhuma carta encontrada</h2>
        </div>

        <div v-else class="cards-grid">
            <div v-for="card in allCards" :key="card.id" class="card-item" @click="openCardDetails(card)">
                <img :src="card.imageUrl" width="100" />
                <h3 class="card-name">{{ card.name }}</h3>
            </div>
        </div>

        <div v-if="hasMore" class="load-more">
            <button type="button" class="secondary-btn" :disabled="loadingAll" @click="fetchCards()">
                <span v-if="loadingAll">Carregando...</span>
                <span v-else>Carregar mais</span>
            </button>
        </div>

        <div v-if="selectedCard" class="modal" @click.self="closeDetails">
            <div class="modal-content large animate-in details-modal">
                <button class="modal-close" @click="closeDetails">
                    ✕
                </button>
                <div class="details-grid">
                    <div class="details-image">
                        <img :src="selectedCard.imageUrl" />
                    </div>

                    <div class="details-info">
                        <h2>{{ selectedCard.name }}</h2>

                        <p v-if="selectedCard.description">
                            {{ selectedCard.description }}
                        </p>
                    </div>
                    <div class="details-footer">
                        <button class="secondary-btn" @click="closeDetails">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <ScrollTopButton />
    </div>
</template>