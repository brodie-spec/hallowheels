'use client'

import { useEffect, useRef, useState } from 'react'

const EVENTS = [
  {
    city: 'Hampton Roads',
    partner: 'Chartway Promise Foundation',
    address: 'Chartway Parking Lot, 5700 Cleveland St, VA Beach, VA 23462',
    time: '11AM – 1PM',
    date: 'October 24, 2026',
    image: '/events/trunk-or-treat-hampton-roads.png',
    imageAlt: 'Trunk or Treat flyer for Hampton Roads on October 24 2026 at Chartway Parking Lot with Chartway Promise Foundation',
  },
  {
    city: 'Roanoke',
    partner: 'Roanoke College',
    address: 'The Bast Center, 310 N Market Street, Salem, VA 24153',
    time: '10AM – 12PM',
    date: 'October 24, 2026',
    image: '/events/trunk-or-treat-roanoke.png',
    imageAlt: 'Trunk or Treat flyer for Roanoke on October 24 2026 at Roanoke College Bast Center',
  },
  {
    city: 'Richmond',
    partner: 'The Whole Family Foundation & MobilityWorks',
    address: '7450 Midlothian Tpke, Richmond, VA 23225',
    time: '1:30PM – 4:30PM',
    date: 'October 24, 2026',
    image: '/events/trunk-or-treat-richmond.png',
    imageAlt: 'Trunk or Treat flyer for Richmond on October 24 2026 at 7450 Midlothian Tpke with The Whole Family Foundation and MobilityWorks',
  },
]

function getMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export default function TrunkOrTreatEvents() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion.current) return

    intervalRef.current = setInterval(() => {
      setCurrent(i => (i + 1) % EVENTS.length)
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [])

  function goTo(index) {
    clearInterval(intervalRef.current)
    setCurrent(index)
    if (!reducedMotion.current) {
      intervalRef.current = setInterval(() => {
        setCurrent(i => (i + 1) % EVENTS.length)
      }, 4000)
    }
  }

  function prev() {
    goTo((current - 1 + EVENTS.length) % EVENTS.length)
  }

  function next() {
    goTo((current + 1) % EVENTS.length)
  }

  function handleCarouselKey(e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  }

  return (
    <>
      <style>{`
        .tot-section {
          background: var(--white);
          padding: 80px 0;
        }
        .tot-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .tot-header h2 {
          margin-bottom: 8px;
        }

        /* ── Event cards ── */
        .tot-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
        }
        .tot-card {
          background: var(--white);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        .tot-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .tot-card:focus-visible {
          outline: 3px solid var(--yellow);
          outline-offset: 2px;
        }
        .tot-card-img {
          aspect-ratio: 3/4;
          overflow: hidden;
          background: var(--cream-dark);
        }
        .tot-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
          display: block;
        }
        .tot-card:hover .tot-card-img img {
          transform: scale(1.03);
        }
        .tot-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .tot-card-city {
          font-family: var(--font-display);
          font-size: 1.35rem;
          color: var(--navy);
          margin-bottom: 6px;
        }
        .tot-card-partner {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--orange);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
        }
        .tot-card-details {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
          flex: 1;
        }
        .tot-card-details li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .tot-detail-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }
        .tot-directions-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 11px;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.875rem;
          border: 2px solid var(--navy);
          color: var(--navy);
          background: transparent;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .tot-directions-btn:hover {
          background: var(--navy);
          color: var(--white);
        }
        .tot-directions-btn:focus-visible {
          outline: 3px solid var(--yellow);
          outline-offset: 2px;
        }

        /* ── Carousel ── */
        .tot-carousel-wrap {
          max-width: 560px;
          margin: 56px auto 0;
          padding: 0 24px;
        }
        .tot-carousel {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          background: var(--cream-dark);
          aspect-ratio: 3/4;
        }
        .tot-carousel-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .tot-carousel-slide.active {
          opacity: 1;
          pointer-events: auto;
        }
        @media (prefers-reduced-motion: reduce) {
          .tot-carousel-slide { transition: none; }
        }
        .tot-carousel-slide img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .tot-carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          background: rgba(27,61,110,0.75);
          color: var(--white);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .tot-carousel-btn:hover {
          background: var(--navy);
        }
        .tot-carousel-btn:focus-visible {
          outline: 3px solid var(--yellow);
          outline-offset: 2px;
        }
        .tot-carousel-prev { left: 12px; }
        .tot-carousel-next { right: 12px; }
        .tot-carousel-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
        .tot-carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--navy);
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s;
        }
        .tot-carousel-dot.active {
          background: var(--navy);
        }
        .tot-carousel-dot:focus-visible {
          outline: 3px solid var(--yellow);
          outline-offset: 2px;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .tot-grid { grid-template-columns: 1fr; max-width: 480px; }
          .tot-carousel-wrap { max-width: 480px; }
        }
        @media (max-width: 600px) {
          .tot-carousel-wrap { padding: 0 16px; }
        }
      `}</style>

      <section className="tot-section" aria-labelledby="tot-heading">
        <div className="tot-header container">
          <span className="section-label">Adaptive Trunk-or-Treat Events</span>
          <h2 id="tot-heading">Join Us In Person on October 24th</h2>
          <div className="divider" aria-hidden="true" />
        </div>

        {/* ── Event cards ── */}
        <ul className="tot-grid" role="list">
          {EVENTS.map((event) => (
            <li key={event.city} role="listitem">
              <article
                className="tot-card"
                aria-label={`${event.city} Trunk-or-Treat event on ${event.date}`}
              >
                <div className="tot-card-img">
                  <img src={event.image} alt={event.imageAlt} />
                </div>
                <div className="tot-card-body">
                  <div className="tot-card-city">{event.city}</div>
                  <div className="tot-card-partner">{event.partner}</div>
                  <ul className="tot-card-details" role="list">
                    <li>
                      <span className="tot-detail-icon" aria-hidden="true">📅</span>
                      <span>{event.date}</span>
                    </li>
                    <li>
                      <span className="tot-detail-icon" aria-hidden="true">🕐</span>
                      <span>{event.time}</span>
                    </li>
                    <li>
                      <span className="tot-detail-icon" aria-hidden="true">📍</span>
                      <span>{event.address}</span>
                    </li>
                  </ul>
                  <a
                    href={getMapsUrl(event.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tot-directions-btn"
                    aria-label={`Get directions to ${event.city} Trunk-or-Treat at ${event.address} (opens in new tab)`}
                  >
                    Get Directions
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* ── Carousel ── */}
        <div className="tot-carousel-wrap">
          <div
            role="region"
            aria-label="Event flyer carousel"
            aria-roledescription="carousel"
            onKeyDown={handleCarouselKey}
            tabIndex="0"
          >
            <div className="tot-carousel">
              {EVENTS.map((event, i) => (
                <div
                  key={event.city}
                  className={`tot-carousel-slide${i === current ? ' active' : ''}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${EVENTS.length}: ${event.city}`}
                  aria-hidden={i !== current}
                >
                  <img src={event.image} alt={event.imageAlt} />
                </div>
              ))}
              <button
                className="tot-carousel-btn tot-carousel-prev"
                onClick={prev}
                aria-label="Previous event flyer"
              >
                ‹
              </button>
              <button
                className="tot-carousel-btn tot-carousel-next"
                onClick={next}
                aria-label="Next event flyer"
              >
                ›
              </button>
            </div>

            <div
              className="tot-carousel-dots"
              role="tablist"
              aria-label="Select event flyer"
            >
              {EVENTS.map((event, i) => (
                <button
                  key={event.city}
                  className={`tot-carousel-dot${i === current ? ' active' : ''}`}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Show ${event.city} flyer`}
                />
              ))}
            </div>

            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {EVENTS[current].city} event flyer
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
