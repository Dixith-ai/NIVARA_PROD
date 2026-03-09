'use client'

import { useEffect } from 'react'
import { initCanny } from '@/lib/canny'

export default function CannyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initCanny()
  }, [])

  return <>{children}</>
}
