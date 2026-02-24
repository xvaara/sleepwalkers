<template>
  <div>
    <div>
      <UInput id="blog-search" v-model="search" :placeholder="$t('Hae blogitekstejä')" class="mb-3" />
    </div>
    <BlogList :search="search" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blog' })
const search = ref('')
</script>
