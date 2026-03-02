<script setup lang="ts">
import '@/assets/styles/dashboard.css'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useRouter } from 'vue-router'
import { LayoutDashboard, CreditCard, Moon, Sun, RefreshCcw } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const dropdownOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const sidebarOpen = ref(false)

const isMobile = ref(window.innerWidth <= 768)

const darkMode = ref(localStorage.getItem('theme') === 'dark')

function toggleTheme() {
  darkMode.value = !darkMode.value
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  document.documentElement.classList.toggle('dark', darkMode.value)
}

onMounted(() => {
  applyTheme()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

function handleResize() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

function closeSidebar() {
  sidebarOpen.value = false
}

function handleLogout() {
  dropdownOpen.value = false
  auth.logout()
  router.replace('/')
}

const userInitial = computed(() => {
  if (!auth.user?.name) return '?'
  return auth.user.name.charAt(0).toUpperCase()
})

function handleClickOutside(event: MouseEvent) {
  if (
    userMenuRef.value &&
    !userMenuRef.value.contains(event.target as Node)
  ) {
    dropdownOpen.value = false
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})

function refreshPage() {
  window.location.reload()
}
</script>

<template>
  <div class="app-layout">

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <img src="@/assets/images/logo.png" />
        <span>Cards</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/dashboard/marketplace" class="nav-item" @click="closeSidebar">
          <LayoutDashboard class="icon" />
          <span>Dashboard</span>
        </RouterLink>

        <RouterLink to="/dashboard/cards" class="nav-item" @click="closeSidebar">
          <CreditCard class="icon" />
          <span>Minhas Cartas</span>
        </RouterLink>

        <RouterLink to="/dashboard/create-trade" class="nav-item" @click="closeSidebar">
          <span>Criar Troca</span>
        </RouterLink>
      </nav>
    </aside>

    <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <div class="main-area">

      <header class="navbar">

        <button class="menu-btn" @click="sidebarOpen = !sidebarOpen">
          <span :class="{ open: sidebarOpen }"></span>
        </button>

        <div class="header-actions">
          <button class="theme-toggle" @click="toggleTheme">
            <Sun v-if="darkMode" :size="20" />
            <Moon v-else :size="20" />
          </button>

          <button class="icon-btn" @click="refreshPage">
            <refresh-ccw :size="20" />
          </button>
        </div>

        <div class="user-wrapper" ref="userMenuRef" @click.stop="dropdownOpen = !dropdownOpen">

          <div class="avatar">
            {{ userInitial }}
          </div>

          <div class="user-info">
            <span class="user-name">
              {{ auth.user?.name }}
            </span>
          </div>

          <div v-if="dropdownOpen" class="dropdown">
            <button @click.stop="handleLogout">
              Sair
            </button>
          </div>
        </div>

      </header>

      <main class="content" id="dashboard-scroll-container">
        <transition name="fade-slide" mode="out-in">
          <router-view />
        </transition>
      </main>

    </div>
  </div>
</template>