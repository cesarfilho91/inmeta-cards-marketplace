<script setup lang="ts">
import { onMounted } from 'vue'
import { useMarketplaceStore } from '../store/marketplace.store'

const marketplace = useMarketplaceStore()

onMounted(() => {
  marketplace.fetchTrades()
})
</script>

<template>
  <div class="marketplace">
    <h1>Marketplace</h1>

    <div v-if="marketplace.loading">Acordando servidor... isso pode levar alguns segundos ☕</div>

    <div v-else-if="marketplace.trades.length === 0">
      Nenhuma troca disponível
    </div>

    <div v-else>
      <div v-for="trade in marketplace.trades" :key="trade.id">
        {{ trade.user.name }}
      </div>
    </div>
  </div>
</template>