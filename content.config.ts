import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: [
          '**/blog/*.md',
        ],
      },

    }),
    blog: defineCollection({
      type: 'page',
      source: '**/blog/*.md',

      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.date(),
        published: z.boolean(),
        alt: z.string(),
        ogImage: z.string(),

      }),
    }),
    data: defineCollection({
      type: 'page',
      source: '**/*.yml',
      schema: z.object({
        links: z.object({
          // facebook: z.string(),
          // instagram: z.object({
          //   text: z.string(),
          //   link: z.string(),

          // }),
          // email: z.object({
          //   text: z.string(),
          //   link: z.string(),
          // }),
        }),
      }),
    }),
  },
})
