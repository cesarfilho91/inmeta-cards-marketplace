<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTradesStore } from '../store/trades.store'
import type { TradeCardPayload } from '../types'

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

<style scoped>
.create-trade {
    padding: 2rem;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.card-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}

.card-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
}

.selectors {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>