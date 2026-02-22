<template>
  <div class="">
    <ul v-if="!!data?.links">
      <li v-for="(item, key, index) in data.links" :key="index">
        <b>
          {{ $t(key) }}
        </b>

        <span v-if="typeof item === 'string'">
          {{ null }}
          <a :href="item">
            {{ item }}
          </a>
        </span>
        <span v-else>
          {{ item.pretext ? ` ${item.pretext}` : ' ' }} <a :href="item.link">{{ item.text }}</a> {{ item.posttext }}
        </span>
      </li>
    </ul>
    <slot />
  </div>
</template>

<script setup>
const { data } = await useAsyncData(`contact`, async () => await queryCollection('data').path('/contact').first())

// const data = {}
</script>
