import mixpanel from 'mixpanel-browser'

export function initMixpanel() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
      track_pageview: false,
      persistence: 'localStorage',
    })
  }
}

export { mixpanel }
