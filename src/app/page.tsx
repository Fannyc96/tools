import Link from 'next/link'

export default function Page() {
  return (
    <main className="home-page">
      <div className="home-kicker">MY EVERYDAY TOOLS</div>
      <h1>生活工具箱</h1>
      <p className="home-intro">三個常用工具，一個網址就能全部打開。</p>
      <div className="tool-grid">
        <Link href="/news/" className="tool-card tool-news">
          <span className="tool-icon">◫</span><span>新聞</span>
          <small>閱讀、保留與稍後查看</small>
        </Link>
        <Link href="/packing/" className="tool-card tool-packing">
          <span className="tool-icon">▣</span><span>行李整理</span>
          <small>分類行李與追蹤進度</small>
        </Link>
        <Link href="/recipes/" className="tool-card tool-recipes">
          <span className="tool-icon">◇</span><span>食譜本</span>
          <small>收藏、搜尋與調整份量</small>
        </Link>
      </div>
    </main>
  )
}
