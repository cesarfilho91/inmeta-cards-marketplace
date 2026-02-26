<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast.store'
import { getFriendlyError } from '@/utils/errorMapper'
import { useFormValidation } from '@/composables/useFormValidation'
import '@/assets/styles/login.css'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const toast = useToastStore()

const{
  error: formError,
  reset,
  email: validateEmail,
  minLength,
} = useFormValidation()

function validateForm(): boolean {
  reset()

  if (!validateEmail(email.value)) return false
  if (!minLength(password.value, 6)) return false

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