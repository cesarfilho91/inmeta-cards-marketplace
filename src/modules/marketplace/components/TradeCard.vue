<script setup lang="ts">
import type { Trade } from '../types'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

const selectedImage = ref<string | null>(null)

const props = defineProps<{
    trade: Trade
}>()

const offeringCards = computed(() =>
    props.trade.tradeCards.filter(c => c.type === 'OFFERING')
)

const receivingCards = computed(() =>
    props.trade.tradeCards.filter(c => c.type === 'RECEIVING')
)

const formattedDate = computed(() =>
    new Date(props.trade.createdAt).toLocaleDateString()
)

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        selectedImage.value = null
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

watch(selectedImage, (value) => {
    if (value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.removeProperty('overflow')
    }
})
</script>

<template>
    <div class="trade-card">
        <div class="trade-header">
            <strong>{{ trade.user.name }}</strong>
            <span>{{ formattedDate }}</span>
        </div>

        <div class="trade-section">
            <h4>Oferece</h4>
            <div class="card-list">
                <div v-for="card in offeringCards" :key="card.id" class="mini-card">
                    <img :src="card.card.imageUrl" :alt="card.card.name" @click="selectedImage = card.card.imageUrl" />
                    <span>{{ card.card.name }}</span>
                </div>
            </div>
        </div>

        <div class="trade-section">
            <h4>Quer receber</h4>
            <div class="card-list">
                <div v-for="card in receivingCards" :key="card.id" class="mini-card">
                    <img :src="card.card.imageUrl" :alt="card.card.name" @click="selectedImage = card.card.imageUrl" />
                    <span>{{ card.card.name }}</span>
                </div>
            </div>
        </div>
    </div>
    <Transition name="modal">
        <div v-if="selectedImage" class="image-modal" @click="selectedImage = null">
            <img :src="selectedImage" class="modal-image" @click.stop />
        </div>
    </Transition>
</template>

<style scoped>
.trade-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 10px 20px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.trade-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
}

.trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
}

.trade-header strong {
    font-size: 16px;
    color: #111827;
}

.trade-header span {
    font-size: 12px;
    color: #6b7280;
}

.trade-section {
    margin-top: 14px;
}

.trade-section h4 {
    font-size: 12px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.trade-section:first-of-type h4 {
    color: #16a34a;
}

.trade-section:last-of-type h4 {
    color: #2563eb;
}

.card-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.mini-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90px;
    text-align: center;
    font-size: 11px;
    color: #374151;
}

.mini-card img {
    width: 70px;
    height: 95px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    margin-bottom: 6px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
}

.mini-card img:hover {
    transform: scale(1.15);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
    z-index: 2;
}

.image-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: pointer;
}

.modal-image {
    max-height: 80vh;
    max-width: 90vw;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-image,
.modal-leave-active .modal-image {
    transition: transform 0.25s ease;
}

.modal-enter-from .modal-image,
.modal-leave-to .modal-image {
    transform: scale(0.9);
}
</style>