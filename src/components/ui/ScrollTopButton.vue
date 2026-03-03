<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)

const getContainer = () => {
    return document.getElementById('dashboard-scroll-container')
}

const handleScroll = () => {
    const container = getContainer()

    if (container) {
        show.value = container.scrollTop > 300
    } else {
        show.value = window.scrollY > 300
    }
}

const scrollToTop = () => {
    const container = getContainer()

    if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

onMounted(() => {
    const container = getContainer()

    if (container) {
        container.addEventListener('scroll', handleScroll)
    } else {
        window.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    const container = getContainer()

    if (container) {
        container.removeEventListener('scroll', handleScroll)
    } else {
        window.removeEventListener('scroll', handleScroll)
    }
})
</script>

<template>
    <Transition name="scroll-fade">
        <button v-if="show" class="scroll-top" @click="scrollToTop" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <polyline points="18 15 12 9 6 15" />
            </svg>
        </button>
    </Transition>
</template>

<style scoped>
.scroll-fade-enter-active,
.scroll-fade-leave-active {
    transition: all 0.25s ease;
}

.scroll-fade-enter-from,
.scroll-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.scroll-fade-enter-to,
.scroll-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.scroll-top {
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--text-secondary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-soft);
    cursor: pointer;
    z-index: 999;
    transition: all 0.2s ease;
}

.scroll-top:hover {
    background: var(--text-primary);
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.25);
}

.dark .scroll-top {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}
</style>