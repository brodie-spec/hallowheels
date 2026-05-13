'use client'

import Script from 'next/script'

export default function NeonForm() {
  return (
    <div aria-label="Sponsorship donation form" style={{ minHeight: '400px' }}>
      <Script
        src="https://atdevicesforkids.app.neoncrm.com/forms/share/Rk9STS1FTUJFRFNIQVJJTkctQ09ERDE4"
        strategy="lazyOnload"
      />
    </div>
  )
}
