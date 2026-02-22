<template>
  <div
    v-for="post in blogPosts"
    :key="post.id"
    :class="props.class"
  >
    <slot :post="post">
      <BlogListItem :post="post" />
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  limit?: number
  search?: string
  class?: string
}>()

const { locale } = useI18n()

const { data } = await useAsyncData(() => `all-blogposts-${locale.value}`, () => queryCollection('blog')
  .where('path', 'LIKE', `/${locale.value}/blog%`)
  .andWhere(query => query.where('published', '=', true))
  .order('date', 'DESC')
  .all())

const blogPosts = computed(() => {
  if (!data.value)
    return []
  return data.value
    .filter((p: any) => !props.search || Object.entries(p).some(([_, value]) => {
      if (typeof value !== 'string')
        return false
      return value.toLowerCase().includes(props.search?.toLowerCase() ?? '')
    }))
    .slice(0, props.limit)
    .map((p: any) => makeBLogPost(p))
})
</script>
