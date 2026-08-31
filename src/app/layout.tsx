import type { Metadata } from 'next'
import './globals.css'
import AppNav from '@/components/AppNav'

export const metadata: Metadata = {
  title: '生活工具箱',
  description: '新聞、行李整理與食譜工具',
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
