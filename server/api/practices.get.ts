import { getPracticesData } from "~/utils/practices"


export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context
  const practices = await cloudflare.env.KV.get('practices', 'json')
  console.log('practices data from KV:', practices)
  if (practices) {
    if (Array.isArray(practices.data) && practices.data.length > 0 && Date.now() - practices.fetched < 24 * 60 * 60 * 1000) {
      return practices.data
    } else {
      console.log('practices data in KV is invalid or too old, fetching from file')
    }
  }
  try {
    const data = await getPracticesData()
    await cloudflare.env.KV.put('practices', JSON.stringify({ data, fetched: Date.now() }), { expirationTtl: 24 * 60 * 60 })
    return data
  }
  catch (e) {
    console.error('Error getting practices data', e)
  }
  return []
})
