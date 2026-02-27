<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMarketplaceStore } from '../store/marketplace.store'
import TradeCard from '../components/TradeCard.vue'

const marketplace = useMarketplaceStore()

const handleLoadMore = async () => {
  const scrollPosition = window.scrollY
  await marketplace.loadNextPage()
  window.scrollTo({ top: scrollPosition })
}

const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  marketplace.fetchTrades()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="marketplace">
    <h1>Marketplace</h1>

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

<style scoped>
.marketplace {
  padding: 24px;
}

.trade-grid {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.state {
  margin-top: 20px;
  font-size: 14px;
  opacity: 0.8;
}

.state.error {
  color: #c0392b;
}

.load-more {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.load-more button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.load-more button:hover {
  background: #1d4ed8;
}

.scroll-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 18px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, background 0.2s ease;
}

.scroll-top:hover {
  transform: translateY(-3px);
  background: rgba(0, 0, 0, 0.7);
}
</style>