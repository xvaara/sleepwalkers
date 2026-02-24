<template>
  <slot name="default" v-if="locale === 'fi'" />
  <slot name="en" v-else-if="locale === 'en'"  />
</template>

<script setup lang="ts">
const { locale } = useI18n()
</script>
