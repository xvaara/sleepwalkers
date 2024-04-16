export default eventHandler(async () => {
  const db = hubDatabase()
  const results = await db.prepare('SELECT data from documents where id = "instagram" and updated_at > datetime("now", "-1 day");').first()
  // console.log('results', results)
  if (results?.data)
    return parseIg(JSON.parse(results.data as string))

  const data = fetch('https://i.instagram.com/api/v1/users/web_profile_info/?username=sleepwalkersultimate', {
    headers: {
      'accept': '*/*',
      'x-ig-app-id': '936619743392459',
      'Referer': 'https://www.instagram.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  })
    .then(res => res.json())
    .then((data) => {
      // console.log('data', data)

      db.prepare('INSERT OR REPLACE INTO documents (id, data, updated_at) VALUES ("instagram", ?, current_timestamp)').bind(JSON.stringify(data)).run()
      return data
    })
  return parseIg(data)
})

function parseIg(data: any): object {
  if (!data || !data.data || !data.data.user || !data.data.user.edge_owner_to_timeline_media || !data.data.user.edge_owner_to_timeline_media.edges)
    return []
  return data.data.user.edge_owner_to_timeline_media.edges.map((i: any) => ({
    id: i.node.id,
    url: `https://www.instagram.com/p/${i.node.shortcode}/`,
    image: i.node.thumbnail_src,
    caption: i.node.edge_media_to_caption.edges[0].node.text,
    timestamp: i.node.taken_at_timestamp,
    shortcode: i.node.shortcode,
    alt: i.node.accessibility_caption,
    location: i.node.location,
    media_preview: i.node.media_preview,
  }))
}
