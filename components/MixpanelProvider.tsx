'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initMixpanel, mixpanel } from '@/lib/mixpanel'

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    initMixpanel()
  }, [])

  useEffect(() => {
    if (pathname) {
      mixpanel.track('$pageview', { page: pathname })
    }
  }, [pathname])

  return <>{children}</>
}
