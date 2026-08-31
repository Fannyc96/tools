import Link from 'next/link'
import ToolIcon from '@/components/ToolIcon'

export default function Page() {
  return (
    <main className="home-page">
      <h1>toolbox</h1>
      <div className="tool-grid">
        <Link href="/packing/" className="tool-card tool-packing">
          <span className="tool-icon tool-icon-packing"><ToolIcon kind="packing" size={32} /></span><span>行李整理</span>
          <small>分類行李與追蹤進度</small>
        </Link>
        <Link href="/recipes/" className="tool-card tool-recipes">
          <span className="tool-icon tool-icon-recipes"><ToolIcon kind="recipes" size={32} /></span><span>食譜本</span>
          <small>收藏、搜尋與調整份量</small>
        </Link>
        <Link href="/news/" className="tool-card tool-news">
          <span className="tool-icon tool-icon-news"><ToolIcon kind="news" size={32} /></span><span>新聞</span>
          <small>閱讀、保留與稍後查看</small>
        </Link>
      </div>
    </main>
  )
}
