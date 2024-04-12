<template>
  <NuxtPicture :src="props.src" :alt="props.alt" :img-attrs="{ class: `img-fluid w-100 ${props.class}` }" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  class: string
}>(), {
  src: '/not-found.jpg',
  alt: '',
  class: '',
})
</script>
