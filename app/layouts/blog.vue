<template>
  <div class="blog-page">
    <NuxtLink :to="localePath('/')" class="back-pill">
      <span class="back-arrow">&larr;</span>
      <span>{{ $t('Etusivulle') }}</span>
    </NuxtLink>
    <main class="blog-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700;800&display=swap');
</style>

<style scoped>
.blog-page {
  --bg: #151515;
  --text: #ededed;
  --dim: rgba(237, 237, 237, 0.58);
  background: var(--bg);
  color: var(--text);
  font-family: 'Nunito Sans', sans-serif;
  min-height: 100vh;
}

.back-pill {
  position: fixed;
  top: 1rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem 0.45rem 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.2s, background 0.2s;
}

.back-pill:hover {
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
}

.back-arrow {
  font-size: 1rem;
}

.blog-main {
  max-width: 720px;
  margin: 0 auto;
  padding: 4rem 2rem 6rem;
}
</style>
