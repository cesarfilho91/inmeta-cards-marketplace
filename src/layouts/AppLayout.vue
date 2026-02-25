<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="logo">
      TradeApp
    </div>

    <div class="actions">
      <span v-if="authStore.user">
        👤 {{ authStore.user.name }}
      </span>

      <button @click="logout">
        Sair
      </button>
    </div>
  </nav>
</template>