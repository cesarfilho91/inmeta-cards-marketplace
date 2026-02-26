<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { getFriendlyError } from '@/utils/errorMapper'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref<string | null>(null)

const handleRegister = async () => {
  localError.value = null

  if (password.value !== confirmPassword.value) {
    toast.error('As senhas não coincidem')
    return
  }

  try {
    await authStore.register(
      name.value,
      email.value,
      password.value
    )

    toast.success('Conta criada com sucesso!')
    router.push('/login')
  } catch {
    toast.error(getFriendlyError(authStore.error))
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <img src="@/assets/images/logo.png" class="auth-logo" />
      <h2>Criar Conta</h2>

      <form @submit.prevent="handleRegister">
        <input
          v-model="name"
          type="text"
          placeholder="Nome"
          required
        />

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

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirmar Senha"
          required
        />

        <button
          type="submit"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <p v-if="localError" class="error">
        ❌ {{ localError }}
      </p>

      <p class="redirect">
        Já tem conta?
        <router-link to="/">Entrar</router-link>
      </p>
    </div>
  </div>
</template>