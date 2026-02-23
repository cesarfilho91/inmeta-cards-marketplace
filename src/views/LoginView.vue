<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (err: any) {
    error.value = 'Email ou senha inválidos'
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />

    <button @click="handleLogin" :disabled="auth.loading">
      {{ auth.loading ? 'Entrando...' : 'Entrar' }}
    </button>

    <p v-if="error">{{ error }}</p>
  </div>
</template>