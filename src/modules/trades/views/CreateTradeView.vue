<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTradesStore } from '../store/trades.store'
import type { TradeCardPayload } from '../types'
import '@/assets/styles/trades.css'

const tradesStore = useTradesStore()
const router = useRouter()

const selectedOffering = ref<string[]>([])
const selectedReceiving = ref<string | null>(null)

onMounted(async () => {
    await tradesStore.fetchMyCards()
})

const canSubmit = computed(() => {
    return selectedOffering.value.length > 0 && selectedReceiving.value
})

async function submitTrade() {
    if (!canSubmit.value) return

    const payload: TradeCardPayload[] = [
        ...selectedOffering.value.map<TradeCardPayload>(id => ({
            cardId: id,
            type: 'OFFERING'
        })),
        {
            cardId: selectedReceiving.value!,
            type: 'RECEIVING'
        }
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
    <div class="create-trade">
        <h1>Criar Nova Troca</h1>

        <div v-if="tradesStore.loading">Carregando...</div>

        <div v-else>
            <h2>Suas Cartas</h2>

            <div class="cards-grid">
                <div v-for="card in tradesStore.myCards" :key="card.id" class="card-item">
                    <img :src="card.imageUrl" :alt="card.name" />
                    <p>{{ card.name }}</p>

                    <div class="selectors">
                        <label>
                            <input type="checkbox" :value="card.id" v-model="selectedOffering" />
                            Oferecer
                        </label>

                        <label>
                            <input type="radio" name="receiving" :value="card.id" v-model="selectedReceiving" />
                            Quero Receber
                        </label>
                    </div>
                </div>
            </div>

            <button :disabled="!canSubmit || tradesStore.loading" @click="submitTrade">
                Criar Troca
            </button>
        </div>
    </div>
</template>