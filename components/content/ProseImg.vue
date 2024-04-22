<template>
  <figure v-if="caption" class="figure">
    <NuxtPicture :src="props.src" :alt="props.alt" :img-attrs="{ class: `figure-img img-fluid w-100 ${props.class}` }" />
    <figcaption class="figure-caption text-end">
      {{ caption }}
    </figcaption>
  </figure>
  <NuxtPicture v-else :src="props.src" :alt="props.alt" :img-attrs="{ class: `img-fluid w-100 ${props.class}` }" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt?: string
  class?: string
  caption?: string
}>(), {
  src: '/not-found.jpg',
  alt: '',
  class: '',
})
</script>
