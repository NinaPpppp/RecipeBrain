import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { callGemini } from '../services/gemini'
import { useDragScroll } from '../hooks/useDragScroll'

// Asset URLs — refreshed from Figma 2026-03-10
const ASSETS = {
  // Sheet chrome
  iconSend:       'https://www.figma.com/api/mcp/asset/d3804b35-30a3-4058-8476-66c63188cbdd',
  iconClose:      'https://www.figma.com/api/mcp/asset/0fb750d6-32f1-4204-b4d7-9ed71332115d',
  iconAIsmall:    'https://www.figma.com/api/mcp/asset/5909171d-b384-4138-8c29-ad0f743c1dc4',
  iconAIheader:   'https://www.figma.com/api/mcp/asset/331c02e4-f8ae-4e2c-b0e9-0ac879d0b1b7',
  // Deep Dive card
  youtubeLogo:    'https://www.figma.com/api/mcp/asset/60045569-1eaf-4865-a560-ca634685ce09',
  iconPerson:     'https://www.figma.com/api/mcp/asset/68a953f5-e1c6-447c-9824-a3e28921d56a',
  iconClock:      'https://www.figma.com/api/mcp/asset/2e562bba-0dca-43ae-88ad-c25b72bfe095',
  // Filter cards
  filterClock:    'https://www.figma.com/api/mcp/asset/a2a29afb-303a-4fa9-842e-3335feec4b1f',
  filterPlayBtn:  'https://www.figma.com/api/mcp/asset/e5eecc39-6941-4c75-a8dd-321bdbe6418b',
  // Comparison card
  comparePlay:    'https://www.figma.com/api/mcp/asset/aba757ec-a268-443c-a64f-c0f61914039c',
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  sheetBg:       '#f5f5f5',
  grabber:       '#cccccc',
  cancelBg:      'rgba(120,120,128,0.16)',
  aiBlueBg:      '#3982f0',
  chipBg:        '#e4e4e4',
  chipText:      '#404040',
  helperText:    '#999999',
  inputBg:       '#ffffff',
  sendGray:      '#cccccc',
  sendBlue:      '#3982f0',
  primaryText:   '#262626',
  secondaryText: '#757575',
  borderColor:   '#e4e4e4',
}

// Sheet heights (px) — Figma medium detent: top=556.8 → visible=399.2px; large=full screen
const MEDIUM_H = 399
const LARGE_H  = 956

const SUGGESTIONS = [
  'What can I make in under 20 minutes?',
  'Compare all of my pasta recipes',
]

// ── Shared: difficulty bars icon ──────────────────────────────────────────────
// Container w:11px h:9px, items-end, gap:1px, bars w:3px each
function DifficultyBars({ level }) {
  const bars = level === 'Advanced' ? [11, 9, 7] : [11, 5, 5]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, width: 11, height: 9, flexShrink: 0 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, background: C.secondaryText, flexShrink: 0 }} />
      ))}
    </div>
  )
}

// ── DeepDiveCard — Figma node 283:3254 ───────────────────────────────────────
// Hero image 246px top-radius:16 → white body: pt:12 px:16 pb:16 gap:24
// Meta: Creator (person icon 9px) | CookTime (clock icon 9px) | Difficulty (bars)
// Description 14px regular #757575 lh:19.6px → Key ingredients label+value
// Watch Video CTA: bg:red rd:16 py:12 full-width YouTube logo + "Watch Video"
function DeepDiveCard({ recipe }) {
  const keyIngredients = recipe.ingredients?.slice(0, 5).map(i => i.name).join(', ') || ''
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Hero image — h:246px top-radius:16px, no play button overlay per Figma */}
      <div style={{ height: 246, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={recipe.thumbnailUrl}
          alt={recipe.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Content panel — bg:white bottom-radius:16px pt:12 px:16 pb:16 gap:24 */}
      <div style={{
        background: '#ffffff',
        borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
        padding: '12px 16px 16px 16px',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Title + meta — gap:8 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Title — 18px semibold #262626 lh:24.75px pl:4 */}
            <div style={{ paddingLeft: 4 }}>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 18, lineHeight: '24.75px', color: C.primaryText, margin: 0 }}>
                {recipe.title}
              </h3>
            </div>

            {/* Meta row — gap:16, each item pl:4 icon:9px text:13px regular #757575 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Creator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4 }}>
                <img src={ASSETS.iconPerson} alt="" style={{ width: 9, height: 9, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondaryText, whiteSpace: 'nowrap' }}>
                  {recipe.channelName}
                </span>
              </div>
              {/* Cook time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4 }}>
                <img src={ASSETS.iconClock} alt="" style={{ width: 9, height: 9, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondaryText, whiteSpace: 'nowrap' }}>
                  {recipe.metadata?.timeLevel}
                </span>
              </div>
              {/* Difficulty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4 }}>
                <DifficultyBars level={recipe.metadata?.difficulty} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondaryText, whiteSpace: 'nowrap' }}>
                  {recipe.metadata?.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Description + key ingredients — gap:8 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Description — 14px regular #757575 lh:19.6px px:4 */}
            <div style={{ paddingLeft: 4 }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '19.6px', color: C.secondaryText, margin: 0 }}>
                {recipe.methodSummary}
              </p>
            </div>
            {/* Key ingredients — label:13px medium #404040 lh:18px  value:13px regular #757575 lh:19.6px */}
            {keyIngredients && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ paddingLeft: 4 }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, lineHeight: '18px', color: '#404040', margin: 0 }}>
                    Key ingredients
                  </p>
                </div>
                <div style={{ paddingLeft: 4 }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.6px', color: C.secondaryText, margin: 0 }}>
                    {keyIngredients}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Watch Video CTA — bg:red rd:16 py:12 full-width gap:8 */}
        <button
          onClick={() => window.open(recipe.youtubeUrl, '_blank', 'noopener,noreferrer')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', paddingTop: 12, paddingBottom: 12,
            borderRadius: 16, background: 'red', border: 'none', cursor: 'pointer',
          }}
        >
          <img src={ASSETS.youtubeLogo} alt="" style={{ width: 26, height: 27.5, flexShrink: 0 }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#ffffff' }}>
            Watch Video
          </span>
        </button>
      </div>
    </div>
  )
}

// ── FilterCard — Figma node 283:3595 ─────────────────────────────────────────
// Stack of Chat_Cards: bg:white p:12 rd:12 — thumbnail 52×52 rd:8 | title+cookTime | play circle
// Clock: 11.642×11.7px  Title: 14px semibold #262626 lh:21px  CookTime: 12px medium #757575 lh:18px
// Play button: bg:rgba(83,83,83,0.2) rd:50px p:8 icon:12px
function FilterCard({ recipes }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          style={{
            background: '#ffffff', borderRadius: 12, padding: 12,
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          {/* Thumbnail — 52×52 rd:8 */}
          <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={recipe.thumbnailUrl}
              alt={recipe.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Title + cook time — gap:4 flex:1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, lineHeight: '21px',
              color: C.primaryText, margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {recipe.title}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <img src={ASSETS.filterClock} alt="" style={{ width: 11.642, height: 11.7, flexShrink: 0 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '18px', color: C.secondaryText }}>
                {recipe.metadata?.timeLevel}
              </span>
            </div>
          </div>

          {/* Play button — gray circle p:8 opens YouTube */}
          <button
            onClick={() => window.open(recipe.youtubeUrl, '_blank', 'noopener,noreferrer')}
            style={{
              background: 'rgba(83,83,83,0.2)', borderRadius: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 8, flexShrink: 0, border: 'none', cursor: 'pointer',
            }}
          >
            <img src={ASSETS.filterPlayBtn} alt="Watch" style={{ width: 12, height: 12, display: 'block' }} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── ComparisonCard — Figma node 283:3962 ─────────────────────────────────────
// Horizontally scrollable if >2 recipes. Each column: w:151px
// Image header: h:121px — cover img + play btn (top:4.75 right:5) + glass name label (bottom)
// Rows: Cook time (minH:65px) | Difficulty | Key ingredients (highlight blue-5%) | Equipment
// Row label: 12px regular #404040 lh:16.5px  Value: 12–14px medium #363636 lh:19.5px
// Card shadow: 0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)
// dynamic:true rows + title overlays are height-equalized via useLayoutEffect
const COMP_ROWS = [
  { key: 'cooktime',     label: 'Cook time',       getValue: (r) => r.metadata?.timeLevel || '—',                          highlight: false, minH: 65,   valueFontSize: 14, dynamic: false },
  { key: 'difficulty',   label: 'Difficulty',      getValue: (r) => r.metadata?.difficulty || '—',                         highlight: false, minH: null, valueFontSize: 14, dynamic: false },
  { key: 'ingredients',  label: 'Key ingredients', getValue: (r) => r.ingredients?.map(i => i.name).join(', ') || '—',     highlight: true,  minH: null, valueFontSize: 12, dynamic: true  },
  { key: 'equipment',    label: 'Equipment',       getValue: (r) => r.equipment?.join(', ') || '—',                        highlight: false, minH: null, valueFontSize: 12, dynamic: true  },
]

function ComparisonCard({ recipes }) {
  const drag = useDragScroll()
  const cardRef = useRef(null)

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return

    // Equalize title overlays
    const titleCells = el.querySelectorAll('[data-row="title-overlay"]')
    if (titleCells.length > 0) {
      titleCells.forEach(c => { c.style.minHeight = '' })
      const maxH = Math.max(...Array.from(titleCells).map(c => c.scrollHeight))
      titleCells.forEach(c => { c.style.minHeight = maxH + 'px' })
    }

    // Equalize each dynamic data row
    COMP_ROWS.filter(r => r.dynamic).forEach(row => {
      const cells = el.querySelectorAll(`[data-row="${row.key}"]`)
      if (cells.length > 0) {
        cells.forEach(c => { c.style.minHeight = '' })
        const maxH = Math.max(...Array.from(cells).map(c => c.scrollHeight))
        cells.forEach(c => { c.style.minHeight = maxH + 'px' })
      }
    })
  }, [recipes])

  return (
    <div
      ref={drag.ref}
      className="comparison-scroll"
      style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', ...drag.style }}
      {...drag.handlers}
    >
      <div
        ref={cardRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${recipes.length}, 151px)`,
          background: '#ffffff',
        }}
      >
        {recipes.map((recipe, ci) => (
          <div key={recipe.id} style={{ minWidth: 140, width: 151, display: 'flex', flexDirection: 'column', borderRight: ci < recipes.length - 1 ? '1px solid #e4e4e4' : 'none', background: '#ffffff' }}>
            {/* Image header — h:121px */}
            <div style={{ height: 121, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={recipe.thumbnailUrl}
                alt={recipe.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Play button — top:4.75 right:5 glass blur */}
              <button
                onClick={() => window.open(recipe.youtubeUrl, '_blank', 'noopener,noreferrer')}
                style={{
                  position: 'absolute', top: 4.75, right: 5,
                  backdropFilter: 'blur(12.5px)', background: 'rgba(83,83,83,0.2)',
                  borderRadius: 1000, boxShadow: '0px 4px 30px rgba(0,0,0,0.1)',
                  padding: 4, display: 'flex', alignItems: 'center',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <img src={ASSETS.comparePlay} alt="" style={{ width: 12, height: 12, display: 'block' }} />
              </button>
              {/* Name label — glass bar anchored to bottom, px:12 py:4 */}
              <div
                data-row="title-overlay"
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(240,240,240,0.75)',
                  paddingLeft: 12, paddingRight: 12, paddingTop: 4, paddingBottom: 4,
                }}
              >
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
                  lineHeight: '16.25px', color: '#363636', margin: 0, width: 93,
                }}>
                  {recipe.title}
                </p>
              </div>
            </div>

            {/* Data rows */}
            {COMP_ROWS.map((row, ri) => (
              <div
                key={row.key}
                data-row={row.dynamic ? row.key : undefined}
                style={{
                  borderBottom: ri < COMP_ROWS.length - 1 ? '1px solid #e4e4e4' : 'none',
                  padding: 12,
                  display: 'flex', flexDirection: 'column', gap: 4,
                  background: row.highlight ? 'rgba(57,130,240,0.05)' : '#ffffff',
                  ...(row.minH ? { minHeight: row.minH } : {}),
                }}
              >
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '16.5px', color: '#404040', margin: 0 }}>
                  {row.label}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: row.valueFontSize, lineHeight: '19.5px', color: '#363636', margin: 0 }}>
                  {row.getValue(recipe)}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ChatSheet ─────────────────────────────────────────────────────────────────
// Props:
//   isOpen   boolean — controls slide-in/out
//   onClose  fn      — called when X is tapped
//   recipes  array   — full RECIPES collection for AI context + card rendering
//
// Sheet states:
//   Starter  (no messages) — medium detent, h:399px, suggestion chips visible
//   Expanded (has messages)— large detent,  h:956px, chat thread scrollable
//   Transition on send: springy height animation 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
export default function ChatSheet({ isOpen, onClose, recipes = [] }) {
  const [inputText,  setInputText]  = useState('')
  const [messages,   setMessages]   = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading,  setIsLoading]  = useState(false)
  const inputRef    = useRef(null)
  const messagesEnd = useRef(null)

  const hasInput    = inputText.trim().length > 0 && !isLoading
  const hasMessages = messages.length > 0

  // Scroll to bottom of thread after each new message
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset state after slide-out animation completes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setMessages([])
        setInputText('')
        setIsExpanded(false)
      }, 380)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  async function sendMessage() {
    const text = inputText.trim()
    if (!text || isLoading) return
    setIsExpanded(true)
    setInputText('')
    setIsLoading(true)
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'ai', text: 'Thinking...', cardType: 'text', recipeIds: [], loading: true },
    ])

    const raw = await callGemini(text, recipes)

    let aiMsg = { role: 'ai', cardType: 'text', recipeIds: [] }
    try {
      const parsed = JSON.parse(raw)
      aiMsg.text      = parsed.message    || raw
      aiMsg.cardType  = parsed.responseType || 'text'
      aiMsg.recipeIds = parsed.recipeIds  || []
    } catch {
      // Gemini returned plain text — display as-is
      aiMsg.text = raw
    }

    setMessages(prev => [...prev.slice(0, -1), aiMsg])
    setIsLoading(false)
  }

  function onChipTap(chipText) {
    setInputText(chipText)
    inputRef.current?.focus()
  }

  const sheetHeight = isExpanded ? LARGE_H : MEDIUM_H

  return (
    <div
      style={{
        // Position
        position: 'absolute', left: 0, bottom: 0,
        width: '100%', zIndex: 20,

        // Panel styling — Figma Chat_State
        background: C.sheetBg,
        borderTopLeftRadius: isExpanded ? 0 : 24, borderTopRightRadius: isExpanded ? 0 : 24,
        boxShadow: '0px -4px 24px 0px rgba(0,0,0,0.12)',

        // Layout
        display: 'flex', flexDirection: 'column',
        paddingBottom: 32,
        height: sheetHeight,
        overflow: 'hidden',

        // Slide + spring-expand animations
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: isExpanded
          ? 'transform 0.35s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-top-left-radius 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-top-right-radius 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
    >

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>

        {/* Drag handle — pt:12 w:40 h:4 #ccc round */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <div style={{ width: 40, height: 4, background: C.grabber, borderRadius: 9999 }} />
        </div>

        {isExpanded ? (
          /* Large detent header: [AI icon + "RecipeBrain"] [cancel]
             border-bottom:1px #e4e4e4  px:24 pt:16 pb:17 */
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 17,
            borderBottom: `1px solid ${C.borderColor}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* AI icon — 39.2px transparent blur circle containing star icon */}
              <div style={{
                width: 39.2, height: 39.2, borderRadius: 9999,
                backdropFilter: 'blur(8.75px)', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, position: 'relative', overflow: 'hidden',
              }}>
                <img src={ASSETS.iconAIheader} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              </div>
              {/* "RecipeBrain" — 20px semibold #262626 lh:30px */}
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 20, lineHeight: '30px', color: C.primaryText }}>
                RecipeBrain
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close chat"
              style={{ width: 40, height: 40, borderRadius: 9999, background: C.cancelBg, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, position: 'relative', overflow: 'hidden' }}
            >
              <img src={ASSETS.iconClose} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            </button>
          </div>
        ) : (
          /* Medium detent header: cancel button right-aligned only — px:24 */
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: 24, paddingRight: 24 }}>
            <button
              onClick={onClose}
              aria-label="Close chat"
              style={{ width: 40, height: 40, borderRadius: 9999, background: C.cancelBg, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, position: 'relative', overflow: 'hidden' }}
            >
              <img src={ASSETS.iconClose} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            </button>
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}

      {!hasMessages ? (
        /* Starter state — AI icon + suggestion chips + helper text */
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>

            {/* AI circle — bg:#3982f0 p:10 rd:1000 blur:8.75px icon:16px */}
            <div style={{
              width: 36, height: 36, borderRadius: 9999,
              background: C.aiBlueBg, backdropFilter: 'blur(8.75px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <div style={{ position: 'relative', width: 16, height: 16, flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: '-4.37%' }}>
                  <img src={ASSETS.iconAIsmall} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>

            {/* Suggestion chips — px:24 gap:12 rd:16 bg:#e4e4e4 font:Medium 16px #404040 */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 12,
              paddingLeft: 24, paddingRight: 24,
              width: '100%', boxSizing: 'border-box',
            }}>
              {SUGGESTIONS.map(text => (
                <button
                  key={text}
                  onClick={() => onChipTap(text)}
                  style={{
                    width: '100%', padding: 16, borderRadius: 16,
                    background: C.chipBg, border: 'none',
                    fontFamily: 'Inter, sans-serif', fontWeight: 500,
                    fontSize: 16, lineHeight: '22.5px', color: C.chipText,
                    textAlign: 'left', cursor: 'pointer',
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Helper text — px:24 inner px:16 — 12px regular #999 */}
          <div style={{ paddingLeft: 24, paddingRight: 24, boxSizing: 'border-box' }}>
            <div style={{ paddingLeft: 16, paddingRight: 16 }}>
              <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '19.5px', color: C.helperText }}>
                Ask me anything about your saved recipes.
              </p>
            </div>
          </div>
        </div>

      ) : (
        /* Expanded chat thread — scrollable, gap:24 between message groups */
        <div
          className="scrollbar-none"
          style={{
            flex: 1, minHeight: 0, overflowY: 'auto',
            paddingLeft: 24, paddingRight: 24,
            paddingTop: 24, paddingBottom: 12,
            display: 'flex', flexDirection: 'column', gap: 24,
          }}
        >
          {messages.map((msg, i) => {
            if (msg.role === 'ai') console.log('[ChatSheet] ai msg:', msg)
            // Resolve recipe objects from IDs for card rendering
            const cardRecipes = (msg.recipeIds || [])
              .map(id => recipes.find(r => r.id === id))
              .filter(Boolean)
            const primaryRecipe = cardRecipes[0]

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: 12,
                }}
              >
                {msg.role === 'user' ? (
                  /* User bubble — bg:#e4e4e4 rd:16 px:20 py:12 */
                  <div style={{
                    background: '#e4e4e4', borderRadius: 16,
                    paddingLeft: 20, paddingRight: 20,
                    paddingTop: 12, paddingBottom: 12,
                    maxWidth: '80%',
                  }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 16, lineHeight: '20px', color: C.primaryText, margin: 0 }}>
                      {msg.text}
                    </p>
                  </div>
                ) : (
                  /* AI response — text bubble then optional structured card */
                  <>
                    {/* AI text — 15px regular #262626 px:20 py:12 */}
                    <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 12 }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 15, lineHeight: '22.5px', color: C.primaryText, margin: 0 }}>
                        {msg.text}
                      </p>
                    </div>
                    {/* Structured response cards */}
                    {msg.cardType === 'deepdive'   && primaryRecipe  && <div style={{ width: '100%' }}><DeepDiveCard recipe={primaryRecipe} /></div>}
                    {msg.cardType === 'filter'     && cardRecipes.length > 0 && <FilterCard recipes={cardRecipes} />}
                    {msg.cardType === 'comparison' && cardRecipes.length > 0 && (
                      <div style={{ width: 'calc(100% + 24px)', marginRight: -24 }}>
                        <ComparisonCard recipes={cardRecipes} />
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
          <div ref={messagesEnd} />
        </div>
      )}

      {/* ── Chatbox — px:24, h:58 rd:16 ─────────────────────────────────────── */}
      <div style={{ flexShrink: 0, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          height: 58, background: C.inputBg,
          borderRadius: 16, paddingLeft: 16, paddingRight: 16,
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your recipes..."
            className="chat-input"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 16,
              lineHeight: 'normal', color: C.primaryText, minWidth: 0,
            }}
          />
          {/* Send button — 31px circle, gray→blue on input
              Active: bg:#3982f0   Inactive: bg:#ccc
              Arrow icon: 11px at inset:-6.06% */}
          <button
            onClick={sendMessage}
            aria-label="Send message"
            style={{
              width: 31, height: 31, borderRadius: 9999,
              background: hasInput ? C.sendBlue : C.sendGray,
              border: 'none', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: hasInput ? 'pointer' : 'default',
              flexShrink: 0,
              transition: 'background 0.2s ease',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative', width: 11, height: 11, flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: '-6.06%' }}>
                <img src={ASSETS.iconSend} alt="" style={{ display: 'block', width: '100%', height: '100%' }} />
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>
  )
}
