'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ToolIcon, { ToolIconKind } from './ToolIcon'

const items: { href: string; label: string; icon: ToolIconKind }[] = [
  { href: '/', label: '首頁', icon: 'home' },
  { href: '/packing/', label: '行李', icon: 'packing' },
  { href: '/recipes/', label: '食譜', icon: 'recipes' },
  { href: '/news/', label: '新聞', icon: 'news' },
]

export default function AppNav() {
  const pathname = usePathname()
  return (
    <nav className="global-nav" aria-label="主要工具">
      {items.map(item => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href.slice(0, -1))
        return (
          <Link key={item.href} href={item.href} className={active ? 'active' : ''} aria-label={item.label} title={item.label}>
            <span className={`nav-icon-symbol nav-icon-${item.icon}`}><ToolIcon kind={item.icon} /></span>
          </Link>
        )
      })}
    </nav>
  )
}
