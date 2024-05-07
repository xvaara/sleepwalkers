import { getPracticesData } from '../../utils/practices'
import { getIgData } from '../../utils/ig'

export default eventHandler(async (event) => {
  const params = getQuery(event)
  appendResponseHeaders(event, {
    'cache-control': 'no-cache',
  })
  const { resetSecret } = useRuntimeConfig(event)
  if (params?.secret !== resetSecret && resetSecret !== '')
    return { message: 'Invalid secret' }
  const ig = await getIgData()
  const practices = await getPracticesData()
  // TODO: update the database somewhere

  return { message: 'Resetting the database', ig, practices }
})
