<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <ContentRenderer v-if="page" :value="page">
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </div>
      <div>
        <h4>
          {{ $t('Seuraavat harjoitukset') }}
        </h4>
        <Practices />
      </div>
    </div>
    <div class="space-y-4 mt-4">
      <div v-for="(practice, index) in practices" :key="practice.id">
        <UCard>
          <div class="flex flex-col" :class="(index % 2) === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'">
            <div class="w-full lg:w-1/2 p-4">
              <h4>
                {{ practice.meta.time }} – {{ practice.title }}
              </h4>
              <p>{{ practice.meta.location }}</p>
              <ContentRenderer :value="practice" />
            </div>
            <div class="w-full lg:w-1/2">
              <div v-if="practice.meta.map" class="container-iframe rounded-b lg:rounded-b-none" :class="(index % 2) === 0 ? 'lg:rounded-l' : 'lg:rounded-r'" v-html="practice.meta.map" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { path } = useRoute()

const { data } = await useAsyncData(() => `practices-${path}`, () => queryCollection('content').where('path', 'LIKE', `${path}%`).all())
const page = computed(() => {
  return data.value?.find(item => item.id?.match(/index\.md/)) || {}
})
const practices = computed(() => {
  return data.value?.filter(item => !item.id?.match(/index\.md/))
})
</script>

<style>
.container-iframe {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding-top: 56.25%;
}
.container-iframe iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
