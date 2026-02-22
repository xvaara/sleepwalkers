<template>
  <ClientOnly>
    <RealContacts>
      <slot />
    </RealContacts>
  </ClientOnly>
</template>

<script setup>
import RealContacts from './RealContacts.vue'
</script>
