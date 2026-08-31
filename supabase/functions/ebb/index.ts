const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const response = await fetch('https://ec.militarytimes.com/ebb/')
    if (!response.ok) throw new Error(`EBB returned ${response.status}`)
    const html = await response.text()
    const articles = []
    const seen = new Set<string>()
    const blockRegex = /<a\s+href="(https?:\/\/[^\"]+)"[^>]+class="blink">([^<]+)<\/a>[\s\S]*?class="dlink"[^>]*>([\s\S]*?)<\/a>/gi
    let match

    while ((match = blockRegex.exec(html)) !== null) {
      const url = match[1]
      const title = match[2].trim()
      const preview = match[3].replace(/<[^>]+>/g, '').trim().replace(/^\([^)]+\)\s+/, '').trim()
      if (seen.has(url) || url.includes('militarytimes') || url.includes('subscribe') ||
          url.includes('twitter.com') || url.includes('facebook.com') || title.length < 10) continue
      seen.add(url)
      let hostname = ''
      try { hostname = new URL(url).hostname.replace('www.', '') } catch { /* malformed URL */ }
      articles.push({ id: url, title, url, source: hostname, sourceFull: hostname, time: 'EBB today', preview, tag: 'EBB' })
    }

    return Response.json({ articles, debug_count: articles.length }, { headers: corsHeaders })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500, headers: corsHeaders })
  }
})
