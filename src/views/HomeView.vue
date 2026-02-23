<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

console.log('Está autenticado?', auth.isAuthenticated)
</script>

<template>
  <div>
    <h1>Home</h1>
  </div>
</template>