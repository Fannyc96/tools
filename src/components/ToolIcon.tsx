export type ToolIconKind = 'home' | 'packing' | 'recipes' | 'news'

const paths: Record<ToolIconKind, React.ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M9.5 20v-6h5v6"/></>,
  packing: <><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8"/><path d="M9 12v4M15 12v4"/></>,
  recipes: <><path d="M3 10h13a4 4 0 0 1 4 4v1a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"/><path d="M20 13h2"/><path d="M8 7c0-1 1-1.5 1-2.5S8 3 8 2"/><path d="M13 7c0-1 1-1.5 1-2.5S13 3 13 2"/></>,
  news: <><path d="M4 5h13v15H5.5A2.5 2.5 0 0 1 3 17.5V7"/><path d="M17 8h4v9.5a2.5 2.5 0 0 1-2.5 2.5H17"/><path d="M7 9h7M7 13h7M7 17h4"/></>,
}

export default function ToolIcon({ kind, size = 21 }: { kind: ToolIconKind; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  )
}
