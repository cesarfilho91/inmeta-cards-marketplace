<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCardsStore, type Card } from '../store/cards.store'
import { useScrollLock } from '@/composables/useScrollLock'
import { usePaginatedCards } from '../composables/usePaginatedCards'
import ScrollTopButton from '@/components/ui/ScrollTopButton.vue'
import TradeCardSkeleton from '@/modules/marketplace/components/TradeCardSkeleton.vue'
import '@/assets/styles/cards.css'

const cardsStore = useCardsStore()

const selectedCards = ref<string[]>([])
const showModal = ref(false)

const selectedCard = ref<Card | null>(null)

const { lock, unlock } = useScrollLock()

const {
    cards: allCards,
    loading: loadingAll,
    hasMore,
    fetchCards
} = usePaginatedCards(25)

onMounted(() => {
    cardsStore.fetchMyCards()
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

watch(
    [selectedCard, showModal],
    ([detailsOpen, addOpen]) => {
        const isOpen = !!detailsOpen || addOpen

        if (isOpen) {
            lock()
        } else {
            unlock()
        }
    }
)

function toggleModal() {
    showModal.value = !showModal.value

    if (showModal.value && allCards.value.length === 0) {
        fetchCards(true)
    }
}

async function addSelectedCards() {
    if (!selectedCards.value.length) return

    await cardsStore.addCards(selectedCards.value)

    selectedCards.value = []
    showModal.value = false
}

function toggleSelection(id: string) {
    const index = selectedCards.value.indexOf(id)

    if (index === -1) {
        selectedCards.value.push(id)
    } else {
        selectedCards.value.splice(index, 1)
    }
}

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
        <h1>Minhas Cartas</h1>

        <button class="primary-btn" @click="toggleModal">
            + Adicionar cartas
        </button>

        <div v-if="cardsStore.loading">
            <TradeCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <div v-else-if="cardsStore.error">
            {{ cardsStore.error }}
        </div>

        <div v-else-if="cardsStore.myCards.length === 0" class="empty-state">
            <h2>Nenhuma carta ainda</h2>
            <p>Adicione cartas à sua coleção para começar a negociar.</p>

            <button class="primary-btn" @click="toggleModal">
                Adicionar cartas
            </button>
        </div>

        <div v-else class="cards-grid">
            <div v-for="card in cardsStore.myCards" :key="card.id" class="card-item" @click="openCardDetails(card)">
                <img :src="card.imageUrl" width="100" />
                <h3 class="card-name">{{ card.name }}</h3>
            </div>
        </div>

        <div v-if="selectedCard" class="modal" @click.self="closeDetails">
            <div class="modal-content large animate-in details-modal">

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

                </div>
            </div>
        </div>

        <div v-if="showModal" class="modal">
            <div class="modal-content large animate-in">
                <div class="modal-header">
                    <h2>Adicionar cartas</h2>
                    <button class="icon-btn" @click="toggleModal">
                        ✕
                    </button>
                </div>

                <div class="cards-grid selectable">
                    <div v-for="card in allCards" :key="card.id" class="card-select"
                        :class="{ selected: selectedCards.includes(card.id) }" @click="toggleSelection(card.id)">
                        <div class="badge" v-if="selectedCards.includes(card.id)">
                            ✓
                        </div>

                        <img :src="card.imageUrl" />

                        <div class="card-info">
                            <span>{{ card.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="secondary-btn" @click="toggleModal">
                        Cancelar
                    </button>

                    <div v-if="hasMore" class="load-more">
                        <button type="button" class="secondary-btn" :disabled="loadingAll" @click="fetchCards()">
                            <span v-if="loadingAll">Carregando...</span>
                            <span v-else>Carregar mais</span>
                        </button>
                    </div>

                    <button class="primary-btn" :disabled="!selectedCards.length" @click="addSelectedCards">
                        Adicionar {{ selectedCards.length }}
                    </button>
                </div>
            </div>
        </div>
        <ScrollTopButton />
    </div>
</template>