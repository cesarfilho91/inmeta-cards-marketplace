<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { getFriendlyError } from '@/utils/errorMapper'
import { useFormValidation } from '@/composables/useFormValidation'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')


const{
  error: formError,
  reset,
  required,
  email: validateEmail,
  minLength,
  match
} = useFormValidation()

function validateForm(): boolean {
  reset()

  if (!required(name.value, 'O nome é obrigatório')) return false
  if (!validateEmail(email.value)) return false
  if (!minLength(password.value, 6)) return false
  if (!match(password.value, confirmPassword.value, 'As senhas não coincidem')) return false

  return true
}

const handleRegister = async () => {
  if (authStore.loading) return

  if (!validateForm()) return

  try {
    await authStore.register(
      name.value.trim(),
      email.value.trim(),
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
          v-model.trim="name"
          type="text"
          placeholder="Nome"
          required
        />

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

        <input
          v-model.trim="confirmPassword"
          type="password"
          placeholder="Confirmar Senha"
          required
        />

      <p v-if="formError" class="form-error">
        {{ formError }}
      </p>

        <button
          type="submit"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <p class="redirect">
        Já tem conta?
        <router-link to="/">Entrar</router-link>
      </p>
    </div>
  </div>
</template>