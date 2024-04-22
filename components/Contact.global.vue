<template>
  <div class="">
    <ul>
      <li v-for="(item, key) in data.links" :key="key">
        <b>
          {{ $t(key) }}
        </b>

        <template v-if="typeof item === 'string'">
          {{ null }}
          <a :href="item">
            {{ item }}
          </a>
        </template>
        <template v-else>
          {{ item.pretext ? ` ${item.pretext}` : ' ' }} <a :href="item.link">{{ item.text }}</a> {{ item.posttext }}
        </template>
      </li>
    </ul>
    <ContentRenderer :value="data">
      <template #empty />
    </ContentRenderer>
  </div>
</template>

<script setup>
const { data } = await useAsyncData(`contact`, () => queryContent('/contact').findOne())
</script>
