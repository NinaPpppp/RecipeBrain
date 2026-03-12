import { useRef, useCallback } from 'react'

/**
 * useDragScroll — mouse drag-to-scroll for horizontal scroll containers.
 *
 * Usage:
 *   const drag = useDragScroll()
 *   <div ref={drag.ref} {...drag.handlers} style={{ ...drag.style, overflowX: 'auto' }}>
 *
 * - Default cursor: grab
 * - While dragging: cursor grabbing, userSelect none
 * - Clicks on children still fire if the user didn't actually drag (< 5px movement)
 */
export function useDragScroll() {
  const ref       = useRef(null)
  const active    = useRef(false)   // is mouse held down
  const startX    = useRef(0)       // pageX at mousedown
  const scrolled  = useRef(0)       // scrollLeft at mousedown
  const moved     = useRef(false)   // did we actually drag (> threshold)?

  const DRAG_THRESHOLD = 5 // px — below this, treat as a click not a drag

  const onMouseDown = useCallback((e) => {
    if (!ref.current) return
    active.current   = true
    moved.current    = false
    startX.current   = e.pageX
    scrolled.current = ref.current.scrollLeft
    ref.current.style.cursor     = 'grabbing'
    ref.current.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!active.current || !ref.current) return
    const delta = e.pageX - startX.current
    if (Math.abs(delta) > DRAG_THRESHOLD) moved.current = true
    ref.current.scrollLeft = scrolled.current - delta
  }, [])

  const stopDrag = useCallback(() => {
    if (!ref.current) return
    active.current = false
    ref.current.style.cursor     = 'grab'
    ref.current.style.userSelect = ''
  }, [])

  // Suppress the click that fires after a drag-release so chips
  // don't activate when the user was only scrolling.
  const onClickCapture = useCallback((e) => {
    if (moved.current) {
      e.stopPropagation()
      moved.current = false
    }
  }, [])

  return {
    ref,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp:    stopDrag,
      onMouseLeave: stopDrag,
      onClickCapture,
    },
    /** Apply to the scroll container — sets grab cursor as default */
    style: { cursor: 'grab' },
  }
}
