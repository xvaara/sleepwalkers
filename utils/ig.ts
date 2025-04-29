export async function getIgData(): Promise<object> {
  return fetch('https://www.instagram.com/api/v1/users/web_profile_info/?username=sleepwalkersultimate', {
    headers: {
      'accept': 'text/json',
      'x-ig-app-id': '936619743392459',
      'Referer': 'https://www.instagram.com/sleepwalkersultimate/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        console.error('Error fetching Instagram data', res.status, res.statusText)
        return { error: 'Error fetching Instagram data' }
      }
      const data = await res.json()
      return parseIg(data)
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
