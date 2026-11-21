import type { Metadata, Viewport } from 'next'
import './globals.css'
import AppNav from '@/components/AppNav'

export const metadata: Metadata = {
  title: '生活工具箱',
  description: '美妝避雷針、家私集、食譜本與 newsfeed',
}

// maximumScale 1：iPhone 點輸入框時不自動放大頁面（使用者仍可雙指縮放）
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <AppNav />
        <div className="app-content">{children}</div>
      </body>
    </html>
  )
}
