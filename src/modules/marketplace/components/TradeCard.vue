<script setup lang="ts">
import type { Trade } from '../types'
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
    trade: Trade
}>()

const selectedImage = ref<string | null>(null)

function openImage(imageUrl: string) {
    selectedImage.value = imageUrl
}

function closeImage() {
    selectedImage.value = null
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeImage()
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

const offeringCards = computed(() =>
    props.trade.tradeCards.filter(c => c.type === 'OFFERING')
)

const receivingCards = computed(() =>
    props.trade.tradeCards.filter(c => c.type === 'RECEIVING')
)

const formattedDate = computed(() =>
    new Date(props.trade.createdAt).toLocaleDateString()
)
</script>

<template>
    <div class="trade-card">

        <div class="trade-header">
            <div class="trade-user">
                <strong class="username">
                    {{ trade.user.name }}
                </strong>
            </div>

            <span class="trade-date">
                {{ formattedDate }}
            </span>
        </div>

        <div class="trade-body">

            <div class="trade-column">
                <span class="trade-label offering">Oferece</span>

                <div class="card-list">
                    <div v-for="card in offeringCards" :key="card.id" class="mini-card">
                        <img :src="card.card.imageUrl" :alt="card.card.name" @click="openImage(card.card.imageUrl)" />
                        <span>{{ card.card.name }}</span>
                    </div>
                </div>
            </div>

            <div class="trade-divider">⇄</div>

            <div class="trade-column">
                <span class="trade-label receiving">Quer receber</span>

                <div class="card-list">
                    <div v-for="card in receivingCards" :key="card.id" class="mini-card">
                        <img :src="card.card.imageUrl" :alt="card.card.name" @click="openImage(card.card.imageUrl)" />
                        <span>{{ card.card.name }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <Transition name="modal">
        <div v-if="selectedImage" class="image-modal" @click="closeImage">
            <img :src="selectedImage" class="modal-image" @click.stop />
        </div>
    </Transition>
</template>

<style scoped src="./trade-card.css"></style>