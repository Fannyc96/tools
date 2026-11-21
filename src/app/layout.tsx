import type { Metadata } from 'next'
import './globals.css'
import AppNav from '@/components/AppNav'

export const metadata: Metadata = {
  title: '生活工具箱',
  description: '美妝避雷針、家私備忘錄、食譜與新聞工具',
}

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
