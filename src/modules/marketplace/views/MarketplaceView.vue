<script setup lang="ts">
import { onMounted } from 'vue'
import { useMarketplaceStore } from '../store/marketplace.store'
import TradeCard from '../components/TradeCard.vue'
import ScrollTopButton from '@/components/ui/ScrollTopButton.vue'
import TradeCardSkeleton from '../components/TradeCardSkeleton.vue'
import '@/assets/styles/marketplace.css'

const marketplace = useMarketplaceStore()

const handleLoadMore = async () => {
  const dashboardContainer = document.getElementById('dashboard-scroll-container')

  const scrollPosition = dashboardContainer
    ? dashboardContainer.scrollTop
    : window.scrollY

  await marketplace.loadNextPage()

  requestAnimationFrame(() => {
    if (dashboardContainer) {
      dashboardContainer.scrollTo({ top: scrollPosition })
    } else {
      window.scrollTo({ top: scrollPosition })
    }
  })
}

onMounted(() => {
  marketplace.fetchTrades()
})
</script>

<template>
  <div class="marketplace page-container">
    <h1>Cards Marketplace</h1>

    <div v-if="marketplace.loading" class="trade-grid">
      <TradeCardSkeleton v-for="i in 6" :key="i" />
    </div>

    <div v-else-if="marketplace.error" class="state error">
      {{ marketplace.error }}
    </div>

    <div v-else-if="marketplace.trades.length === 0" class="empty-state">
      <h3>Nenhuma troca disponível</h3>
      <p>Seja o primeiro a criar uma troca.</p>
    </div>

    <div v-else class="trade-grid">
      <TradeCard v-for="trade in marketplace.trades" :key="trade.id" :trade="trade" />
    </div>

    <div v-if="marketplace.more" class="load-more">
      <button type="button" @click="handleLoadMore" :disabled="marketplace.loadingMore">
        <span v-if="!marketplace.loadingMore">
          Carregar mais
        </span>
        <span v-else>
          Carregando...
        </span>
      </button>
    </div>
    <ScrollTopButton />
  </div>
</template>