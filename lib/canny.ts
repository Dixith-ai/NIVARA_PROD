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
    if (typeof (w as any).Canny !== 'function') {
      const c = function (...args: any[]) { c.q.push(args) }
      c.q = [] as any[]
      ;(w as any).Canny = c
      if (d.readyState === 'loading') {
        d.addEventListener('DOMContentLoaded', l)
      } else {
        l()
      }
    }
  })(window, document, 'canny-jssdk')
}
