<script setup lang="ts">
defineProps<{
  type: 'error' | 'success'
  message: string
}>()
</script>

<template>
  <div :class="['alert', type]">
    <span class="icon">
      {{ type === 'error' ? '✖' : '✔' }}
    </span>
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.error {
  background: #fdecea;
  color: #c0392b;
  border: 1px solid #f5c6cb;
}

.success {
  background: #eafaf1;
  color: #27ae60;
  border: 1px solid #c3e6cb;
}

.icon {
  font-weight: bold;
}
</style>