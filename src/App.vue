<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/store/auth.store';
import Toast from '@/components/Toast.vue'

const auth = useAuthStore()
</script>

<template>
  <div v-if="auth.initialized">
    <RouterView />
    <Toast />
  </div>

  <div v-else class="app-loading">
    Carregando...
  </div>
</template>