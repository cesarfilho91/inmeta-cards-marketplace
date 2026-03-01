<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useRouter } from 'vue-router'
import '@/assets/styles/public.css'

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.isAuthenticated)

function goToDashboard() {
    router.push('/dashboard')
}
</script>

<template>
    <div class="public-layout">
        <header class="public-header">
            <div class="container header-content">
                <router-link to="/" class="logo">
                    <img src="@/assets/images/logo.png" alt="Card Marketplace Logo" />
                </router-link>

                <div class="actions">
                    <template v-if="!isAuthenticated">
                        <router-link to="/login" class="btn btn-outline">
                            Entrar
                        </router-link>

                        <router-link to="/register" class="btn btn-primary">
                            Criar conta
                        </router-link>
                    </template>

                    <template v-else>
                        <button class="btn btn-primary" @click="goToDashboard">
                            Ir para Dashboard
                        </button>
                    </template>
                </div>
            </div>
        </header>

        <main class="public-content container">
            <router-view />
        </main>
    </div>
</template>