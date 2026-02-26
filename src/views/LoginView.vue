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

const formError = ref('')

const toast = useToastStore()

function validateForm(): boolean {
  formError.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email.value)) {
    formError.value = 'Digite um email válido'
    return false
  }

  if (password.value.length < 6) {
    formError.value = 'A senha deve ter no mínimo 6 caracteres'
    return false
  }

  return true
}

async function handleLogin() {
  if (auth.loading) return

  if (!validateForm()) return

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
      <img src="@/assets/images/logo.png" class="auth-logo" />
      <h1>Login</h1>

      <input
        v-model.trim="email"
        type="email"
        placeholder="Email"
        required
      />

      <input
        v-model.trim="password"
        type="password"
        placeholder="Senha"
        required
      />
      
      <p v-if="formError" class="form-error">
        {{ formError }}
      </p>

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