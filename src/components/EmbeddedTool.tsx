'use client'

export default function EmbeddedTool({ tool, title }: { tool: 'news' | 'packing', title: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const params = new URLSearchParams({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  })
  return <iframe className="embedded-page" src={`${basePath}/tools/${tool}/index.html?${params}`} title={title} />
}
