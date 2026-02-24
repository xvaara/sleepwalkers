<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    class="contact-item"
  >
    <img v-if="iconSrc" :src="iconSrc" alt="" class="contact-icon-img">
    <UIcon v-else-if="icon" :name="icon" class="contact-icon" />
    <span class="contact-label">{{ label }}</span>
    <div class="contact-value"><slot /></div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string
  label: string
  external?: boolean
  icon?: string
  iconSrc?: string
}>()
</script>

<style scoped>
.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  text-decoration: none;
  color: #fff;
  transition: background 0.2s;
  min-width: 180px;
}

.contact-item:hover {
  background: rgba(0, 0, 0, 0.3);
}

.contact-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
}

.contact-icon-img {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
  filter: brightness(0) invert(1);
}

.contact-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 0.3rem;
}

.contact-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.contact-value :deep(p) {
  margin: 0;
}

.contact-value :deep(a) {
  color: inherit;
  text-decoration: none;
}
</style>
