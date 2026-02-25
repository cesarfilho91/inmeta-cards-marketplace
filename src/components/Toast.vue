<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store'

const toastStore = useToastStore()
</script>

<template>
  <div class="toast-container">
    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :class="['toast', toast.type]"
    >
      <span class="icon">
        {{ toast.type === 'success' ? '✔' : '✖' }}
      </span>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  min-width: 250px;
  color: white;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
}

.success {
  background: #27ae60;
}

.error {
  background: #e74c3c;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>