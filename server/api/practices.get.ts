import { getPracticesData } from "~/utils/practices"


export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context
  const practices = await cloudflare.env.KV.get('practices', 'json')
  if (practices) {
    if (Array.isArray(practices.data) && practices.data.length > 0 && Date.now() - practices.fetched < 24 * 60 * 60 * 1000) {
      return practices.data
    } else {
      console.log('practices data in KV is invalid or too old, fetching from file')
    }
  }
  try {
    getPracticesData().then(async (practices) => {
      await cloudflare.env.KV.put('practices', JSON.stringify({ data: practices, fetched: Date.now() }), { expirationTtl: 24 * 60 * 60 })
      return practices
    })
  }
  catch (e) {
    console.error('Error getting practices data', e)
  }
  return [] 
})
