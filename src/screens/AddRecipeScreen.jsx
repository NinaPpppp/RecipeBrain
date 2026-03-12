import { useState, useEffect, useRef } from 'react'

// Asset URLs from Figma (nodes 146:5860, 146:5874, 146:5887)
const ASSETS = {
  iconLinkEmpty: 'https://www.figma.com/api/mcp/asset/7562c50b-78e2-4374-951d-f37cc7c3dea9',
  iconLinkFull:  'https://www.figma.com/api/mcp/asset/57d9b10c-9365-45df-bf01-400eec035c6c',
  iconSpinner:   'https://www.figma.com/api/mcp/asset/a06c5814-6d1b-4bba-978b-7d99ebdb6d77',
  iconPerson:    'https://www.figma.com/api/mcp/asset/54c941cf-9722-40e8-8ddd-871844280cf4',
  iconClock:     'https://www.figma.com/api/mcp/asset/4d2bfd91-0714-4527-a6de-3f9c849ff41f',
  iconCheck:     'https://www.figma.com/api/mcp/asset/11b269db-3829-42c0-9eca-56f18bb0fef3',
  iconTagX:      'https://www.figma.com/api/mcp/asset/43b8a133-1318-4e55-937f-7659cd3a82b4',
  imgRecipe:     'https://www.figma.com/api/mcp/asset/4881a5f2-76df-48ad-a0f5-d5d748b660ff',
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          '#f5f5f5',
  white:       '#ffffff',
  primary:     '#262626',
  secondary:   '#757575',
  placeholder: '#999999',
  skeleton:    'rgba(120,120,128,0.16)',
  saveBg:      '#3982f0',
}

const INITIAL_TAGS = ['Japanese', 'Noodle', 'Ramen', 'Spicy']

// Difficulty bars — Intermediate = [11, 5, 5] heights (bars 3px wide, gap 1px)
function DiffBars() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, width: 11, height: 9, flexShrink: 0 }}>
      {[11, 5, 5].map((h, i) => (
        <div key={i} style={{ width: 3, height: h, background: C.secondary, flexShrink: 0 }} />
      ))}
    </div>
  )
}

// ── AddRecipeScreen ───────────────────────────────────────────────────────────
// Props:
//   isOpen   boolean — controls slide-in from right animation
//   onClose  fn      — called when Cancel or Save to Collection is tapped
export default function AddRecipeScreen({ isOpen, onClose }) {
  const [step, setStep] = useState('url-input') // 'url-input' | 'processing' | 'review'
  const [url,  setUrl]  = useState('')
  const [tags, setTags] = useState(INITIAL_TAGS)
  const inputRef        = useRef(null)

  // Auto-transition: processing → review after 2 seconds
  useEffect(() => {
    if (step !== 'processing') return
    const t = setTimeout(() => setStep('review'), 2000)
    return () => clearTimeout(t)
  }, [step])

  // Reset state after the slide-out animation finishes
  useEffect(() => {
    if (isOpen) return
    const t = setTimeout(() => {
      setStep('url-input')
      setUrl('')
      setTags(INITIAL_TAGS)
    }, 400)
    return () => clearTimeout(t)
  }, [isOpen])

  function handleSubmitUrl() {
    if (url.trim()) setStep('processing')
  }

  function removeTag(tag) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  return (
    <div
      style={{
        // Positioning — covers the full phone shell
        position: 'absolute',
        inset: 0,
        zIndex: 30,

        // Slide-in from right
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',

        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 48,
      }}
    >

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {/* justify-between: Cancel | Add Recipe (centered via 60px spacer) */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 0,
          paddingBottom: 16,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 16,
            lineHeight: '24px',
            color: C.secondary,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>

        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 17,
            lineHeight: '25.5px',
            color: C.primary,
          }}
        >
          Add Recipe
        </span>

        {/* 60px spacer mirrors Cancel width to keep title centered */}
        <div style={{ width: 60 }} />
      </div>

      {/* ── Scrollable content area ─────────────────────────────────────────── */}
      {/* Outer px:24 → 392px inner content width */}
      <div
        className="scrollbar-none"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 32,
        }}
      >

        {/* ── URL input field (present in all 3 states) ── */}
        {/* pt:24, h:58, rd:16, bg white, px:16, gap:12 */}
        <div style={{ paddingTop: 24, marginBottom: step === 'url-input' ? 12 : 32 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 58,
              background: C.white,
              borderRadius: 16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {/* Chain-link icon: 20×20px — swaps to filled variant when URL entered */}
            <div style={{ position: 'relative', width: 20, height: 20, flexShrink: 0 }}>
              <img
                src={url ? ASSETS.iconLinkFull : ASSETS.iconLinkEmpty}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            </div>

            {/* Editable input only in url-input step; other steps show static text */}
            {step === 'url-input' ? (
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmitUrl()}
                placeholder="Paste a YouTube link here..."
                className="add-recipe-input"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: 'normal',
                  color: C.primary,
                  minWidth: 0,
                }}
              />
            ) : (
              <span
                style={{
                  flex: 1,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: '22.5px',
                  color: C.primary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                }}
              >
                {url || 'youtube.com/watch?v=a3k...'}
              </span>
            )}
          </div>
        </div>

        {/* ════════════ URL INPUT STATE ════════════ */}
        {step === 'url-input' && (
          // Helper text — centered, px:32, 12px/#999
          <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 32, paddingRight: 32 }}>
            <p
              style={{
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '19.5px',
                color: C.placeholder,
                textAlign: 'center',
              }}
            >
              Works with YouTube videos and Shorts.
            </p>
          </div>
        )}

        {/* ════════════ PROCESSING STATE ════════════ */}
        {step === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>

            {/* Skeleton card — w:317, h:357.75, centered in 392px content, rd:12 */}
            <div
              style={{
                width: 317,
                height: 357.75,
                background: C.white,
                borderRadius: 12,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
              }}
            >
              {/* Skeleton image area — h:237.75px */}
              <div style={{ height: 237.75, background: C.skeleton, flexShrink: 0 }} />

              {/* Skeleton content body — p:12, gap:12 */}
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Text skeleton lines — container w:249.047, gap:10 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 249.047 }}>
                  <div style={{ height: 14, background: C.skeleton, borderRadius: 4, opacity: 0.52 }} />
                  <div style={{ height: 14, background: C.skeleton, borderRadius: 4, opacity: 0.52, width: 175.797 }} />
                  <div style={{ height: 12, background: C.skeleton, borderRadius: 4, opacity: 0.52, width: 131.844 }} />
                </div>

                {/* Tag skeleton pills — h:24, gap:6 */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ height: 24, width: 70,  background: C.skeleton, borderRadius: 9999, opacity: 0.52 }} />
                  <div style={{ height: 24, width: 55,  background: C.skeleton, borderRadius: 9999, opacity: 0.52 }} />
                </div>

              </div>
            </div>

            {/* Loading indicator — gap:4 between icon and text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Spinner: 22.623px container, 16px icon, continuous CSS rotation */}
              <div
                className="spin-animation"
                style={{
                  width: 22.623,
                  height: 22.623,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ position: 'relative', width: 16, height: 16 }}>
                  <img
                    src={ASSETS.iconSpinner}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
                  />
                </div>
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: '19.5px',
                  color: C.placeholder,
                }}
              >
                Extracting recipe details...
              </p>
            </div>

          </div>
        )}

        {/* ════════════ REVIEW AND CONFIRM STATE ════════════ */}
        {step === 'review' && (
          <>

            {/* Recipe card — full 392px width, internal px:24 for sections → 344px */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 16, paddingBottom: 16 }}>

              {/* Upper content group — gap:12 between thumbnail+body and ingredients */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Thumbnail + card body — px:24 → 344px */}
                <div style={{ paddingLeft: 24, paddingRight: 24 }}>

                  {/* Recipe image — h:246, border-radius top:16 */}
                  <div
                    style={{
                      height: 246,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={ASSETS.imgRecipe}
                      alt="Spicy Miso Ramen"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* Card body — bg white, px:16, py:12, rd bottom:16, gap:16 */}
                  <div
                    style={{
                      background: C.white,
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 12,
                      paddingBottom: 12,
                      borderBottomLeftRadius: 16,
                      borderBottomRightRadius: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                    }}
                  >

                    {/* Title + metadata — gap:8 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                      {/* Title — Inter SemiBold 18px, #262626, px:4 */}
                      <div style={{ paddingLeft: 4, paddingRight: 4 }}>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: 18,
                            lineHeight: '24.75px',
                            color: C.primary,
                          }}
                        >
                          Spicy Miso Ramen
                        </p>
                      </div>

                      {/* Metadata row — gap:16 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

                        {/* Creator — person icon 9×9 + text, pl:4, gap:4 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4, flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: 9, height: 9, flexShrink: 0 }}>
                            <img src={ASSETS.iconPerson} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondary, whiteSpace: 'nowrap' }}>
                            Joshua Weissman
                          </span>
                        </div>

                        {/* Duration — clock icon 9×9 + text, pl:4, gap:4 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4, flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: 9, height: 9, flexShrink: 0 }}>
                            <img src={ASSETS.iconClock} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                          </div>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondary, whiteSpace: 'nowrap' }}>
                            Long
                          </span>
                        </div>

                        {/* Difficulty — bars 11×9 (Intermediate) + text, pl:4, gap:4 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4, flex: 1 }}>
                          <DiffBars />
                          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: C.secondary, whiteSpace: 'nowrap' }}>
                            Intermediate
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Description — Inter Regular 14px, #757575, lh:19.6, px:4 */}
                    <div style={{ paddingLeft: 4, paddingRight: 4 }}>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: '19.6px',
                          color: C.secondary,
                        }}
                      >
                        A rich pork-based ramen with soft-boiled egg and homemade spicy miso tare, using a 20-minute shortcut broth method.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Ingredients row — px:24 → 344px, white card rd:12, px:16, py:12, gap:8 */}
                <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                  <div
                    style={{
                      background: C.white,
                      borderRadius: 12,
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 12,
                      paddingBottom: 12,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    {/* Checkmark icon — 14×15.417px */}
                    <div style={{ position: 'relative', width: 14, height: 15.417, flexShrink: 0, marginTop: 1 }}>
                      <img src={ASSETS.iconCheck} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                    </div>
                    {/* Ingredients text — 12px / lh:15.6 / #757575 */}
                    <p
                      style={{
                        margin: 0,
                        flex: 1,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: 12,
                        lineHeight: '15.6px',
                        color: C.secondary,
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>Ingredients detected:</strong>
                      {' '}Pork belly, Miso paste, Ramen noodles, and 9 others
                    </p>
                  </div>
                </div>

              </div>

              {/* Tags section — px:24, flex-wrap, gap:8 */}
              <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {tags.map(tag => (
                    <div
                      key={tag}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop: 8,
                        paddingBottom: 8,
                        background: C.white,
                        borderRadius: 9999,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          fontSize: 12,
                          lineHeight: '18px',
                          color: C.secondary,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tag}
                      </span>
                      <button
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove ${tag}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {/* X icon — 12×12px */}
                        <div style={{ position: 'relative', width: 12, height: 12 }}>
                          <img src={ASSETS.iconTagX} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Save to Collection button — extra px:24 within 392px content → 344px button */}
            {/* pt:24 gap above button, button bg:#3982f0, py:16, rd:16 */}
            <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 24 }}>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  paddingTop: 16,
                  paddingBottom: 16,
                  borderRadius: 16,
                  background: C.saveBg,
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: '24px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
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
