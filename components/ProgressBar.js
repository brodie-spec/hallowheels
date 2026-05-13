'use client'

import { useEffect, useState } from 'react'

export default function ProgressBar({ raised, goal }) {
  const [width, setWidth] = useState(0)
  const pct = Math.min(Math.round((raised / goal) * 100), 100)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div
      className="progress-track-dark"
      role="progressbar"
      aria-valuenow={raised}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-label={`$${raised.toLocaleString()} raised of $${goal.toLocaleString()} goal`}
    >
      <div
        className="progress-fill"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
