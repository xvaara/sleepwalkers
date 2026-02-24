<template>
  <div class="page">
    <!-- TOP BAR -->
    <div class="top-bar-wrap">
      <div class="top-bar">
        <NuxtLink :to="switchLocalePath(otherLocale)" class="lang-toggle" :aria-label="otherLocale === 'en' ? 'English' : 'Suomi'">
          <UIcon name="i-lucide-languages" class="size-[1.1rem]" aria-hidden />
        </NuxtLink>
        <div class="top-social">
          <a href="https://instagram.com/sleepwalkersultimate" target="_blank" rel="noopener" aria-label="Instagram">
            <UIcon name="i-lucide-instagram" class="size-[1.1rem]" aria-hidden />
          </a>
          <a href="https://facebook.com/sleepwalkersultimate" target="_blank" rel="noopener" aria-label="Facebook">
            <UIcon name="i-lucide-facebook" class="size-[1.1rem]" aria-hidden />
          </a>
        </div>
      </div>
    </div>

    <slot />

    <!-- FOOTER -->
    <footer class="page-footer">
      <img src="/images/sleepwalkers-logo.png" alt="Sleepwalkers" class="footer-logo">
      <span class="footer-copy">&copy; Sleepwalkers ry &middot; Jyv&auml;skyl&auml;</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const otherLocale = computed(() => locale.value === 'fi' ? 'en' : 'fi')
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700;800&display=swap');

svg {
  display: inline;
}
</style>

<style scoped>
.page {
  --bg: #151515;
  --bg2: #1b1b1b;
  --text: #ededed;
  --dim: rgba(237, 237, 237, 0.58);
  --accent: #db3931;
  --accent-soft: rgba(219, 57, 49, 0.08);
  background: var(--bg);
  color: var(--text);
  font-family: 'Nunito Sans', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* --- TOP BAR --- */

.top-bar-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
  margin-bottom: -3.5rem;
}

.top-bar {
  pointer-events: auto;
  margin: 1rem 1.5rem 0 0;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lang-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}

.lang-toggle:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.lang-toggle svg {
  width: 16px;
  height: 16px;
}

.top-social {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.top-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s, background 0.2s;
}

.top-social a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.top-social svg {
  width: 16px;
  height: 16px;
}

/* --- FOOTER --- */

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4rem 6rem;
}

.footer-logo {
  /* height: 18px;
  opacity: 0.3;
  filter: brightness(10); */
}

.footer-copy {
  font-size: 0.75rem;
  color: var(--dim);
}

@media (max-width: 768px) {
  .top-bar {
    margin: 0.6rem 0.75rem 0 0;
    gap: 0.2rem;
    padding: 0.25rem 0.35rem;
  }

  .lang-toggle,
  .top-social a {
    width: 26px;
    height: 26px;
  }

  .top-social {
    gap: 0;
  }

  .page-footer {
    padding: 2rem 2rem 6rem;
  }
}
</style>
