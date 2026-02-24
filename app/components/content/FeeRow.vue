<template>
  <div class="fee-row">
    <span class="fee-amount">{{ amount }}</span>
    <div class="fee-desc"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  amount: string
}>()
</script>

<style scoped>
.fee-row {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid rgba(237, 237, 237, 0.07);
}

.fee-row:last-child {
  border-bottom: 1px solid rgba(237, 237, 237, 0.07);
}

.fee-amount {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--accent);
  min-width: 120px;
  flex-shrink: 0;
}

.fee-desc {
  font-size: 0.88rem;
  color: var(--dim);
}

.fee-desc :deep(p) {
  margin: 0;
}

@media (max-width: 768px) {
  .fee-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .fee-amount {
    min-width: unset;
  }
}
</style>
