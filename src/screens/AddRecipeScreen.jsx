import { useState, useEffect, useRef } from 'react'
import iconLinkEmpty from '../assets/icons/icon-link-empty.svg'
import iconLinkFull from '../assets/icons/icon-link-full.svg'
import iconSpinner from '../assets/icons/icon-spinner.svg'
import iconPerson from '../assets/icons/icon-person.svg'
import iconClock from '../assets/icons/icon-clock.svg'
import iconCheck from '../assets/icons/icon-check.svg'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          '#f5f5f5',
  white:       '#ffffff',
  primary:     '#262626',
  secondary:   '#757575',
  placeholder: '#999999',
  skeleton:    'rgba(120,120,128,0.16)',
  saveBg:      '#3982f0',
  errorText:   '#d93025',
}

const IMPORT_LIMIT = 2

const FIXED_TAGS = ['Quick', 'Vegetarian', 'Desserts', 'Beverage', 'Dry Dishes', 'Soup Base']

function isYouTubeUrl(url) {
  try {
    const u = new URL(url.trim())
    return u.hostname === 'youtu.be' || u.hostname.includes('youtube.com')
  } catch {
    return false
  }
}

// Difficulty bars — mirrors ChatSheet DifficultyBars
function DiffBars({ level }) {
  const heights = level === 'Hard' ? [11, 9, 7] : [11, 5, 5]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, width: 11, height: 9, flexShrink: 0 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, background: C.secondary, flexShrink: 0 }} />
      ))}
    </div>
  )
}

// ── AddRecipeScreen ───────────────────────────────────────────────────────────
// Props:
//   isOpen            boolean — controls slide-in from right animation
//   onClose           fn      — called when Cancel is tapped
//   onRecipeImported  fn(recipe) — called after Save to Collection
//   importCount       number  — how many recipes imported this session
export default function AddRecipeScreen({ isOpen, onClose, onRecipeImported, importCount = 0 }) {
  const [step,    setStep]   = useState('url-input') // 'url-input' | 'processing' | 'review' | 'success'
  const [url,     setUrl]    = useState('')
  const [recipe,  setRecipe] = useState(null)   // extracted recipe object from API
  const [tags,    setTags]   = useState([])  // selected tags from FIXED_TAGS
  const [error,   setError]  = useState('')
  const inputRef = useRef(null)

  const atLimit = importCount >= IMPORT_LIMIT

  // Reset state after slide-out animation finishes
  useEffect(() => {
    if (isOpen) return
    const t = setTimeout(() => {
      setStep('url-input')
      setUrl('')
      setRecipe(null)
      setTags([])
      setError('')
    }, 400)
    return () => clearTimeout(t)
  }, [isOpen])

  async function handleSubmitUrl() {
    const trimmed = url.trim()
    if (!trimmed || atLimit) return

    if (!isYouTubeUrl(trimmed)) {
      setError('Please paste a valid YouTube link.')
      return
    }

    setError('')
    setStep('processing')

    try {
      const res = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStep('url-input')
        setError("Couldn't extract this recipe. Try a different YouTube video.")
        return
      }

      setRecipe(data)
      setTags([])  // all chips start unselected
      setStep('review')
    } catch {
      setStep('url-input')
      setError("Couldn't extract this recipe. Try a different YouTube video.")
    }
  }

  function toggleTag(tag) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function handleSave() {
    if (!recipe) return
    onRecipeImported({ ...recipe, tags })
    setStep('success')
    // Auto-close after showing success
    setTimeout(() => onClose(), 2000)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 48,
      }}
    >

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {step !== 'success' && (
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 16,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontFamily: 'Inter, sans-serif', fontWeight: 500,
              fontSize: 16, lineHeight: '24px', color: C.secondary, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 17, lineHeight: '25.5px', color: C.primary }}>
            Add Recipe
          </span>
          {/* 60px spacer mirrors Cancel width to keep title centered */}
          <div style={{ width: 60 }} />
        </div>
      )}

      {/* ── Scrollable content area ─────────────────────────────────────────── */}
      <div
        className="scrollbar-none"
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 32 }}
      >

        {/* ════════════ SUCCESS STATE ════════════ */}
        {step === 'success' && (
          <div
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              paddingTop: 80,
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 9999, background: C.saveBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 28, height: 28 }}>
                <img src={iconCheck} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'brightness(0) invert(1)' }} />
              </div>
            </div>
            <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 18, lineHeight: '24px', color: C.primary }}>
              Recipe saved!
            </p>
          </div>
        )}

        {/* ── URL input field (present in url-input, processing, and review states) ── */}
        {step !== 'success' && (
          <div style={{ paddingTop: 24, marginBottom: step === 'url-input' ? 12 : 32 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                height: 58, background: C.white,
                borderRadius: 16, paddingLeft: 16, paddingRight: 16,
              }}
            >
              <img src={iconLinkEmpty} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />

              {step === 'url-input' ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmitUrl()}
                  placeholder="Paste a YouTube link here..."
                  disabled={atLimit}
                  className="add-recipe-input"
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 16,
                    lineHeight: 'normal', color: C.primary, minWidth: 0,
                    opacity: atLimit ? 0.5 : 1,
                  }}
                />
              ) : (
                <span
                  style={{
                    flex: 1, fontFamily: 'Inter, sans-serif', fontWeight: 400,
                    fontSize: 16, lineHeight: '22.5px', color: C.primary,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
                  }}
                >
                  {url}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ════════════ URL INPUT STATE ════════════ */}
        {step === 'url-input' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingLeft: 32, paddingRight: 32 }}>
            {!atLimit && (
              <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '19.5px', color: C.placeholder, textAlign: 'center' }}>
                Works with YouTube videos and Shorts.
              </p>
            )}
            {error && !atLimit && (
              <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '19.5px', color: C.errorText, textAlign: 'center' }}>
                {error}
              </p>
            )}
            <button
              onClick={handleSubmitUrl}
              disabled={!url.trim() || atLimit}
              style={{
                marginTop: 8,
                width: '100%',
                paddingTop: 14, paddingBottom: 14,
                borderRadius: 16,
                background: url.trim() && !atLimit ? C.saveBg : C.skeleton,
                border: 'none',
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                fontSize: 16, lineHeight: '24px',
                color: '#ffffff', cursor: url.trim() && !atLimit ? 'pointer' : 'default',
                opacity: atLimit ? 0.5 : 1,
                transition: 'background 0.2s ease',
              }}
            >
              Extract Recipe
            </button>
            {/* Footer — import count + caption tip */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '19.5px', color: atLimit ? C.errorText : C.placeholder, textAlign: 'center' }}>
                {atLimit
                  ? "You've used all 2 imports for this session."
                  : `You have ${IMPORT_LIMIT - importCount} of ${IMPORT_LIMIT} imports remaining this session.`}
              </p>
              {!atLimit && (
                <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '19.5px', color: C.placeholder, textAlign: 'center' }}>
                  For best results, use videos with captions or subtitles enabled.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ════════════ PROCESSING STATE ════════════ */}
        {step === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>

            {/* Skeleton card */}
            <div
              style={{
                width: 317, height: 357.75,
                background: C.white, borderRadius: 12,
                overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0,
              }}
            >
              <div style={{ height: 237.75, background: C.skeleton, flexShrink: 0 }} />
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 249.047 }}>
                  <div style={{ height: 14, background: C.skeleton, borderRadius: 4, opacity: 0.52 }} />
                  <div style={{ height: 14, background: C.skeleton, borderRadius: 4, opacity: 0.52, width: 175.797 }} />
                  <div style={{ height: 12, background: C.skeleton, borderRadius: 4, opacity: 0.52, width: 131.844 }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ height: 24, width: 70,  background: C.skeleton, borderRadius: 9999, opacity: 0.52 }} />
                  <div style={{ height: 24, width: 55,  background: C.skeleton, borderRadius: 9999, opacity: 0.52 }} />
                </div>
              </div>
            </div>

            {/* Spinner + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                className="spin-animation"
                style={{ width: 22.623, height: 22.623, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <div style={{ position: 'relative', width: 16, height: 16 }}>
                  <img src={iconSpinner} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
                </div>
              </div>
              <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '19.5px', color: C.placeholder }}>
                Extracting recipe details...
              </p>
            </div>

          </div>
        )}

        {/* ════════════ REVIEW AND CONFIRM STATE ════════════ */}
        {step === 'review' && recipe && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 16, paddingBottom: 16 }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Thumbnail + card body */}
                <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                  <div style={{ height: 246, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={recipe.thumbnailUrl}
                      alt={recipe.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div
                    style={{
                      background: C.white,
                      paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                      borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
                      display: 'flex', flexDirection: 'column', gap: 16,
                    }}
                  >
                    {/* Title + metadata */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ paddingLeft: 4, paddingRight: 4 }}>
                        <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 18, lineHeight: '24.75px', color: C.primary }}>
                          {recipe.title}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4, flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: 9, height: 9, flexShrink: 0 }}>
                            <img src={iconPerson} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondary, whiteSpace: 'nowrap' }}>
                            {recipe.channelName}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4, flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: 9, height: 9, flexShrink: 0 }}>
                            <img src={iconClock} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondary, whiteSpace: 'nowrap' }}>
                            {recipe.metadata?.timeLevel}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4, flex: 1 }}>
                          <DiffBars level={recipe.metadata?.difficulty} />
                          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondary, whiteSpace: 'nowrap' }}>
                            {recipe.metadata?.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Method summary */}
                    <div style={{ paddingLeft: 4, paddingRight: 4 }}>
                      <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: '19.6px', color: C.secondary }}>
                        {recipe.methodSummary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ingredients row */}
                <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                  <div
                    style={{
                      background: C.white, borderRadius: 12,
                      paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                    }}
                  >
                    <div style={{ position: 'relative', width: 14, height: 15.417, flexShrink: 0, marginTop: 1 }}>
                      <img src={iconCheck} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                    </div>
                    <p style={{ margin: 0, flex: 1, fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 12, lineHeight: '15.6px', color: C.secondary }}>
                      <strong style={{ fontWeight: 600 }}>Ingredients detected:</strong>
                      {' '}
                      {(() => {
                        const ing = recipe.ingredients || []
                        const shown = ing.slice(0, 3).map(i => i.name).join(', ')
                        const rest = ing.length - 3
                        return rest > 0 ? `${shown}, and ${rest} other${rest > 1 ? 's' : ''}` : shown
                      })()}
                    </p>
                  </div>
                </div>

              </div>

              {/* Fixed toggleable tag chips — all 6 options, none pre-selected */}
              <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                <p style={{ margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, lineHeight: '18px', color: '#262626' }}>
                  Select one or more tags:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {FIXED_TAGS.map(tag => {
                    const selected = tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        style={{
                          paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                          borderRadius: 9999, border: selected ? 'none' : '1px solid #e4e4e4',
                          background: selected ? '#363636' : C.white,
                          fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 12,
                          lineHeight: '18px', color: selected ? '#ffffff' : C.secondary,
                          cursor: 'pointer', whiteSpace: 'nowrap',
                        }}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Save to Collection button */}
            <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 24 }}>
              <button
                onClick={handleSave}
                style={{
                  width: '100%', paddingTop: 16, paddingBottom: 16,
                  borderRadius: 16, background: C.saveBg, border: 'none',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  fontSize: 16, lineHeight: '24px', color: '#ffffff',
                  cursor: 'pointer', textAlign: 'center',
                }}
              >
                Save to Collection
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
