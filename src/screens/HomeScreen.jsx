import { useState, useEffect } from 'react'
import { useDragScroll } from '../hooks/useDragScroll'

import iconSearch from '../assets/icons/icon-search.svg'
import iconClock from '../assets/icons/icon-clock.svg'
import iconDot from '../assets/icons/icon-dot.svg'
import iconPlay from '../assets/icons/icon-play.svg'
import iconPlus from '../assets/icons/icon-plus.svg'
import iconAI from '../assets/icons/icon-ai.svg'

const recipeBg = 'https://www.figma.com/api/mcp/asset/e6dde089-81da-4dff-9585-1af7acee966e'

// ── Design tokens (Figma nodes 146:1846 & 201:3887) ──────────────────────────
const C = {
  brandBlue:     '#1361cd',
  appNameYellow: '#ffe316',
  primaryText:   '#262626',
  secondaryText: '#757575',
  white:         '#ffffff',
  filterActive:  '#363636',
  cardGlassBg:   'rgba(240,240,240,0.75)',
  tagBg:         'rgba(255,255,255,0.75)',
  addButtonBg:   'rgba(240,240,240,0.75)',
  aiFab:         '#3982f0',
  searchBarBg:   '#ffffff',
}


// ── Sub-components ────────────────────────────────────────────────────────────

// Difficulty bars icon — Figma: w=11px h=9px, gap=1px, each bar w=3px
// Intermediate: bars h=[11,5,5]   Advanced: bars h=[11,9,7]
function DifficultyIcon({ level }) {
  const bars = level === 'Advanced' ? [11, 9, 7] : [11, 5, 5]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, width: 11, height: 9 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, backgroundColor: C.secondaryText, flexShrink: 0 }} />
      ))}
    </div>
  )
}

// Recipe Card — Figma node 146:2013
// Card: rd-12, border 0.5px rgba(255,255,255,0.5), glass bg + backdrop-blur, shadow
// Body: pt-12 pb-16 px-12, gap-16 between title+meta and tags
function RecipeCard({ title, thumbnailUrl, youtubeUrl, cookTime, difficulty, tags }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        backdropFilter: 'blur(12.5px)',
        boxShadow: '0px 4px 30px 0px rgba(0,0,0,0.1)',
      }}
    >
      {/* Thumbnail — height: 113px */}
      <div style={{ position: 'relative', height: 113, width: '100%', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={thumbnailUrl || recipeBg}
          alt={title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Play button — bottom:8px right:9.5px padding:4px icon:12px */}
        <button
          aria-label="Watch on YouTube"
          onClick={() => window.open(youtubeUrl, '_blank', 'noopener,noreferrer')}
          style={{
            position: 'absolute', bottom: 8, right: 9.5,
            padding: 4, borderRadius: 1000,
            background: 'rgba(83,83,83,0.2)',
            backdropFilter: 'blur(12.5px)',
            boxShadow: '0px 4px 30px 0px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center',
            border: 'none', cursor: 'pointer',
          }}
        >
          <img src={iconPlay} alt="" style={{ width: 12, height: 12, display: 'block' }} />
        </button>
      </div>

      {/* Card body — pt:12 pb:16 px:12, gap:16; glass bg + L/R/B border only (no top border — thumbnail is flush) */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        paddingTop: 12, paddingBottom: 16, paddingLeft: 12, paddingRight: 12,
        background: C.cardGlassBg,
        borderLeft: '0.5px solid rgba(255,255,255,0.5)',
        borderRight: '0.5px solid rgba(255,255,255,0.5)',
        borderBottom: '0.5px solid rgba(255,255,255,0.5)',
        flexShrink: 0,
      }}>
        {/* Title + meta — gap:8 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Title — Inter SemiBold 14px #262626 lh:19.25px */}
          <p style={{
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
            lineHeight: '19.25px', color: C.primaryText,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
          }}>
            {title}
          </p>

          {/* Meta row — gap:8 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Cook time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <img src={iconClock} alt="" style={{ width: 11.642, height: 11.642, flexShrink: 0 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '18px', color: C.secondaryText, whiteSpace: 'nowrap' }}>
                {cookTime}
              </span>
            </div>
            {/* Dot separator — 2.5×2.5px */}
            <img src={iconDot} alt="" style={{ width: 2.5, height: 2.5, flexShrink: 0 }} />
            {/* Difficulty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <DifficultyIcon level={difficulty} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '18px', color: C.secondaryText, whiteSpace: 'nowrap' }}>
                {difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Tags — gap:8 opacity:0.8 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.8 }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4,
              borderRadius: 1000, background: C.tagBg,
              fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 10,
              lineHeight: '16.5px', color: C.secondaryText, whiteSpace: 'nowrap',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Home Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen({ recipes = [], onChatOpen, onAddOpen }) {
  const chipDrag = useDragScroll()
  const [activeChip, setActiveChip] = useState('All')
  const [shuffled, setShuffled] = useState(() => {
    const arr = [...recipes]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })

  // Prepend any newly imported recipes without reshuffling existing cards
  useEffect(() => {
    setShuffled(prev => {
      const prevIds = new Set(prev.map(r => r.id))
      const newOnes = recipes.filter(r => !prevIds.has(r.id))
      if (newOnes.length === 0) return prev
      return [...newOnes, ...prev]
    })
  }, [recipes])

  const [query, setQuery] = useState('')

  const filterChips = ['All', ...Array.from(new Set(shuffled.flatMap((r) => r.tags)))]

  const chipFiltered = activeChip === 'All' ? shuffled : shuffled.filter((r) => r.tags.includes(activeChip))
  const visibleRecipes = query.trim() === '' ? chipFiltered : (() => {
    const q = query.trim().toLowerCase()
    return chipFiltered.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      (r.channelName || '').toLowerCase().includes(q) ||
      (r.cuisine || '').toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
    )
  })()

  return (
    <div className="home-screen-bg" style={{ position: 'relative', width: '100%', height: '100%' }}>

      {/* Main content column */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: 24, paddingTop: 64 }}>

        {/* Header — pl:24 pr:40 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 24, paddingRight: 40, flexShrink: 0 }}>
          <h1 style={{ fontFamily: "'PaperCut', sans-serif", fontWeight: 700, fontSize: 32, lineHeight: '30px', color: C.appNameYellow, margin: 0 }}>
            RecipeBrain
          </h1>
          {/* Add button — p:14 rd:1000 glass */}
          <button
            aria-label="Add recipe"
            onClick={onAddOpen}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 14, borderRadius: 1000,
              border: '0.5px solid rgba(255,255,255,0.5)',
              background: C.addButtonBg, backdropFilter: 'blur(12.5px)',
              boxShadow: '0px 4px 30px 0px rgba(0,0,0,0.1)',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <div style={{ position: 'relative', width: 18.667, height: 18.667, flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: '-5.36%' }}>
                <img src={iconPlus} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
              </div>
            </div>
          </button>
        </div>

        {/* Search + filter chips + grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, minHeight: 0 }}>

          {/* Search bar — px:16 py:12 rd:16 shadow — Figma: max-w:390px */}
          <div style={{ paddingLeft: 24, paddingRight: 24, flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
              borderRadius: 16, background: C.searchBarBg,
              boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.1)',
            }}>
              <img src={iconSearch} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your recipes..."
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 16,
                  color: '#262626', lineHeight: 'normal',
                }}
              />
            </div>
          </div>

          {/* Filter chip row — block scroll wrapper + inline-flex inner row
              Touch: native scroll via overflow-x: auto + -webkit-overflow-scrolling
              Desktop: mouse drag via useDragScroll hook
              Active: bg #363636 text white   Inactive: bg white text #757575
              px:16 py:12  radius:1000px  gap:8px  font: Inter Medium 13px lh:19.5px */}
          <div
            ref={chipDrag.ref}
            className="scrollbar-none"
            style={{
              overflowX: 'auto',
              overflowY: 'visible',
              WebkitOverflowScrolling: 'touch',
              flexShrink: 0,
              ...chipDrag.style,
            }}
            {...chipDrag.handlers}
          >
            <div style={{ display: 'inline-flex', gap: 8, paddingLeft: 24, paddingRight: 24 }}>
              {filterChips.map((chip) => {
                const active = chip === activeChip
                return (
                  <button
                    key={chip}
                    onClick={() => { setActiveChip(chip); setQuery('') }}
                    style={{
                      paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                      borderRadius: 1000, border: 'none',
                      background: active ? C.filterActive : C.white,
                      fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13,
                      lineHeight: '19.5px',
                      color: active ? C.white : C.secondaryText,
                      whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {chip}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recipe grid — 2-col, col-gap:24px row-gap:16px (from Figma)
              16 cards, vertically scrollable, pb:100 to clear FAB */}
          <div className="scrollbar-none" style={{ flex: 1, overflowY: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 100 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              columnGap: 24,
              rowGap: 16,
            }}>
              {visibleRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  title={recipe.title}
                  thumbnailUrl={recipe.thumbnailUrl}
                  youtubeUrl={recipe.youtubeUrl}
                  cookTime={recipe.metadata.timeLevel}
                  difficulty={recipe.metadata.difficulty}
                  tags={recipe.tags.slice(0, 2)}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* AI floating chat FAB — bottom:32 right:24, p:16, rd:1000, icon:21px */}
      <button
        aria-label="Open AI chat"
        onClick={onChatOpen}
        style={{
          position: 'absolute', bottom: 32, right: 24,
          padding: 16, borderRadius: 1000, border: 'none',
          background: C.aiFab, backdropFilter: 'blur(12.5px)',
          boxShadow: '0px 4px 30px 0px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
        }}
      >
        <img src={iconAI} alt="" style={{ width: 21, height: 21 }} />
      </button>

    </div>
  )
}
