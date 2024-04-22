<template>
  <div>
    <div class="row">
      <div class="col">
        <ContentRenderer v-if="page" :value="page">
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </div>
      <div class="col">
        <h4>
          {{ $t('Seuraavat harjoitukset') }}
        </h4>
        <Practices />
      </div>
    </div>
    <div class="row">
      <div v-for="(practice, index) in practices" :key="practice._id" class="col-12">
        <div class="card mb-3 shadow">
          <div class="d-flex" :class="(index % 2) === 0 ? 'flex-lg-row-reverse' : ''">
            <div class="col-12 col-lg-6">
              <div class="card-header">
                <h4>
                  {{ practice.time }} – {{ practice.title }}
                </h4>
              </div>
              <div class="card-body">
                <p>{{ practice.location }}</p>
                <ContentRenderer :value="practice" />
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div v-if="practice.map" class="container-iframe rounded-bottom rounded-bottom-lg-0" :class="(index % 2) === 0 ? 'rounded-start-lg' : 'rounded-end-lg'" v-html="practice.map" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <ContentRenderer v-if="postData" :value="postData">
        <template #empty>
          <p>No content found.</p>
        </template>
      </ContentRenderer> -->
  </div>
</template>

<script setup lang="ts">
const { path } = useRoute()

const { data, error } = await useAsyncData(`practices-${path}`, () => queryContent(path).find())

const page = computed(() => {
  return data.value?.find(item => item._file?.match(/index\.md/)) || {}
})
const practices = computed(() => {
  return data.value?.filter(item => !item._file?.match(/index\.md/))
})
</script>

<style lang="scss">
.container-iframe {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
