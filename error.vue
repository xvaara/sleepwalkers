<script setup lang="ts">
import type { NuxtError } from '#app'
import DefaultLayout from '~/layouts/default.vue'

const _props = defineProps({
  error: { type: Object as () => NuxtError, required: true },
})

const { locale } = useI18n()

const handleError = () => clearError({ redirect: `/${locale.value}` })
</script>

<template>
  <DefaultLayout>
    <div class="content text-center">
      <h2>{{ error.statusCode }}</h2>
      <h3>{{ error.statusMessage }}</h3>
      <p>{{ error.message }}</p>
      <a :href="`/${locale}`" @click.prevent="handleError">
        {{ $t('Etusivulle') }}
      </a>
    </div>
  </DefaultLayout>
</template>
