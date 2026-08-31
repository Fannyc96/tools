const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const decodeEntities = (text: string) => text
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return Response.json({ ok: false }, { status: 405, headers: corsHeaders })

  try {
    const { url } = await req.json().catch(() => ({ url: '' }))
    if (!url || !/^https?:\/\//i.test(url)) return Response.json({ ok: false }, { status: 400, headers: corsHeaders })

    const parsedUrl = new URL(url)
    if (['localhost', '127.0.0.1', '::1'].includes(parsedUrl.hostname)) {
      return Response.json({ ok: false, error: 'Unsupported URL' }, { status: 400, headers: corsHeaders })
    }

    const isYoutube = /youtube\.com\/watch|youtu\.be\//.test(url)
    let title = ''
    let description = ''

    if (isYoutube) {
      const oembed = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
      if (oembed.ok) title = (await oembed.json()).title || ''
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LifeTools/1.0)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.7',
      },
      redirect: 'follow',
    })
    if (!response.ok) return Response.json({ ok: Boolean(title), title, description }, { headers: corsHeaders })

    const html = await response.text()
    if (!title) {
      title = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]
        || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || ''
    }
    description = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i)?.[1]
      || html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1] || ''

    return Response.json({ ok: true, title: decodeEntities(title.trim()), description: decodeEntities(description.trim()) }, { headers: corsHeaders })
  } catch (error) {
    return Response.json({ ok: false, error: String(error) }, { status: 500, headers: corsHeaders })
  }
})
