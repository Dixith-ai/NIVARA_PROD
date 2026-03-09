export function initCanny() {
  if (typeof window === 'undefined') return

  ;(function (w: Window & typeof globalThis, d: Document, i: string) {
    function l() {
      if (!d.getElementById(i)) {
        const f = d.getElementsByTagName('script')[0]
        const e = d.createElement('script') as HTMLScriptElement
        e.type = 'text/javascript'
        e.async = true
        e.src = 'https://canny.io/sdk.js'
        e.id = i
        f.parentNode?.insertBefore(e, f)
      }
    }
    if (typeof (w as unknown as { Canny?: unknown }).Canny !== 'function') {
      const c = function (...args: unknown[]) { c.q.push(args) }
      c.q = [] as unknown[]
      ;(w as unknown as { Canny: typeof c }).Canny = c
      if (d.readyState === 'loading') {
        d.addEventListener('DOMContentLoaded', l)
      } else {
        l()
      }
    }
  })(window, document, 'canny-jssdk')
}
