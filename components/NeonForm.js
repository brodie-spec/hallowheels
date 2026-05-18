'use client'

export default function NeonForm() {
  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <button
        onClick={() => window.open(
          'https://atdevicesforkids.app.neoncrm.com/forms/hallowheels2026',
          'neon-form',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        )}
        className="btn btn-primary btn-lg"
        aria-label="Open secure sponsorship donation form"
      >
        Complete Your Sponsorship
      </button>
    </div>
  )
}
