<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMarketplaceStore } from '../store/marketplace.store'
import TradeCard from '../components/TradeCard.vue'
import '@/assets/styles/marketplace.css'

const marketplace = useMarketplaceStore()

const handleLoadMore = async () => {
  const scrollPosition = window.scrollY
  await marketplace.loadNextPage()
  window.scrollTo({ top: scrollPosition })
}

const showScrollTop = ref(false)

const handleScroll = () => {
  const dashboardContainer = document.getElementById('dashboard-scroll-container')

  if (dashboardContainer) {
    showScrollTop.value = dashboardContainer.scrollTop > 300
  } else {
    showScrollTop.value = window.scrollY > 300
  }
}

const scrollToTop = () => {
  const dashboardContainer = document.getElementById('dashboard-scroll-container')

  if (dashboardContainer) {
    dashboardContainer.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  marketplace.fetchTrades()

  const dashboardContainer = document.getElementById('dashboard-scroll-container')

  if (dashboardContainer) {
    dashboardContainer.addEventListener('scroll', handleScroll)
  } else {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="marketplace">
    <h1>Cards Marketplace</h1>

    <div v-if="marketplace.loading">
      Acordando servidor... isso pode levar alguns segundos ☕
    </div>

    <div v-else-if="marketplace.error" class="state error">
      {{ marketplace.error }}
    </div>

    <div v-else-if="marketplace.trades.length === 0" class="state">
      Nenhuma troca disponível
    </div>

    <div v-else class="trade-grid">
      <TradeCard v-for="trade in marketplace.trades" :key="trade.id" :trade="trade" />
    </div>

    <div v-if="marketplace.more" class="load-more">
      <button type="button" @click="handleLoadMore">
        Carregar mais
      </button>
    </div>
  </div>
  <Transition name="fade">
    <button v-if="showScrollTop" class="scroll-top" @click="scrollToTop" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  </Transition>
</template>