'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/', label: '首頁', className: 'nav-home' },
  { href: '/news/', label: '新聞' },
  { href: '/packing/', label: '行李' },
  { href: '/recipes/', label: '食譜' },
]

export default function AppNav() {
  const pathname = usePathname()
  return (
    <nav className="global-nav" aria-label="主要工具">
      {items.map(item => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href.slice(0, -1))
        return <Link key={item.href} href={item.href} className={`${item.className || ''} ${active ? 'active' : ''}`}>{item.label}</Link>
      })}
    </nav>
  )
}
