<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast.store'
import { getFriendlyError } from '@/utils/errorMapper'
import '@/assets/styles/login.css'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const toast = useToastStore()

async function handleLogin() {
  try {
    await auth.login(email.value, password.value)

    toast.success('Login realizado com sucesso!')
    router.push('/')
  } catch {
    toast.error(getFriendlyError(auth.error))
  }
}

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

      
    </form>
  </div>
</template>