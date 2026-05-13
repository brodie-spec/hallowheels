'use client'

import { useEffect, useState } from 'react'

function getTimeLeft(targetDate) {
  const now  = new Date()
  const then = new Date(targetDate)
  const diff = then - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: 'Days',    value: time.days },
    { label: 'Hours',   value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <>
      <style>{`
        .countdown {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .countdown-unit {
          text-align: center;
          min-width: 72px;
        }
        .countdown-value {
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--yellow);
          line-height: 1;
          display: block;
        }
        .countdown-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-top: 4px;
          display: block;
        }
        .countdown-sep {
          font-family: var(--font-display);
          font-size: 2.8rem;
          color: rgba(255,255,255,0.3);
          line-height: 1;
          padding-top: 4px;
          align-self: flex-start;
        }
      `}</style>
      <div
        className="countdown"
        role="timer"
        aria-label={`Countdown: ${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds until Hallowheels opens`}
        aria-live="off"
      >
        {units.map((unit, i) => (
          <div key={unit.label} style={{display:'flex', alignItems:'flex-start', gap:'16px'}}>
            <div className="countdown-unit">
              <span className="countdown-value" aria-hidden="true">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="countdown-label" aria-hidden="true">{unit.label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="countdown-sep" aria-hidden="true">:</span>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
