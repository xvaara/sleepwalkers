<template>
  <NuxtLink :to="post.url" class="text-decoration-none">
    <div class="card mb-3" style="">
      <BlogImage :src="post.image" class="card-img-top" :alt="post.alt" />

      <div class="card-body">
        <h5 class="card-title">
          {{ post.title }}
        </h5>
        <p class="card-text">
          {{ post.description }}
        </p>
        <p class="card-text">
          <small class="text-body-secondary">{{ new Date(post.date).toLocaleDateString(locale) }}</small>
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const props = defineProps<{
  post: BlogPost
}>()

const { locale } = useI18n()
</script>
