import { readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getIgData } from './app/utils/ig'
import { getPracticesData } from './app/utils/practices'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    resetSecret: '',
  },
  hooks: {
    'build:before': async (nuxt) => {
      console.log('Building gallery json...')
      const files = await readdir('public/images/gallery')
      const images = files.filter(i => i.match(/\.(jpeg|jpg|gif|png)/) !== null).map(i => `/images/gallery/${i}`)
      const target = path.join('public', 'images/gallery.json')
      await writeFile(target, JSON.stringify(images, null, 2))

      // try {
      //   const igPath = path.join('public', 'data', 'ig.json')
      //   let skipIg = false
      //   try {
      //     const igStat = await stat(igPath)
      //     if (Date.now() - igStat.mtimeMs < 24 * 60 * 60 * 1000) {
      //       console.log('ig.json is less than 24h old, skipping fetch')
      //       skipIg = true
      //     }
      //   }
      //   catch {}
      //   if (!skipIg) {
      //     console.log('get ig...')
      //     let ig = null
      //     for (let attempt = 1; attempt <= 4; attempt++) {
      //       const timeStart = Date.now()
      //       ig = await getIgData()
      //       const timeDiff = Date.now() - timeStart
      //       console.log(`Attempt ${attempt} took ${timeDiff}ms`)
      //       if (Array.isArray(ig) && ig.length > 0) {
      //         console.log(`got ig data on attempt ${attempt}`, ig.length)
      //         await writeFile(igPath, JSON.stringify(ig, null, 2))
      //         break
      //       }
      //       else {
      //         console.warn(`Attempt ${attempt} failed to get ig data`, ig)
      //       }
      //     }
      //     if (!Array.isArray(ig) || ig.length === 0)
      //       console.error('Error getting ig data after 4 attempts', ig)
      //   }
      // }
      // catch (e) {
      //   console.error('Error getting ig data', e)
      // }
      try {
        const practicesPath = path.join('public', 'data', 'practices.json')
        let skipPractices = false
        try {
          const pStat = await stat(practicesPath)
          if (Date.now() - pStat.mtimeMs < 24 * 60 * 60 * 1000) {
            console.log('practices.json is less than 24h old, skipping fetch')
            skipPractices = true
          }
        }
        catch {}
        if (!skipPractices) {
          console.log('get practices...')
          const practices = await getPracticesData()
          await writeFile(practicesPath, JSON.stringify(practices, null, 2))
        }
      }
      catch (e) {
        console.error('Error getting practices data', e)
      }
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width,initial-scale=1',
      title: 'Sleepwalkers',
      titleTemplate: '%s - Sleepwalkers',
      meta: [{ name: 'description', content: 'Sleepwalkers ultimate in Jyväskylä' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  sitemap: {
    // strictNuxtContentPaths: true,
    exclude: ['/blog-arkisto/**'],
    include: ['/**'],
  },
  site: {
    url: 'https://sleepwalkers.fi',
    name: 'Sleepwalkers ultimate ry',
    identity: {
      type: 'organization',
    },
    instagram: 'https://www.instagram.com/sleepwalkersultimate/',
    facebook: 'https://www.facebook.com/sleepwalkersultimate',
  },

  typescript: {
    strict: true,
  },
  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
    },
    publicAssets: [
      {
        baseURL: 'images',
        dir: path.join(__dirname, `public/images`),
        // maxAge: 60 * 60 * 24 * 31, // 31 days
      },
      {
        baseURL: 'data',
        dir: path.join(__dirname, `public/data`),
        // maxAge: 60 * 60 * 24 * 31, // 31 days
      },
      {
        baseURL: 'files',
        dir: path.join(__dirname, `public/files`),
        // maxAge: 60 * 60 * 24 * 31, // 31 days
      },

    ],
  },
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    'nuxt-studio',
    '@nuxt/ui',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
  },
  i18n: {
    locales: ['fi', 'en'], // used in URL path prefix
    defaultLocale: 'fi', // default locale of your project for Nuxt pages and routings
    strategy: 'prefix',
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
    },
    experimental: {
      localeDetector: 'localeDetector.ts'
    }
  },
  // routeRules: {
  //   '/': { prerender: false },
  //   '/fi': { prerender: true },
  //   '/en': { prerender: true },
  // },
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    renderer: {
      anchorLinks: false,
    },
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },
  image: {
    screens: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },
  features: {
    inlineStyles: false,
  },
  ssr: true,
  // target: 'static',
  vite: {
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
  },
  studio: {
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'xvaara',
      repo: 'sleepwalkers',
      branch: 'main',
      private: false,
    },
  },
  compatibilityDate: '2025-04-29',
})
