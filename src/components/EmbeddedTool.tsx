'use client'

import { useEffect, useRef } from 'react'

export default function EmbeddedTool({ tool, title }: { tool: 'news' | 'packing' | 'beauty', title: string }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const params = new URLSearchParams({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  })

  // iPhone 點螢幕最上方（狀態列）只會把最外層頁面捲回頂端，管不到 iframe 裡的工具。
  // 所以讓外層頁面停在 1px 的位置；被捲回 0 時，就改把工具本身捲回頂端，再停回 1px。
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('embedded-active')
    const park = () => window.scrollTo(0, 1)
    let resetTimer: number | undefined
    const startTimer = window.setTimeout(park, 50)

    const onScroll = () => {
      if (window.scrollY > 0) return
      try { frame.current?.contentWindow?.scrollTo({ top: 0, behavior: 'smooth' }) } catch { /* 跨網域時忽略 */ }
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(park, 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(resetTimer)
      window.removeEventListener('scroll', onScroll)
      root.classList.remove('embedded-active')
      window.scrollTo(0, 0)
    }
  }, [])

  return <iframe ref={frame} className="embedded-page" src={`${basePath}/tools/${tool}/index.html?${params}`} title={title} />
}
