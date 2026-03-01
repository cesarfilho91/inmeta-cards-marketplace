<script setup lang="ts">
import '@/assets/styles/dashboard.css'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useRouter } from 'vue-router'

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

</script>

<template>
  <div class="app-layout">

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <img src="@/assets/images/logo.png" />
        <span>Cards</span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard/marketplace" class="nav-item" @click="closeSidebar">
          Dashboard
        </router-link>

        <router-link to="/cards" class="nav-item" @click="closeSidebar">
          Cards
        </router-link>
      </nav>
    </aside>

    <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- MAIN AREA -->
    <div class="main-area">

      <!-- NAVBAR -->
      <header class="navbar">

        <button class="menu-btn" @click="sidebarOpen = !sidebarOpen">
          <span :class="{ open: sidebarOpen }"></span>
        </button>

        <button class="theme-toggle" @click="toggleTheme">
          {{ darkMode ? '☀️' : '🌙' }}
        </button>

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

      <!-- CONTENT -->
      <main class="content" id="dashboard-scroll-container">
        <transition name="fade-slide" mode="out-in">
          <router-view />
        </transition>
      </main>

    </div>
  </div>
</template>