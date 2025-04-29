import type { BlogPost } from '~/types/blog'

export function makeBLogPost(data: object | Ref): BlogPost {
  const value = unref(data)
  return {
    title: value?.title || 'no-title available',
    description: value?.description || 'no-description available',
    image: value?.image || '/images/sleepwalkers.png',
    alt: value?.alt || 'no alter data available',
    ogImage: value?.ogImage || value?.image || '/images/sleepwalkers.png',
    date: value?.date || 'not-date-available',
    tags: value?.tags || [],
    published: value?.published || false,
    url: value?.path || '/',
    id: value?.id || null,
  }
}
