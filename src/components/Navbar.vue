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

<style scoped>
.navbar {
  height: 60px;
  background: #111827;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

button {
  background: #ef4444;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>