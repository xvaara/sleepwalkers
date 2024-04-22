import { getPracticesData } from './practices'
import { getIgData } from './ig'

export default eventHandler(async (event) => {
  const params = getQuery(event)
  appendResponseHeaders(event, {
    'cache-control': 'no-cache',
  })
  const { resetSecret } = useRuntimeConfig(event)
  if (params?.secret !== resetSecret && resetSecret !== '')
    return { message: 'Invalid secret' }
  const db = hubDatabase()
  const ig = await getIgData(db)
  const practices = await getPracticesData(db)
  const results = await db.prepare('SELECT updated_at from documents').run()

  return { message: 'Resetting the database', results, ig, practices }
})
