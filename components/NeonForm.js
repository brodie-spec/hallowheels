'use client'

import { useEffect, useRef } from 'react'

const NEON_SCRIPT_URL = 'https://atdevicesforkids.app.neoncrm.com/forms/share/Rk9STS1FTUJFRFNIQVJJTkctQ09ERDE4'

export default function NeonForm() {
  const containerRef = useRef(null)
  const loadedRef    = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true

    const script = document.createElement('script')
    script.src  = NEON_SCRIPT_URL
    script.async = true

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-label="Sponsorship donation form"
      style={{ minHeight: '400px' }}
    />
  )
}
