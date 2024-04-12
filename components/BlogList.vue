<template>
  <div
    v-for="post in blogPosts"
    :key="post.id"
    :class="$attrs.class"
  >
    <slot :post="post">
      <BlogListItem :post="post" />
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  limit?: number
}>()

const { locale } = useI18n()

const { data } = await useAsyncData('all-blogposts', () => queryContent(locale.value, 'blog').where({
  $and: [
    {
      _file: {
        $ne: '_dir.yml',
      },
    },
    {
      published: true,
    },
  ],
}).sort({ date: -1 }).find(), { watch: [locale] })
const blogPosts = computed(() => {
  if (!data.value)
    return []
  return data.value
    .slice(0, props.limit)
    .map((p: any) => makeBLogPost(p))
})
</script>
