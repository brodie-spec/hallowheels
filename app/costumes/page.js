import Link from 'next/link'
import { getSettings, getSiteState } from '@/lib/getSettings'
import { supabase } from '@/lib/supabase'
import CostumeCard from '@/components/CostumeCard'
import ShowSupportForAllBanner from '@/components/ShowSupportForAllBanner'
import CountdownTimer from '@/components/CountdownTimer'

export const metadata = {
  title: 'Costumes — HalloWheels 2026',
  description: 'Browse all HalloWheels 2026 costumes and show your support. Every $5 helps C.A.T.S. provide assistive technology to children across Virginia.',
}

export default async function CostumesPage() {
  const settings = await getSettings()
  const siteState = getSiteState(settings)
  const isCountdown = siteState === 'countdown' || siteState === 'countdown_next'

  const activeYear = settings.voting_start
    ? new Date(settings.voting_start).getFullYear()
    : new Date().getFullYear()

  let costumes = []
  let supportCounts = {}

  if (!isCountdown) {
    const { data } = await supabase
      .from('costumes')
      .select('id, name, tagline, photo_urls')
      .eq('year', activeYear)
      .order('name')

    costumes = data || []

    if (costumes.length > 0) {
      const { data: supports } = await supabase
        .from('supports')
        .select('costume_id')
        .in('costume_id', costumes.map(c => c.id))

      for (const row of (supports || [])) {
        supportCounts[row.costume_id] = (supportCounts[row.costume_id] || 0) + 1
      }
    }
  }

  const costumeIds = costumes.map(c => c.id)

  return (
    <>
      <style>{`
        /* ── Page hero ── */
        .costumes-hero {
          background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 60%, var(--navy-light) 100%);
          padding: 140px 24px 64px;
          text-align: center;
        }
        .costumes-hero h1 { color: var(--white); margin-bottom: 14px; }
        .costumes-hero h1 span { color: var(--yellow); }
        .costumes-hero p {
          color: rgba(255,255,255,0.78);
          max-width: 520px;
          margin: 0 auto;
          font-size: 1.05rem;
        }

        /* ── Countdown state ── */
        .costumes-countdown {
          background: var(--navy);
          min-height: 55vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
        }
        .costumes-countdown h2 {
          color: var(--white);
          margin-bottom: 12px;
        }
        .costumes-countdown > p {
          color: rgba(255,255,255,0.7);
          max-width: 440px;
          margin: 0 auto 48px;
          font-size: 1.05rem;
        }

        /* ── Show Support for All banner ── */
        .support-all-banner {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          padding: 40px 24px;
        }
        .support-all-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .support-all-text h2 {
          color: var(--white);
          font-size: clamp(1.3rem, 2.5vw, 1.9rem);
          margin-bottom: 6px;
        }
        .support-all-text p {
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
        }
        .support-all-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .support-all-fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }
        .support-all-legend {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--yellow);
          display: block;
          margin-bottom: 10px;
        }
        .support-all-options {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .support-all-option {
          cursor: pointer;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.18);
          transition: all 0.18s;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: rgba(255,255,255,0.85);
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          line-height: 1.3;
          min-width: 68px;
        }
        .support-all-option em {
          font-style: normal;
          font-size: 0.72rem;
          color: var(--yellow-light);
          margin-top: 2px;
        }
        .support-all-option:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.38);
        }
        .support-all-option.selected {
          background: var(--yellow);
          border-color: var(--yellow);
          color: var(--navy);
        }
        .support-all-option.selected em { color: var(--navy-dark); }
        .support-all-option:focus-within {
          outline: 3px solid var(--yellow);
          outline-offset: 3px;
        }
        .support-all-btn {
          white-space: nowrap;
        }
        .support-all-btn--added {
          background: #22c55e !important;
          border-color: #22c55e !important;
          color: var(--white) !important;
        }

        /* ── Grid section ── */
        .costumes-section {
          padding: 64px 0 80px;
        }
        .costumes-section-header {
          margin-bottom: 40px;
        }
        .costumes-section-header h2 { margin-bottom: 6px; }
        .costumes-count {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 8px;
        }
        .costumes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        /* ── Costume card (styles used by CostumeCard.js) ── */
        .costume-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .costume-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .costume-card-img-link {
          display: block;
          text-decoration: none;
        }
        .costume-card-img {
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--cream-dark);
        }
        .costume-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
          display: block;
        }
        .costume-card:hover .costume-card-img img {
          transform: scale(1.05);
        }
        .costume-card-placeholder {
          width: 100%;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }
        .costume-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .costume-card-name {
          font-family: var(--font-display);
          font-size: 1.15rem;
          color: var(--navy);
          margin-bottom: 6px;
          text-decoration: none;
          display: block;
          line-height: 1.25;
        }
        .costume-card-name:hover { color: var(--orange); }
        .costume-card-tagline {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 16px;
          flex: 1;
          line-height: 1.5;
        }
        .costume-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid var(--gray-200);
          gap: 8px;
          flex-wrap: wrap;
        }
        .costume-card-count {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .costume-card-count strong {
          color: var(--orange);
          font-size: 1rem;
          font-family: var(--font-display);
        }
        .costume-card-btn {
          font-size: 0.8rem !important;
          padding: 8px 16px !important;
          flex-shrink: 0;
          background: var(--orange);
          color: var(--white);
          border-color: var(--orange);
        }
        .costume-card-btn--added {
          background: transparent !important;
          color: var(--navy) !important;
          border-color: var(--navy) !important;
        }
        .costume-card-btn--added:hover {
          background: var(--navy) !important;
          color: var(--white) !important;
        }

        /* ── Empty state ── */
        .costumes-empty {
          text-align: center;
          padding: 80px 24px;
          grid-column: 1 / -1;
        }
        .costumes-empty p {
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .costumes-grid { grid-template-columns: repeat(2, 1fr); }
          .support-all-inner { flex-direction: column; align-items: flex-start; }
          .support-all-controls { width: 100%; justify-content: space-between; }
        }
        @media (max-width: 600px) {
          .costumes-grid { grid-template-columns: 1fr; }
          .costumes-hero { padding: 120px 16px 48px; }
          .support-all-banner { padding: 28px 16px; }
          .support-all-controls { flex-direction: column; align-items: stretch; gap: 14px; }
          .support-all-btn { text-align: center; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="costumes-hero" aria-labelledby="costumes-page-heading">
        <div className="container">
          <span className="section-label" style={{ color: 'var(--yellow)' }}>2026 HalloWheels</span>
          <h1 id="costumes-page-heading">
            {siteState === 'results'
              ? <>The <span>2026</span> Costumes</>
              : <>Meet the <span>2026</span> Costumes</>
            }
          </h1>
          <p>
            {siteState === 'voting' &&
              'Show your support for these incredible kids and their amazing Halloween costumes. Every $5 goes directly to C.A.T.S.'}
            {siteState === 'results' &&
              'Thank you to everyone who showed their support. Look at what you helped make possible for these amazing kids.'}
            {isCountdown &&
              'Our amazing kids are hard at work on their costumes. Check back when voting opens!'}
          </p>
        </div>
      </section>

      {/* ── COUNTDOWN STATE ── */}
      {isCountdown && (
        <div className="costumes-countdown" role="region" aria-label="Voting countdown">
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="section-label" style={{ color: 'var(--yellow)' }}>Coming Soon</span>
            <h2>Costumes Coming Soon</h2>
            <p>
              The kids are putting the finishing touches on their amazing creations.
              Come back when voting opens to show your support!
            </p>
            <CountdownTimer
              targetDate={
                siteState === 'countdown_next'
                  ? settings.next_voting_start
                  : settings.voting_start
              }
            />
            <div style={{ marginTop: '40px' }}>
              <Link href="/sponsor" className="btn btn-primary btn-lg">
                Become a Sponsor
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── SHOW SUPPORT FOR ALL (voting only) ── */}
      {siteState === 'voting' && costumeIds.length > 0 && (
        <ShowSupportForAllBanner costumeIds={costumeIds} />
      )}

      {/* ── COSTUME GRID ── */}
      {!isCountdown && (
        <section className="costumes-section" aria-labelledby="costumes-grid-heading">
          <div className="container">
            <div className="costumes-section-header">
              <span className="section-label">
                {siteState === 'results' ? 'Final Results' : '2026 Costumes'}
              </span>
              <h2 id="costumes-grid-heading">
                {siteState === 'results' ? 'Thank You for Your Support' : 'All Costumes'}
              </h2>
              {costumes.length > 0 && (
                <p className="costumes-count">
                  {costumes.length} costume{costumes.length !== 1 ? 's' : ''} this year
                </p>
              )}
            </div>

            <div
              className="costumes-grid"
              role="list"
              aria-label={`${siteState === 'results' ? 'Final costumes' : 'Costumes you can support'}`}
            >
              {costumes.length === 0 ? (
                <div className="costumes-empty">
                  <p>Costumes will be announced soon — check back!</p>
                </div>
              ) : (
                costumes.map(costume => (
                  <div key={costume.id} role="listitem">
                    <CostumeCard
                      costume={costume}
                      supportCount={supportCounts[costume.id] || 0}
                      showAddButton={siteState === 'voting'}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
