<template>
  <slot :name="locale" />
</template>

<script setup lang="ts">
const { locale } = useI18n()
</script>
