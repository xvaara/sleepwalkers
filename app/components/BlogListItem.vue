<template>
  <NuxtLink :to="post.url" class="no-underline">
    <UCard class="mb-3">
      <BlogImage :src="post.image" class="w-full rounded" :alt="post.alt" />

      <div class="mt-3">
        <h5 class="font-semibold">
          {{ post.title }}
        </h5>
        <p>
          {{ post.description }}
        </p>
        <p>
          <small class="text-gray-500 dark:text-gray-400">{{ new Date(post.date).toLocaleDateString(locale) }}</small>
        </p>
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const props = defineProps<{
  post: BlogPost
}>()

const { locale } = useI18n()
</script>
