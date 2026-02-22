<template>
  <div>
    <ContentRenderer v-if="page" :value="page" />
    <div v-else>
      <p class="text-center">
        {{ $t('Ei sisältöä') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'Page not found',
  })
}
</script>
