'use client'

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

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .tot-grid { grid-template-columns: 1fr; max-width: 480px; }
        }
      `}</style>

      <section className="tot-section" aria-labelledby="tot-heading">
        <div className="tot-header container">
          <span className="section-label">Adaptive Trunk-or-Treat Events</span>
          <h2 id="tot-heading">Join Us In Person on October 24th</h2>
          <div className="divider" aria-hidden="true" />
        </div>

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
      </section>
    </>
  )
}
