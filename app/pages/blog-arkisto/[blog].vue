<template>
  <div>
    <template v-if="postData">
      <UCard class="mb-3">
        <div class="flex justify-between items-end">
          <NuxtLink :to="prev?.path">
            <UIcon name="i-lucide-chevron-left" />{{ $t('Edellinen') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/blog-arkisto')" class="text-center">
            <UIcon name="i-lucide-chevron-up" /><br>
            {{ $t('Takaisin') }}
          </NuxtLink>
          <NuxtLink :to="next?.path">
            {{ $t('Seuraava') }}<UIcon name="i-lucide-chevron-right" />
          </NuxtLink>
        </div>
      </UCard>
      <h2>{{ data.title }}</h2>
      <p>{{ new Date(data.date).toLocaleDateString(locale) }}</p>
      <BlogImage v-if="showDefaultImage" :src="data.image" />
      <div>
        <ContentRenderer :value="postData">
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </div>
    </template>
    <div v-else>
      <p class="text-center">
        {{ $t('404 Not Found') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types/blog'

const localePath = useLocalePath()
const { path } = useRoute()
const { locale } = useI18n()

const { data: postData } = await useAsyncData(() => `blog-post-${path}`, () => queryCollection('blog').path(path.replace(`/${locale.value}/`, '/')).first())
const [prev, next] = await queryCollectionItemSurroundings('blog', path)
  .where('path', 'LIKE', `/blog-arkisto%`)
  .andWhere(query => query.where('published', '=', true))
  .order('date', 'ASC')

if (!postData.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'Blog post not found',
  })
}

setTimeout(() => {
  console.log(postData.value)
}, 1000)

const data = computed<BlogPost>(() => {
  return makeBLogPost(postData)
})

const showDefaultImage = computed(() => postData.value?.image && !JSON.stringify(postData.value?.body).includes(postData.value?.image))

useHead({
  title: data.value.title || '',
  meta: [
    { name: 'description', content: data.value.description },
    {
      name: 'description',
      content: data.value.description,
    },
    { property: 'og:site_name', content: 'Sleepwalkers ultimate' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: `https://sleepwalkers.fi/${path}`,
    },
    {
      property: 'og:title',
      content: data.value.title,
    },
    {
      property: 'og:description',
      content: data.value.description,
    },
    {
      property: 'og:image',
      content: data.value.ogImage.startsWith('http') ? data.value.ogImage : `https://sleepwalkers.fi/${data.value.ogImage}`,
    },
    { name: 'twitter:site', content: '@qdnvubp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: `https://sleepwalkers.fi/${path}`,
    },
    {
      name: 'twitter:title',
      content: data.value.title,
    },
    {
      name: 'twitter:description',
      content: data.value.description,
    },
    {
      name: 'twitter:image',
      content: data.value.ogImage.startsWith('http') ? data.value.ogImage : `https://sleepwalkers.fi/${data.value.ogImage}`,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://sleepwalkers.fi/${path}`,
    },
  ],
})
</script>
