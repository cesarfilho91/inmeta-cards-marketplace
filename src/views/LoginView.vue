<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import AlertMessage from '@/components/AlertMessage.vue'
import '@/assets/styles/login.css'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch {
    // erro já tratado na store
  }
}

watch(email, () => auth.error && (auth.error = null))
watch(password, () => auth.error && (auth.error = null))
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-card">
      <h1>Login</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Senha"
        required
      />

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p class="redirect">
        Não tem conta?
        <router-link to="/register">Criar conta</router-link>
      </p>

      <AlertMessage
        v-if="auth.error"
        type="error"
        :message="auth.error"
      />
    </form>
  </div>
</template>