// NOTE: The 'sponsor-logos' Supabase Storage bucket must be created manually
// in the Supabase dashboard as a public bucket before sponsor logos will display.
import { supabase } from '@/lib/supabase'

function logoHeight() {
  return 90
}

function logoMaxWidth(order) {
  // Ghost (1) → 100px, HalloWheels Champion (6) → 220px
  return 100 + ((order || 1) - 1) * 24
}

export default async function SponsorCarousel() {
  const { data: sponsors } = await supabase
    .from('sponsors')
    .select('*')
    .eq('active', true)
    .eq('year', 2026)
    .order('level_order', { ascending: true })
    .order('name', { ascending: true })

  if (!sponsors || sponsors.length === 0) return null

  const scrollDuration = Math.max(20, sponsors.length * 5)

  return (
    <>
      <style>{`
        .sponsor-carousel-section {
          background: rgba(255,255,255,0.05);
          padding: 28px 0 24px;
          overflow: hidden;
        }
        .sponsor-carousel-heading {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          text-align: center;
          margin-bottom: 18px;
        }

        /* ── Scrolling marquee ── */
        .sponsor-marquee-overflow {
          overflow: hidden;
          width: 100%;
          height: 120px;
          display: flex;
          align-items: center;
        }
        .sponsor-marquee-track {
          display: inline-flex;
          align-items: center;
          gap: 56px;
          animation: sponsor-scroll linear infinite;
          padding: 0 28px;
        }
        @keyframes sponsor-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── Static grid for prefers-reduced-motion ── */
        .sponsor-static-grid {
          display: none;
          flex-wrap: wrap;
          gap: 24px 48px;
          justify-content: center;
          padding: 0 24px;
        }
        @media (prefers-reduced-motion: reduce) {
          .sponsor-marquee-overflow { display: none; }
          .sponsor-static-grid     { display: flex; }
        }

        /* ── Individual sponsor item ── */
        .sponsor-item {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .sponsor-item a,
        .sponsor-item-inner {
          display: flex;
          align-items: center;
          text-decoration: none;
          opacity: 0.72;
          transition: opacity 0.2s;
        }
        .sponsor-item a:hover { opacity: 1; }
        .sponsor-item a:focus-visible {
          outline: 2px solid var(--yellow);
          outline-offset: 4px;
          border-radius: 4px;
          opacity: 1;
        }
        .sponsor-logo-box {
          background: white;
          border-radius: 8px;
          padding: 10px 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 90px;
          max-width: 220px;
          width: 220px;
          flex-shrink: 0;
        }
        .sponsor-logo-box img {
          max-height: 70px;
          max-width: 200px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }
        .sponsor-name-text {
          font-family: var(--font-display);
          color: rgba(255,255,255,0.75);
          white-space: nowrap;
          letter-spacing: 0.5px;
        }
      `}</style>

      <section className="sponsor-carousel-section" aria-label="HalloWheels 2026 Sponsors">
        <p className="sponsor-carousel-heading">Thank You to Our Sponsors</p>

        {/* Accessible list for screen readers — hidden visually */}
        <ul className="sr-only" aria-label="Complete list of HalloWheels 2026 sponsors">
          {sponsors.map(s => (
            <li key={s.id}>
              {s.url
                ? <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
                : s.name
              }
            </li>
          ))}
        </ul>

        {/* Scrolling marquee — hidden from screen readers since list above covers it */}
        <div className="sponsor-marquee-overflow" aria-hidden="true">
          <div
            className="sponsor-marquee-track"
            style={{ animationDuration: `${scrollDuration}s` }}
          >
            {[...sponsors, ...sponsors].map((s, i) => (
              <SponsorItem
                key={`${s.id}-${i}`}
                sponsor={s}
                height={logoHeight(s.level_order)}
                maxWidth={logoMaxWidth(s.level_order)}
              />
            ))}
          </div>
        </div>

        {/* Static grid for prefers-reduced-motion — also hidden from screen readers */}
        <div className="sponsor-static-grid" aria-hidden="true">
          {sponsors.map(s => (
            <SponsorItem
              key={s.id}
              sponsor={s}
              height={logoHeight(s.level_order)}
              maxWidth={logoMaxWidth(s.level_order)}
            />
          ))}
        </div>
      </section>
    </>
  )
}

function SponsorItem({ sponsor, height, maxWidth }) {
  const logoContent = sponsor.logo_path ? (
    <div className="sponsor-logo-box">
      <img
        src={sponsor.logo_path}
        alt={sponsor.name}
      />
    </div>
  ) : (
    <span
      className="sponsor-name-text"
      style={{ fontSize: `${0.78 + (height - 40) * 0.007}rem` }}
    >
      {sponsor.name}
    </span>
  )

  return (
    <div className="sponsor-item">
      {sponsor.url ? (
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${sponsor.name} sponsor website`}
        >
          {logoContent}
        </a>
      ) : (
        <div className="sponsor-item-inner">{logoContent}</div>
      )}
    </div>
  )
}
