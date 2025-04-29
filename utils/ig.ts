export async function getIgData(): Promise<object> {
  return fetch('https://www.instagram.com/api/v1/users/web_profile_info/?username=sleepwalkersultimate', {
    headers: {
      'accept': 'text/json',
      'x-ig-app-id': '936619743392459',
      'Referer': 'https://www.instagram.com/sleepwalkersultimate/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9,fi;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
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
