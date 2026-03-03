import { getPracticesData } from "~/utils/practices"
import { kv } from '@nuxthub/kv'

interface Practices {
  fetched: number
  data: object
}


export default defineEventHandler(async (event) => {
  const practices = await kv.get<Practices>('practices')
  // console.log('practices data from KV:', practices)
  if (practices) {
    if (Array.isArray(practices.data) && practices.data.length > 0 && Date.now() - practices.fetched < 24 * 60 * 60 * 1000) {
      return practices.data
    } else {
      console.log('practices data in KV is invalid or too old, fetching from file')
    }
  }
  try {
    const data = await getPracticesData()
    await kv.set('practices', { data, fetched: Date.now() }, { ttl: 24 * 60 * 60 })
    return data
  }
  catch (e) {
    console.error('Error getting practices data', e)
  }
  return []
})
