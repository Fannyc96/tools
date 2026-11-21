'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Recipe, AppSettings, Ingredient, RecipeUrl } from '@/types'
import styles from './App.module.css'

// ── SVG Line Icons ──
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const ChevronLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
const LinkIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const PencilIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const CartIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
const FileTextIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const TagIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
const LeafIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.36a1 1 0 0 0 1.64 1.14L8 18.4c1.66 1.67 4.5 2.6 7 2.6 6 0 9-8 9-12S14 2 8 2c0 0 1 2 2 3"/></svg>
const AlertIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const LoadingIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
const PotIcon = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M8 12V7a4 4 0 0 1 8 0v5"/><line x1="10" y1="7" x2="10" y2="4"/><line x1="14" y1="7" x2="14" y2="4"/></svg>
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const XIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>

// ── Sub-components are defined below the main component ──

const DEFAULT_SETTINGS: AppSettings = {
  id: 1,
  tag_types: {
    '料理風格': ['中式','西式','日式','韓式','泰式','義式'],
    '難易度': ['簡單','中等','困難'],
    '場合': ['日常','宴客','便當','快速料理','節日'],
  },
  ingredient_categories: ['肉類','蔬菜','其他','調味料'],
  common_ingredients: {
    '肉類': ['雞肉','豬肉','牛肉','蛋','豬絞肉','培根','蝦','鮭魚','豆腐'],
    '蔬菜': ['番茄','洋蔥','蔥','蒜','薑','高麗菜','青椒','紅蘿蔔','白菜','菠菜','花椰菜'],
    '調味料': ['鹽','糖','醬油','米酒','白醋','番茄醬','番茄糊','黑胡椒','白胡椒','辣椒醬','蠔油','味噌','芝麻油'],
    '其他': ['義大利麵','白飯','麵粉','橄欖油','奶油','雞高湯','麵包粉','起司'],
  },
}

type View = 'search' | 'list' | 'settings'

const TABS: { v: View; label: string }[] = [
  { v: 'search', label: '搜尋' },
  { v: 'list', label: '食譜' },
  { v: 'settings', label: '設定' },
]

const EMPTY_SEARCH = { query: '', ingredients: [] as string[], tagFilters: {} as Record<string,string[]>, mode: 'OR' as 'OR'|'AND' }
export type SearchState = typeof EMPTY_SEARCH

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('search')
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null)
  const [scales, setScales] = useState<Record<number, number>>({})
  const [toast, setToast] = useState<{ msg: string; undoId?: number } | null>(null)
  const [deletedRecipes, setDeletedRecipes] = useState<Recipe[]>([])
  const [confirmDelete, setConfirmDelete] = useState<Recipe | null>(null)
  const [searchState, setSearchState] = useState<SearchState>(EMPTY_SEARCH)

  // ── Data loading ──
  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data: recs }, { data: sets }] = await Promise.all([
      supabase.from('recipes').select('*').order('created_at', { ascending: false }),
      supabase.from('app_settings').select('*').eq('id', 1).single(),
    ])
    if (recs) setRecipes(recs)
    if (sets) setSettings(sets)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ── Toast ──
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 6000)
    return () => clearTimeout(t)
  }, [toast])

  const toTop = () => window.scrollTo(0, 0)

  // ── Navigation ──
  const goTab = (v: View) => { setView(v); setEditRecipe(null); setCurrentId(null); toTop() }
  const openRecipe = (id: number) => { setCurrentId(id); setEditRecipe(null); toTop() }
  const startNew = () => {
    setEditRecipe({
      id: 0, name: '', servings: 2, favorite: false, last_used: null,
      tags: {}, ingredients: Object.fromEntries(settings.ingredient_categories.map(c=>[c,[]])),
      urls: [], note: ''
    })
    setCurrentId(null)
    if (view === 'settings') setView('list')
    toTop()
  }

  // ── Recipe CRUD ──
  const saveRecipe = async (r: Recipe) => {
    if (!r.name.trim()) { setToast({ msg: '請填寫食譜名稱' }); return }
    if (r.id && recipes.find(x => x.id === r.id)) {
      const { data } = await supabase.from('recipes').update(r).eq('id', r.id).select().single()
      if (data) { setRecipes(prev => [data, ...prev.filter(x => x.id !== r.id)]); setCurrentId(r.id) }
    } else {
      const { id: _id, ...rest } = r as any
      const { data } = await supabase.from('recipes').insert(rest).select().single()
      if (data) { setRecipes(prev => [data, ...prev]); setCurrentId(data.id) }
    }
    setEditRecipe(null)
    setToast({ msg: '已儲存' })
    toTop()
  }

  const deleteRecipe = async (r: Recipe) => {
    setDeletedRecipes(prev => [r, ...prev].slice(0, 10))
    await supabase.from('recipes').delete().eq('id', r.id)
    setRecipes(prev => prev.filter(x => x.id !== r.id))
    setCurrentId(null)
    setConfirmDelete(null)
    setToast({ msg: `已刪除「${r.name}」`, undoId: r.id })
  }

  const undoDelete = async (id: number) => {
    const r = deletedRecipes.find(x => x.id === id)
    if (!r) return
    const { id: _id, ...rest } = r as any
    const { data } = await supabase.from('recipes').insert(rest).select().single()
    if (data) {
      setRecipes(prev => [data, ...prev])
      setDeletedRecipes(prev => prev.filter(x => x.id !== id))
      setCurrentId(data.id)
      setToast({ msg: `已復原「${r.name}」` })
    }
  }

  // ── Settings CRUD ──
  const saveSettings = async (next: AppSettings) => {
    setSettings(next)
    await supabase.from('app_settings').update(next).eq('id', 1)
  }

  const currentRecipe = recipes.find(r => r.id === currentId) || null

  return (
    <div className={styles.app}>
      <header className={styles.hdr}><div className={`${styles.wrap} ${styles.hdrRow}`}>
        <h1 className={styles.hdrTitle}>食譜本</h1>
        <div className={styles.hdrActions}>
          <button type="button" className={styles.hbtn} onClick={startNew}><PlusIcon /> 新增</button>
        </div>
      </div></header>

      <nav className={styles.tabsBar} aria-label="食譜本分頁">
        <div className={`${styles.wrap} ${styles.tabs}`}>
          {TABS.map(t => (
            <button key={t.v} type="button" className={`${styles.tab} ${view===t.v ? styles.tabActive : ''}`}
              aria-current={view===t.v ? 'page' : undefined} onClick={() => goTab(t.v)}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className={`${styles.wrap} ${styles.main}`}>
        {loading ? (
          <div className={styles.hint}>載入中…</div>
        ) : editRecipe ? (
          <RecipeForm
            recipe={editRecipe}
            settings={settings}
            onSave={saveRecipe}
            onCancel={() => { setEditRecipe(null); toTop() }}
          />
        ) : view === 'settings' ? (
          <SettingsPanel settings={settings} onSave={saveSettings} />
        ) : currentRecipe ? (
          <RecipeView
            recipe={currentRecipe}
            scale={scales[currentRecipe.id] || 1}
            onScaleChange={(s) => setScales(prev => ({ ...prev, [currentRecipe.id]: s }))}
            onBack={() => { setCurrentId(null); toTop() }}
            onEdit={() => { setEditRecipe(JSON.parse(JSON.stringify(currentRecipe))); toTop() }}
            onDelete={() => setConfirmDelete(currentRecipe)}
            settings={settings}
          />
        ) : view === 'search' ? (
          <SearchPanel
            recipes={recipes}
            settings={settings}
            searchState={searchState}
            onSearchChange={setSearchState}
            onOpen={openRecipe}
          />
        ) : (
          <RecipeGrid recipes={recipes} onOpen={openRecipe} />
        )}
      </main>

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>刪除「{confirmDelete.name}」？</div>
            <div className={styles.modalBody}>刪除後可立即復原，關閉頁面後將無法復原。</div>
            <div className={styles.modalActions}>
              <button className={styles.btn} onClick={() => setConfirmDelete(null)}>取消</button>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => deleteRecipe(confirmDelete)}>確認刪除</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={styles.toast}>
          <CheckIcon /> {toast.msg}
          {toast.undoId && (
            <button className={styles.toastUndo} onClick={() => { undoDelete(toast.undoId!); setToast(null) }}>復原</button>
          )}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────
// RECIPE VIEW
// ──────────────────────────────────────────────
function RecipeView({ recipe, scale, onScaleChange, onBack, onEdit, onDelete, settings }: {
  recipe: Recipe, scale: number, onScaleChange: (s:number)=>void,
  onBack: ()=>void, onEdit: ()=>void, onDelete: ()=>void, settings: AppSettings
}) {
  const displayServings = Math.round(recipe.servings * scale)

  const changeScale = (delta: number) => {
    const newDisplay = Math.max(1, displayServings + delta)
    onScaleChange(newDisplay / recipe.servings)
  }

  const scaleAmount = (amt: string) => {
    if (!amt || isNaN(parseFloat(amt)) || scale === 1) return amt
    const sc = parseFloat(amt) * scale
    return Number.isInteger(sc) ? String(sc) : sc.toFixed(1)
  }

  return (
    <div>
      <div className={styles.subbar}>
        <button type="button" className={styles.backBtn} onClick={onBack}><ChevronLeftIcon /> 返回</button>
        <span className={styles.spacer} />
        <button type="button" className={`${styles.btn} ${styles.btnSm}`} onClick={onEdit}><PencilIcon /> 編輯</button>
        <button type="button" className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`} onClick={onDelete}><TrashIcon /> 刪除</button>
      </div>
        <div className={styles.card}>
          <h2 className={styles.recipeName}>{recipe.name}</h2>

          {/* Tags */}
          {Object.entries(recipe.tags || {}).some(([,v]) => v?.length) && (
            <div className={`${styles.tagBlock} ${styles.tagGroupRow}`}>
              {Object.values(recipe.tags || {}).flat().map(v => <span key={v} className={styles.tagBadge}>{v}</span>)}
            </div>
          )}

          <div className={styles.servingScaler}>
            <span className={styles.servingLabel}>份量</span>
            <button type="button" className={styles.servingBtn} aria-label="減少份量" onClick={() => changeScale(-1)}>−</button>
            <span>{displayServings} 人份</span>
            <button type="button" className={styles.servingBtn} aria-label="增加份量" onClick={() => changeScale(1)}>＋</button>
            {scale !== 1 && <button className={styles.resetLink} onClick={() => onScaleChange(1)}>重設</button>}
          </div>

          {(recipe.urls || []).length > 0 && (
            <div className={styles.urlList}>
              {recipe.urls.map((u, i) => (
                <div key={i} className={styles.urlBlock}>
                  <a href={u.url} target="_blank" rel="noreferrer" className={styles.urlBlockName}>
                    <LinkIcon /> {u.name || `來源 ${i + 1}`}
                  </a>
                  <div className={styles.urlBlockUrl}>{u.url}</div>
                  {u.note && <div className={styles.urlBlockNote}>{u.note}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Ingredients */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitle}><CartIcon /> 食材</div>
            {settings.ingredient_categories.map(cat => {
              const ings = (recipe.ingredients[cat] || []).filter(i => i.name)
              if (!ings.length) return null
              return (
                <div key={cat}>
                  <div className={styles.ingCatTitle}>{cat}</div>
                  <div className={styles.ingGrid}>
                    {ings.map((ing, i) => (
                      <div key={i} className={styles.ingItem}>
                        <span>{ing.name}</span>
                        <span className={styles.ingAmount}>{ing.amount ? scaleAmount(ing.amount) + ' ' + (ing.unit || '') : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Note */}
          {recipe.note && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionTitle}><FileTextIcon /> 備注</div>
              <div className={styles.noteBox}>{recipe.note}</div>
            </div>
          )}
        </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// RECIPE FORM
// ──────────────────────────────────────────────
function RecipeForm({ recipe, settings, onSave, onCancel }: {
  recipe: Recipe, settings: AppSettings,
  onSave: (r: Recipe) => void, onCancel: () => void
}) {
  const [r, setR] = useState<Recipe>(JSON.parse(JSON.stringify(recipe)))
  const [acState, setAcState] = useState<{cat:string,i:number,results:string[]} | null>(null)
  const [fetchResults, setFetchResults] = useState<Record<number, {
    status: 'loading'|'done'|'fail'
    title?: string
    detected?: {name:string;amount:string;unit:string}[]
  }>>({})

  const isEdit = Boolean(recipe.id && recipe.id > 0)

  const ingWithCats = { ...r.ingredients }
  settings.ingredient_categories.forEach(c => { if (!ingWithCats[c]) ingWithCats[c] = [] })

  const setField = (field: keyof Recipe, val: any) => setR(prev => ({ ...prev, [field]: val }))

  const updateIng = (cat: string, i: number, field: keyof Ingredient, val: string) => {
    const next = { ...ingWithCats }
    if (!next[cat]) next[cat] = []
    const arr = [...next[cat]]
    arr[i] = { ...arr[i], [field]: val }
    next[cat] = arr
    setField('ingredients', next)
  }

  const addIng = (cat: string) => {
    const next = { ...ingWithCats }
    next[cat] = [...(next[cat] || []), { name: '', amount: '', unit: '' }]
    setField('ingredients', next)
  }

  const addIngByName = (cat: string, name: string) => {
    setR(prev => {
      const cur = prev.ingredients[cat] || []
      if (cur.some(i => i.name === name)) return prev
      return { ...prev, ingredients: { ...prev.ingredients, [cat]: [...cur, { name, amount: '', unit: '' }] } }
    })
  }

  const removeIng = (cat: string, i: number) => {
    const next = { ...ingWithCats }
    next[cat] = next[cat].filter((_, idx) => idx !== i)
    setField('ingredients', next)
  }

  const showAC = (cat: string, i: number, val: string) => {
    if (!val.trim()) { setAcState(null); return }
    const common = settings.common_ingredients[cat] || []
    const exact = common.filter(c => c.includes(val) && c !== val)
    const fuzzy = common.filter(c => levenshtein(c, val) === 1 && !exact.includes(c) && c !== val)
    const results = [...exact, ...fuzzy].slice(0, 6)
    setAcState(results.length ? { cat, i, results } : null)
  }

  const toggleTag = (type: string, val: string) => {
    const cur = r.tags[type] || []
    const next = cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]
    setField('tags', { ...r.tags, [type]: next })
  }

  const addUrl = () => setField('urls', [...(r.urls || []), { url: '', name: '', note: '' }])
  const removeUrl = (i: number) => setField('urls', r.urls.filter((_, idx) => idx !== i))
  const updateUrl = (i: number, field: keyof RecipeUrl, val: string) => {
    const next = [...r.urls]
    next[i] = { ...next[i], [field]: val }
    setField('urls', next)
  }

  const tryFetch = async (i: number, url: string) => {
    if (!url || !url.startsWith('http')) return
    setFetchResults(prev => ({ ...prev, [i]: { status: 'loading' } }))
    try {
      const { data, error } = await supabase.functions.invoke('fetch-url', { body: { url } })
      if (error) throw error
      if (data.ok) {
        const detected = parseIngredientsFromText(data.description || '')
        if (data.title) {
          setR(prev => {
            if (prev.urls[i]?.name) return prev
            const nextUrls = [...prev.urls]
            nextUrls[i] = { ...nextUrls[i], name: data.title }
            return { ...prev, urls: nextUrls }
          })
        }
        setFetchResults(prev => ({ ...prev, [i]: { status: 'done', title: data.title, detected } }))
      } else {
        setFetchResults(prev => ({ ...prev, [i]: { status: 'fail' } }))
      }
    } catch {
      setFetchResults(prev => ({ ...prev, [i]: { status: 'fail' } }))
    }
  }

  const addDetectedIng = (ing: {name:string;amount:string;unit:string}) => {
    let targetCat = settings.ingredient_categories[settings.ingredient_categories.length - 1] || '其他'
    for (const cat of settings.ingredient_categories) {
      if ((settings.common_ingredients[cat] || []).includes(ing.name)) { targetCat = cat; break }
    }
    setR(prev => {
      const cur = prev.ingredients[targetCat] || []
      if (cur.some(x => x.name === ing.name)) return prev
      return { ...prev, ingredients: { ...prev.ingredients, [targetCat]: [...cur, ing] } }
    })
  }

  return (
    <div>
      <div className={styles.subbar}>
        <div className={styles.subbarTitle}>{isEdit ? '編輯食譜' : '新增食譜'}</div>
      </div>
        <div className={styles.card}>

          {/* BASIC */}
          <div className={styles.formSection}>
            <label className={styles.formLabel}>食譜名稱 *</label>
            <input className={styles.formInput} value={r.name} placeholder="例：番茄炒蛋" onChange={e => setField('name', e.target.value)} />
          </div>
          <div className={styles.formSection} style={{maxWidth:180}}>
            <label className={styles.formLabel}>基準份量（人份）</label>
            <select className={styles.formSelect} value={r.servings} onChange={e => setField('servings', parseInt(e.target.value))}>
              {[1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n}>{n} 人份</option>)}
            </select>
          </div>

          <div className={styles.formSectionGap} />

          {/* TAGS */}
          {Object.entries(settings.tag_types).map(([type, vals]) => (
            <div key={type} className={styles.formSection}>
              <label className={styles.formLabel}>{type}</label>
              <div className={styles.tagSelectGrid}>
                {vals.map(v => (
                  <button key={v}
                    className={`${styles.selectTag} ${(r.tags[type]||[]).includes(v)?styles.selectTagActive:''}`}
                    onClick={() => toggleTag(type, v)}>{v}</button>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.formSectionGap} />

          {/* URLS */}
          <div className={styles.formSectionHeader}>來源連結</div>
          {(r.urls || []).map((u, i) => {
            const fr = fetchResults[i]
            return (
              <div key={i} className={styles.urlFormBlock}>
                <div className={styles.urlBlockHeader}>
                  <span className={styles.urlBlockLabel}>來源 {i+1}</span>
                  <button className={styles.removeBtn} onClick={() => removeUrl(i)}>✕</button>
                </div>
                <input className={styles.formInput} style={{marginBottom:6}} value={u.url} placeholder="https://…"
                  onChange={e => updateUrl(i,'url',e.target.value)}
                  onBlur={e => tryFetch(i, e.target.value)} />
                {fr?.status === 'loading' && <div className={styles.fetchHintLoading}><LoadingIcon /> 讀取中…</div>}
                {fr?.status === 'fail' && <div className={styles.fetchHintFail}><AlertIcon /> 無法讀取，請手動填寫</div>}
                <input className={styles.formInput} style={{marginBottom:6}} value={u.name} placeholder="顯示名稱（自動帶入或手動填）" onChange={e => updateUrl(i,'name',e.target.value)} />
                <input className={styles.formInput} value={u.note} placeholder="備注（選填）" onChange={e => updateUrl(i,'note',e.target.value)} />
                {fr?.status === 'done' && fr.detected && fr.detected.length > 0 && (
                  <div className={styles.detectedIngBox}>
                    <div className={styles.detectedIngTitle}>偵測到 {fr.detected.length} 項食材，點擊加入 ↓</div>
                    <div className={styles.detectedIngRow}>
                      {fr.detected.map((ing, di) => {
                        const alreadyAdded = Object.values(ingWithCats).flat().some(x => x.name === ing.name)
                        return (
                          <button key={di}
                            className={`${styles.detectedIngChip} ${alreadyAdded ? styles.detectedIngChipAdded : ''}`}
                            onClick={() => !alreadyAdded && addDetectedIng(ing)}>
                            {ing.name}{ing.amount ? ` ${ing.amount}${ing.unit}` : ''}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <button className={styles.addIngBtn} onClick={addUrl}>＋ 新增連結</button>

          <div className={styles.formSectionGap} />

          {/* INGREDIENTS */}
          <div className={styles.formSectionHeader}>食材</div>
          {settings.ingredient_categories.map(cat => (
            <div key={cat} className={styles.ingCatBlock}>
              <div className={styles.ingCatLabel}>{cat}</div>
              {(settings.common_ingredients[cat] || []).length > 0 && (
                <div className={styles.commonIngsRow}>
                  {(settings.common_ingredients[cat] || []).map(name => {
                    const added = (ingWithCats[cat] || []).some(x => x.name === name)
                    return (
                      <button key={name}
                        className={`${styles.commonIngChip} ${added ? styles.commonIngChipAdded : ''}`}
                        onClick={() => !added && addIngByName(cat, name)}>
                        {name}
                      </button>
                    )
                  })}
                </div>
              )}
              {(ingWithCats[cat] || []).map((ing, i) => (
                <div key={i} className={styles.ingFormRow}>
                  <div style={{position:'relative',flex:2}}>
                    <input
                      className={styles.formInput}
                      value={ing.name}
                      placeholder={`${cat}名稱`}
                      onChange={e => { updateIng(cat,i,'name',e.target.value); showAC(cat,i,e.target.value) }}
                      onBlur={() => setTimeout(()=>setAcState(null),200)}
                      autoComplete="off"
                    />
                    {acState?.cat===cat && acState?.i===i && (
                      <div className={styles.acList}>
                        {acState.results.map(m => (
                          <div key={m} className={styles.acItem} onMouseDown={() => { updateIng(cat,i,'name',m); setAcState(null) }}>{m}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input className={styles.formInput} value={ing.amount} placeholder="數量" style={{flex:1,minWidth:60}} onChange={e => updateIng(cat,i,'amount',e.target.value)} />
                  <input className={styles.formInput} value={ing.unit} placeholder="單位" style={{flex:1,minWidth:50}} onChange={e => updateIng(cat,i,'unit',e.target.value)} />
                  <button className={styles.removeBtn} onClick={() => removeIng(cat,i)}>✕</button>
                </div>
              ))}
              <button className={styles.addIngBtn} onClick={() => addIng(cat)}>＋ 自訂{cat}</button>
            </div>
          ))}

          <div className={styles.formSectionGap} />

          {/* NOTE */}
          <div className={styles.formSectionHeader}>備注</div>
          <div className={styles.formSection}>
            <textarea className={styles.formTextarea} value={r.note}
              placeholder="步驟、心得、注意事項…"
              onChange={e => setField('note', e.target.value)} style={{minHeight:120}} />
          </div>

        </div>
        <div className={styles.formActions}>
          <button type="button" className={styles.btn} onClick={onCancel}>取消</button>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onSave(r)}>儲存</button>
        </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// SEARCH PANEL
// ──────────────────────────────────────────────
function SearchPanel({ recipes, settings, searchState, onSearchChange, onOpen }: {
  recipes: Recipe[], settings: AppSettings,
  searchState: any, onSearchChange: (s:any)=>void, onOpen: (id:number)=>void
}) {
  const results = recipes.filter(r => {
    if(searchState.query && !r.name.includes(searchState.query)) return false
    if(searchState.ingredients.length) {
      const all = Object.values(r.ingredients).flat().map((i:any)=>i.name)
      if(searchState.mode==='AND') { if(!searchState.ingredients.every((i:string)=>all.includes(i))) return false }
      else { if(!searchState.ingredients.some((i:string)=>all.includes(i))) return false }
    }
    for(const [type,vals] of Object.entries(searchState.tagFilters)) {
      if(!(vals as string[]).length) continue
      if(!(vals as string[]).some(v=>(r.tags[type]||[]).includes(v))) return false
    }
    return true
  })

  const toggleIng = (ing: string) => {
    const cur = searchState.ingredients
    onSearchChange({ ...searchState, ingredients: cur.includes(ing) ? cur.filter((i:string)=>i!==ing) : [...cur,ing] })
  }

  const toggleTagF = (type: string, val: string) => {
    const cur = searchState.tagFilters[type]||[]
    onSearchChange({ ...searchState, tagFilters: { ...searchState.tagFilters, [type]: cur.includes(val)?cur.filter((v:string)=>v!==val):[...cur,val] } })
  }

  return (
    <div>
        <div className={styles.searchPanel}>
          <input className={styles.searchInputBig} placeholder="搜尋食譜名稱…" value={searchState.query}
            onChange={e => onSearchChange({...searchState, query:e.target.value})} />

          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>食材模式</span>
            <div className={styles.filterMode}>
              {(['OR','AND'] as const).map(m => (
                <button key={m} className={`${styles.filterModeBtn} ${searchState.mode===m?styles.filterModeBtnActive:''}`}
                  onClick={() => onSearchChange({...searchState,mode:m})}>{m==='OR'?'OR（任一）':'AND（全部）'}</button>
              ))}
            </div>
          </div>

          {Object.entries(settings.tag_types).map(([type,vals])=>(
            <div key={type} className={styles.filterRow}>
              <span className={styles.filterLabel}>{type}</span>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {vals.map(v=>(
                  <button key={v} className={`${styles.tagChip} ${(searchState.tagFilters[type]||[]).includes(v)?styles.tagChipActive:''}`}
                    onClick={()=>toggleTagF(type,v)}>{v}</button>
                ))}
              </div>
            </div>
          ))}

          {settings.ingredient_categories.map(cat => {
            const catIngs = (settings.common_ingredients[cat] || [])
            if (!catIngs.length) return null
            return (
              <div key={cat} className={styles.filterRow}>
                <span className={styles.filterLabel}>{cat}</span>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {catIngs.map(ing => (
                    <button key={ing} className={`${styles.tagChip} ${searchState.ingredients.includes(ing)?styles.tagChipActive:''}`}
                      onClick={()=>toggleIng(ing)}>{ing}</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {(() => {
          const hasSearch = searchState.query || searchState.ingredients.length > 0 ||
            Object.values(searchState.tagFilters).flat().length > 0
          if (!hasSearch) return null
          if (results.length === 0) return (
            <div className={styles.emptyState}><div className={styles.emptyIcon}><SearchIcon /></div><p>沒有符合條件的食譜</p></div>
          )
          return results.map(r => (
            <div key={r.id} className={styles.resultCard} onClick={() => onOpen(r.id)}>
              <div className={styles.resultCardName}>{r.name}</div>
              <div className={styles.resultCardMeta}>
                <span>{r.servings} 人份</span>
                {Object.values(r.tags||{}).flat().map(t=><span key={t} className={styles.tagBadge}>{t}</span>)}
              </div>
            </div>
          ))
        })()}
    </div>
  )
}

// ──────────────────────────────────────────────
// SETTINGS PANEL
// ──────────────────────────────────────────────
function SettingsPanel({ settings, onSave }: { settings: AppSettings, onSave: (s:AppSettings)=>void }) {
  const [s, setS] = useState<AppSettings>(JSON.parse(JSON.stringify(settings)))
  const [newType, setNewType] = useState('')
  const [newTagVals, setNewTagVals] = useState<Record<string,string>>({})
  const [newCat, setNewCat] = useState('')
  const [newIngs, setNewIngs] = useState<Record<string,string>>({})
  const [editingType, setEditingType] = useState<string|null>(null)
  const [editingTypeVal, setEditingTypeVal] = useState('')
  const [editingCat, setEditingCat] = useState<string|null>(null)
  const [editingCatVal, setEditingCatVal] = useState('')

  const saveTypeName = (oldType: string) => {
    const newName = editingTypeVal.trim()
    if (!newName || newName === oldType) { setEditingType(null); return }
    if (s.tag_types[newName]) { setEditingType(null); return }
    const next: Record<string,string[]> = {}
    for (const [k, v] of Object.entries(s.tag_types)) next[k === oldType ? newName : k] = v
    commit({...s, tag_types: next})
    setEditingType(null)
  }

  const saveCatName = (oldCat: string) => {
    const newName = editingCatVal.trim()
    if (!newName || newName === oldCat) { setEditingCat(null); return }
    if (s.ingredient_categories.includes(newName)) { setEditingCat(null); return }
    const newCats = s.ingredient_categories.map(c => c === oldCat ? newName : c)
    const newCommon: Record<string,string[]> = {}
    for (const [k, v] of Object.entries(s.common_ingredients)) newCommon[k === oldCat ? newName : k] = v
    commit({...s, ingredient_categories: newCats, common_ingredients: newCommon})
    setEditingCat(null)
  }

  // 變更先暫存在畫面上，按「儲存變更」才寫入，避免誤觸
  const commit = (next: AppSettings) => setS(next)
  const dirty = JSON.stringify(s) !== JSON.stringify(settings)

  return (
    <div>

        {/* TAG TYPES */}
        <div className={styles.settingsPanel}>
          <div className={styles.settingsTitle}><TagIcon /> Tag 管理</div>
          {Object.entries(s.tag_types).map(([type,vals], idx)=>{
            const isBlue = idx % 2 === 0
            const blockStyle = isBlue
              ? {background:'var(--info-bg)', border:'0.5px solid var(--accent-light)'}
              : {background:'var(--amber-bg)', border:'0.5px solid #E8C840'}
            return (
            <div key={type} className={styles.tagGroupBlock} style={blockStyle}>
              <div className={styles.tagGroupName}>
                {editingType === type ? (
                  <div style={{display:'flex',gap:6,flex:1,alignItems:'center'}}>
                    <input className={styles.formInput} style={{flex:1,padding:'4px 10px'}}
                      value={editingTypeVal} autoFocus
                      onChange={e=>setEditingTypeVal(e.target.value)}
                      onKeyDown={e=>{ if(e.key==='Enter') saveTypeName(type); if(e.key==='Escape') setEditingType(null) }} />
                    <button className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`} onClick={()=>saveTypeName(type)}>✓</button>
                    <button className={`${styles.btn} ${styles.btnSm}`} onClick={()=>setEditingType(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span>{type}</span>
                    <div style={{display:'flex',gap:6}}>
                      <button className={`${styles.btn} ${styles.btnSm}`}
                        onClick={()=>{setEditingType(type);setEditingTypeVal(type)}}>改名</button>
                      <button className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                        onClick={()=>{ const n={...s.tag_types}; delete n[type]; commit({...s,tag_types:n}) }}>刪除</button>
                    </div>
                  </>
                )}
              </div>
              <SortableChips items={vals}
                onChange={next=>commit({...s,tag_types:{...s.tag_types,[type]:next}})}
                onRemove={v=>commit({...s,tag_types:{...s.tag_types,[type]:vals.filter(x=>x!==v)}})} />
              <div className={styles.settingRow}>
                <input className={styles.formInput} style={{flex:1}} placeholder="新增 tag 值…"
                  value={newTagVals[type]||''} onChange={e=>setNewTagVals(p=>({...p,[type]:e.target.value}))}
                  onKeyDown={e=>{ if(e.key==='Enter'){ const v=(newTagVals[type]||'').trim(); if(v&&!vals.includes(v)){ commit({...s,tag_types:{...s.tag_types,[type]:[...vals,v]}}); setNewTagVals(p=>({...p,[type]:''})) } } }} />
                <button className={styles.btn} onClick={()=>{ const v=(newTagVals[type]||'').trim(); if(v&&!vals.includes(v)){ commit({...s,tag_types:{...s.tag_types,[type]:[...vals,v]}}); setNewTagVals(p=>({...p,[type]:''})) } }}>＋ 新增</button>
              </div>
            </div>
          )})}

          <div className={styles.settingRow} style={{marginTop:12}}>
            <input className={styles.formInput} style={{flex:1}} placeholder="新增 tag 類型名稱…" value={newType}
              onChange={e=>setNewType(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&newType.trim()&&!s.tag_types[newType.trim()]){ commit({...s,tag_types:{...s.tag_types,[newType.trim()]:[]}}); setNewType('') } }} />
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={()=>{ const v=newType.trim(); if(v&&!s.tag_types[v]){ commit({...s,tag_types:{...s.tag_types,[v]:[]}}); setNewType('') } }}>＋ 新增類型</button>
          </div>
        </div>

        {/* INGREDIENT CATEGORIES */}
        <div className={styles.settingsPanel}>
          <div className={styles.settingsTitle}><LeafIcon /> 食材分類與常見食材</div>
          {s.ingredient_categories.map((cat, idx)=>(
            <div key={cat} className={styles.tagGroupBlock} style={idx%2===0
              ? {background:'var(--info-bg)',border:'0.5px solid var(--accent-light)'}
              : {background:'var(--amber-bg)',border:'0.5px solid #E8C840'}}>
              <div className={styles.tagGroupName}>
                {editingCat === cat ? (
                  <div style={{display:'flex',gap:6,flex:1,alignItems:'center'}}>
                    <input className={styles.formInput} style={{flex:1,padding:'4px 10px'}}
                      value={editingCatVal} autoFocus
                      onChange={e=>setEditingCatVal(e.target.value)}
                      onKeyDown={e=>{ if(e.key==='Enter') saveCatName(cat); if(e.key==='Escape') setEditingCat(null) }} />
                    <button className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`} onClick={()=>saveCatName(cat)}>✓</button>
                    <button className={`${styles.btn} ${styles.btnSm}`} onClick={()=>setEditingCat(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span>{cat}</span>
                    <div style={{display:'flex',gap:6}}>
                      <button className={`${styles.btn} ${styles.btnSm}`}
                        onClick={()=>{setEditingCat(cat);setEditingCatVal(cat)}}>改名</button>
                      <button className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                        onClick={()=>commit({...s,ingredient_categories:s.ingredient_categories.filter(c=>c!==cat)})}>刪除</button>
                    </div>
                  </>
                )}
              </div>
              <SortableChips items={s.common_ingredients[cat]||[]}
                onChange={next=>commit({...s,common_ingredients:{...s.common_ingredients,[cat]:next}})}
                onRemove={v=>commit({...s,common_ingredients:{...s.common_ingredients,[cat]:(s.common_ingredients[cat]||[]).filter(x=>x!==v)}})} />
              <div className={styles.settingRow}>
                <input className={styles.formInput} style={{flex:1}} placeholder="新增常見食材…"
                  value={newIngs[cat]||''} onChange={e=>setNewIngs(p=>({...p,[cat]:e.target.value}))}
                  onKeyDown={e=>{ if(e.key==='Enter'){ const v=(newIngs[cat]||'').trim(); const cur=s.common_ingredients[cat]||[]; if(v&&!cur.includes(v)){ commit({...s,common_ingredients:{...s.common_ingredients,[cat]:[...cur,v]}}); setNewIngs(p=>({...p,[cat]:''})) } } }} />
                <button className={styles.btn} onClick={()=>{ const v=(newIngs[cat]||'').trim(); const cur=s.common_ingredients[cat]||[]; if(v&&!cur.includes(v)){ commit({...s,common_ingredients:{...s.common_ingredients,[cat]:[...cur,v]}}); setNewIngs(p=>({...p,[cat]:''})) } }}>＋ 新增</button>
              </div>
            </div>
          ))}
          <div className={styles.settingRow} style={{marginTop:12}}>
            <input className={styles.formInput} style={{flex:1}} placeholder="新增食材分類名稱…" value={newCat}
              onChange={e=>setNewCat(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&newCat.trim()&&!s.ingredient_categories.includes(newCat.trim())){ commit({...s,ingredient_categories:[...s.ingredient_categories,newCat.trim()],common_ingredients:{...s.common_ingredients,[newCat.trim()]:[]}}); setNewCat('') } }} />
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={()=>{ const v=newCat.trim(); if(v&&!s.ingredient_categories.includes(v)){ commit({...s,ingredient_categories:[...s.ingredient_categories,v],common_ingredients:{...s.common_ingredients,[v]:[]}}); setNewCat('') } }}>＋ 新增分類</button>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.btn} disabled={!dirty} onClick={() => setS(JSON.parse(JSON.stringify(settings)))}>取消</button>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} disabled={!dirty} onClick={() => onSave(s)}>儲存</button>
        </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// 長按後拖曳調整順序的標籤列（設定頁的 tag 值、常見食材）
// ──────────────────────────────────────────────
const LONG_PRESS_MS = 350
function SortableChips({ items, onChange, onRemove }: {
  items: string[], onChange: (next: string[]) => void, onRemove: (v: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const dragRef = useRef<number | null>(null)
  const itemsRef = useRef(items)
  const timer = useRef<number | undefined>(undefined)
  const startPt = useRef<{ x: number, y: number } | null>(null)
  itemsRef.current = items

  const setDrag = (i: number | null) => { dragRef.current = i; setDragIdx(i) }
  const cancelPress = () => { window.clearTimeout(timer.current); startPt.current = null }

  const moveTo = (x: number, y: number) => {
    const from = dragRef.current
    if (from === null) return
    const el = document.elementFromPoint(x, y)?.closest('[data-chip-idx]') as HTMLElement | null
    if (!el || !listRef.current?.contains(el)) return
    const to = Number(el.dataset.chipIdx)
    if (to === from) return
    const next = [...itemsRef.current]
    const [v] = next.splice(from, 1)
    next.splice(to, 0, v)
    onChange(next)
    setDrag(to)
  }

  const press = (i: number, x: number, y: number) => {
    cancelPress()
    startPt.current = { x, y }
    timer.current = window.setTimeout(() => { setDrag(i); try { navigator.vibrate?.(10) } catch {} }, LONG_PRESS_MS)
  }

  // 觸控：拖曳中要擋住頁面捲動，需要非 passive 的 touchmove
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (dragRef.current !== null) { e.preventDefault(); moveTo(t.clientX, t.clientY); return }
      const st = startPt.current
      if (st && Math.hypot(t.clientX - st.x, t.clientY - st.y) > 8) cancelPress() // 一開始就移動＝想捲動頁面
    }
    const onEnd = () => { cancelPress(); if (dragRef.current !== null) setDrag(null) }
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', onEnd)
    return () => { el.removeEventListener('touchmove', onMove); el.removeEventListener('touchend', onEnd); el.removeEventListener('touchcancel', onEnd) }
  })

  // 滑鼠
  useEffect(() => {
    if (dragIdx === null) return
    const onMove = (e: MouseEvent) => moveTo(e.clientX, e.clientY)
    const onUp = () => setDrag(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragIdx])

  return (
    <div ref={listRef} className={styles.chipList}>
      {items.map((v, i) => (
        <span key={v} data-chip-idx={i}
          className={`${styles.settingChip} ${dragIdx === i ? styles.settingChipDragging : ''}`}
          onTouchStart={e => { if ((e.target as HTMLElement).closest('button')) return; press(i, e.touches[0].clientX, e.touches[0].clientY) }}
          onMouseDown={e => { if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return; press(i, e.clientX, e.clientY) }}
          onMouseUp={cancelPress} onMouseLeave={() => { if (dragRef.current === null) cancelPress() }}
          onContextMenu={e => e.preventDefault()}>
          {v}
          <button type="button" className={styles.xBtn} aria-label={`刪除 ${v}`} onClick={() => onRemove(v)}>✕</button>
        </span>
      ))}
    </div>
  )
}

// ── Helpers ──
function timeAgo(ts: string) {
  const d = Date.now() - new Date(ts).getTime()
  if(d < 60000) return '剛剛'
  if(d < 3600000) return Math.floor(d/60000) + ' 分鐘前'
  if(d < 86400000) return Math.floor(d/3600000) + ' 小時前'
  if(d < 2592000000) return Math.floor(d/86400000) + ' 天前'
  return Math.floor(d/2592000000) + ' 個月前'
}

function parseIngredientsFromText(text: string): { name: string; amount: string; unit: string }[] {
  if (!text) return []
  const units = ['公克','毫升','大匙','小匙','公升','克','ml','個','根','片','匙','杯','斤','兩','碗','條','顆','包','罐','塊','把','瓣','段','滴','份','隻','支','束','適量','少許','g','G']
  const unitPat = units.join('|')
  const results: { name: string; amount: string; unit: string }[] = []
  const seen = new Set<string>()
  const lines = text.split('\n')
  for (const line of lines) {
    const trimmed = line.trim().replace(/^[•·*\-▸►◆○●■□▷→\s]+/, '')
    if (!trimmed || trimmed.length > 30) continue
    const m = trimmed.match(new RegExp(`^([一-鿿\\w\\s（）()]{1,10}?)\\s*(\\d+(?:[./]\\d+)?)\\s*(${unitPat})`))
    if (m) {
      const name = m[1].trim()
      if (name.length >= 1 && !seen.has(name)) {
        seen.add(name)
        results.push({ name, amount: m[2], unit: m[3] })
      }
    }
  }
  return results
}

// ──────────────────────────────────────────────
// RECIPE LIST（所有食譜／搜尋結果共用卡片）
// ──────────────────────────────────────────────
function RecipeCard({ recipe: r, onOpen }: { recipe: Recipe, onOpen: (id: number) => void }) {
  const tags = Object.values(r.tags || {}).flat()
  return (
    <button type="button" className={styles.recipeCard} onClick={() => onOpen(r.id)}>
      <div className={styles.recipeCardName}>{r.name}</div>
      <div className={styles.recipeCardMeta}>
        <span>{r.servings} 人份</span>
        {tags.map(t => <span key={t} className={styles.tagBadge}>{t}</span>)}
      </div>
    </button>
  )
}

function RecipeGrid({ recipes, onOpen }: { recipes: Recipe[], onOpen: (id: number) => void }) {
  if (recipes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><PotIcon /></div>
        <p>還沒有食譜<br />點上方「新增」開始建立</p>
      </div>
    )
  }
  return (
    <div className={styles.recipeGrid}>
      {recipes.map(r => <RecipeCard key={r.id} recipe={r} onOpen={onOpen} />)}
    </div>
  )
}

function levenshtein(a: string, b: string): number {
  const m=a.length, n=b.length
  const dp = Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0))
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++)
    dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])
  return dp[m][n]
}
