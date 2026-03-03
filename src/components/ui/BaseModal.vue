<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

interface Props {
    modelValue: boolean
    title?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

function close() {
    emit('update:modelValue', false)
}

function handleEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
}

onMounted(() => {
    window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEsc)
})
</script>

<template>
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-base">
            <header v-if="title" class="modal-header">
                <h3>{{ title }}</h3>
            </header>

            <section class="modal-body">
                <slot />
            </section>

            <footer v-if="$slots.actions" class="modal-footer">
                <slot name="actions" />
            </footer>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-base {
    background: var(--bg-navbar) !important;
    padding: 24px !important;
    border-radius: 16px !important;
    width: 400px !important;
    max-width: 90% !important;
    animation: fadeIn 0.2s ease !important;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2) !important;
}

.modal-header {
    margin-bottom: 10px;
}

.modal-body {
    opacity: 0.8;
}

.modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.modal-footer button {
    cursor: pointer;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>