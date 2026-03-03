<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useTradesStore } from '../store/trades.store'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import TradeCardSkeleton from '@/modules/marketplace/components/TradeCardSkeleton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import '@/assets/styles/trades.css'

const tradesStore = useTradesStore()
const authStore = useAuthStore()

const showCancelModal = ref(false)
const tradeToCancel = ref<string | null>(null)

const selectedImage = ref<string | null>(null)

function openImage(imageUrl: string) {
    selectedImage.value = imageUrl
}

function closeImage() {
    selectedImage.value = null
}

onMounted(async () => {
    await tradesStore.fetchTrades()
})

const myTrades = computed(() => {
    if (!authStore.user) return []

    return tradesStore.trades.filter(
        trade => trade.userId === authStore.user!.id
    )
})

function openCancelModal(id: string) {
    tradeToCancel.value = id
    showCancelModal.value = true
}

async function confirmCancel() {
    if (!tradeToCancel.value) return

    await tradesStore.deleteTrade(tradeToCancel.value)
    tradeToCancel.value = null
    showCancelModal.value = false
}
</script>

<template>
    <div class="page-container">
        <h1 class="page-title">Minhas Trocas</h1>

        <div v-if="tradesStore.loading" class="empty-state">
            <TradeCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <div v-else-if="myTrades.length === 0" class="empty-state">
            Você ainda não criou nenhuma troca.
        </div>

        <div v-else class="trades-list">
            <div v-for="trade in myTrades" :key="trade.id" class="trade-card">

                <div class="trade-header">
                    <span class="trade-date">
                        {{ new Date(trade.createdAt).toLocaleDateString() }}
                    </span>
                </div>

                <div class="trade-body">

                    <!-- OFFERING -->
                    <div class="trade-column">
                        <h4 class="offer-title">OFERECE</h4>
                        <div class="cards-row">
                            <div v-for="tc in trade.tradeCards.filter(c => c.type === 'OFFERING')" :key="tc.id"
                                class="card-preview clickable" @click="openImage(tc.card.imageUrl)">
                                <img :src="tc.card.imageUrl" :alt="tc.card.name" />
                                <span>{{ tc.card.name }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="trade-divider">⇄</div>

                    <!-- RECEIVING -->
                    <div class="trade-column">
                        <h4 class="receive-title">QUER RECEBER</h4>
                        <div class="cards-row">
                            <div v-for="tc in trade.tradeCards.filter(c => c.type === 'RECEIVING')" :key="tc.id"
                                class="card-preview clickable" @click="openImage(tc.card.imageUrl)">
                                <img :src="tc.card.imageUrl" :alt="tc.card.name" />
                                <span>{{ tc.card.name }}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="trade-footer">
                    <button class="danger-btn" @click="openCancelModal(trade.id)">
                        Cancelar troca
                    </button>
                </div>

            </div>
        </div>
    </div>

    <!-- Modal cancelar -->
    <BaseModal v-model="showCancelModal" title="Cancelar troca">
        <p>Tem certeza que deseja cancelar esta troca?</p>

        <template #actions>
            <button class="secondary-btn" @click="showCancelModal = false">
                Voltar
            </button>

            <button class="danger-btn" :disabled="tradesStore.loading" @click="confirmCancel">
                {{ tradesStore.loading ? 'Cancelando...' : 'Sim, cancelar' }}
            </button>
        </template>
    </BaseModal>

    <!-- Modal imagem -->
    <BaseModal v-model="selectedImage">
        <div class="image-modal-content">
            <img v-if="selectedImage" :src="selectedImage" class="image-modal" />
        </div>
    </BaseModal>

</template>