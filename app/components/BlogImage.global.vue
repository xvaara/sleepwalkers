<template>
  <figure v-if="$slots.default">
    <NuxtPicture :src="props.src" :alt="props.alt" :img-attrs="{ class: `w-full ${props.class}` }" />
    <figcaption class="text-sm text-gray-500 dark:text-gray-400 text-end mt-1">
      <slot />
    </figcaption>
  </figure>
  <NuxtPicture v-else :src="props.src" :alt="props.alt" :img-attrs="{ class: `w-full ${props.class}` }" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  class?: string
}>(), {
  src: '/not-found.jpg',
  alt: '',
  class: '',
})
</script>
