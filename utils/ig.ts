export async function getIgData(): Promise<object> {
  return fetch('https://i.instagram.com/api/v1/users/web_profile_info/?username=sleepwalkersultimate', {
    headers: {
      'accept': 'text/json',
      'x-ig-app-id': '936619743392459',
      'Referer': 'https://www.instagram.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  })
    .then(res => res.text())
    .then((data) => {
      // console.log('data', data)
      let json
      try {
        json = JSON.parse(data)
      }
      catch (e) {
        console.error('Error parsing JSON', e)
        return { error: 'Error parsing JSON', data }
      }
      return parseIg(json)
    })
}

function parseIg(data: any): object {
  if (!data || !data.data || !data.data.user || !data.data.user.edge_owner_to_timeline_media || !data.data.user.edge_owner_to_timeline_media.edges)
    return []
  return data.data.user.edge_owner_to_timeline_media.edges.map((i: any) => ({
    id: i.node.id,
    url: `https://www.instagram.com/p/${i.node.shortcode}/`,
    // image: i.node.thumbnail_src,
    // caption: i.node.edge_media_to_caption.edges[0].node.text,
    // timestamp: i.node.taken_at_timestamp,
    // shortcode: i.node.shortcode,
    // alt: i.node.accessibility_caption,
    // location: i.node.location,
    // media_preview: i.node.media_preview,
  }))
}
