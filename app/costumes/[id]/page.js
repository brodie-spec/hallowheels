import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSettings, getSiteState } from '@/lib/getSettings'
import { supabase } from '@/lib/supabase'
import PhotoGallery from '@/components/PhotoGallery'
import SupportButton from '@/components/SupportButton'

export async function generateMetadata({ params }) {
  const { data: costume } = await supabase
    .from('costumes')
    .select('name, tagline')
    .eq('id', params.id)
    .single()

  if (!costume) return { title: 'Costume Not Found — HalloWheels 2026' }

  return {
    title: `${costume.name} — HalloWheels 2026`,
    description: costume.tagline
      ? `${costume.tagline} — Show your support for ${costume.name} at HalloWheels 2026.`
      : `Show your support for ${costume.name} at HalloWheels 2026. Every $5 helps C.A.T.S.`,
  }
}

export default async function CostumePage({ params }) {
  const [settings, { data: costume }] = await Promise.all([
    getSettings(),
    supabase.from('costumes').select('*').eq('id', params.id).single(),
  ])

  if (!costume) notFound()

  const siteState = getSiteState(settings)
  const activeYear = settings.voting_start
    ? new Date(settings.voting_start).getFullYear()
    : new Date().getFullYear()

  const [{ data: supports }, { data: allCostumes }] = await Promise.all([
    supabase.from('supports').select('id').eq('costume_id', params.id),
    supabase
      .from('costumes')
      .select('id, name')
      .eq('year', activeYear)
      .order('name'),
  ])

  const supportCount = supports?.length || 0
  const costumes = allCostumes || []
  const currentIndex = costumes.findIndex(c => c.id === params.id)
  const canNav = costumes.length > 1

  const prevCostume = canNav
    ? currentIndex > 0
      ? costumes[currentIndex - 1]
      : costumes[costumes.length - 1]
    : null

  const nextCostume = canNav
    ? currentIndex < costumes.length - 1
      ? costumes[currentIndex + 1]
      : costumes[0]
    : null

  const photos = costume.photo_urls || []
  const bioParagraphs = costume.bio ? costume.bio.split('\n').filter(Boolean) : []

  return (
    <>
      <style>{`
        /* ── Top nav bar ── */
        .costume-topnav {
          background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);
          padding: 120px 24px 32px;
        }
        .costume-topnav-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .costume-topnav-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.75);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          transition: all 0.18s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .costume-topnav-back:hover {
          color: var(--white);
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.4);
        }
        .costume-topnav-siblings {
          display: flex;
          gap: 8px;
          overflow: hidden;
        }
        .costume-topnav-sib {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.7);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          transition: all 0.18s;
          max-width: 180px;
          overflow: hidden;
        }
        .costume-topnav-sib:hover {
          color: var(--white);
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.35);
        }
        .costume-topnav-sib-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .costume-topnav-arrow { flex-shrink: 0; }

        /* ── Main layout ── */
        .costume-layout {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 64px 24px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }

        /* ── Photo gallery ── */
        .photo-gallery {}
        .gallery-main {
          border-radius: var(--radius-lg);
          overflow: hidden;
          aspect-ratio: 4/3;
          background: var(--cream-dark);
          margin-bottom: 12px;
        }
        .gallery-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .gallery-thumbs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .gallery-thumb {
          width: 72px;
          height: 72px;
          border-radius: var(--radius);
          overflow: hidden;
          border: 3px solid transparent;
          padding: 0;
          cursor: pointer;
          background: var(--cream-dark);
          transition: border-color 0.18s, transform 0.12s;
          flex-shrink: 0;
        }
        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .gallery-thumb:hover {
          border-color: var(--orange-light);
          transform: scale(1.06);
        }
        .gallery-thumb.active {
          border-color: var(--orange);
        }
        .gallery-thumb:focus-visible {
          outline: 3px solid var(--yellow);
          outline-offset: 3px;
        }
        .gallery-empty {
          aspect-ratio: 4/3;
          background: var(--cream-dark);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
        }

        /* ── Costume info ── */
        .costume-info-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 10px;
        }
        .costume-info-name {
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.15;
          margin-bottom: 10px;
        }
        .costume-info-tagline {
          font-size: 1.1rem;
          color: var(--text-muted);
          font-style: italic;
          margin-bottom: 24px;
          line-height: 1.55;
        }
        .costume-info-divider {
          width: 48px;
          height: 4px;
          background: var(--yellow);
          border-radius: var(--radius-full);
          margin-bottom: 28px;
        }
        .costume-info-bio {
          margin-bottom: 32px;
        }
        .costume-info-bio p {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.75;
        }
        .costume-info-bio p + p { margin-top: 14px; }

        /* ── Support block ── */
        .costume-support-block {
          background: var(--cream);
          border-radius: var(--radius-lg);
          padding: 22px 24px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .costume-support-number {
          font-family: var(--font-display);
          font-size: 2.8rem;
          font-weight: 700;
          color: var(--orange);
          line-height: 1;
        }
        .costume-support-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .costume-support-label small {
          font-size: 0.78rem;
          color: var(--gray-400);
          display: block;
          margin-top: 2px;
        }

        /* ── Support button (used by SupportButton.js) ── */
        .support-btn-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .support-btn-count {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        /* ── Bottom prev/next navigation ── */
        .costume-bottom-nav {
          border-top: 2px solid var(--cream-dark);
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 48px 24px 80px;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 16px;
        }
        .costume-bottom-nav-link {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 18px 22px;
          border-radius: var(--radius-lg);
          border: 2px solid var(--cream-dark);
          background: var(--white);
          text-decoration: none;
          transition: all 0.2s;
          max-width: 260px;
          min-width: 0;
        }
        .costume-bottom-nav-link.next {
          align-items: flex-end;
          text-align: right;
          margin-left: auto;
        }
        .costume-bottom-nav-link:hover {
          border-color: var(--orange-light);
          box-shadow: var(--shadow);
          transform: translateY(-3px);
        }
        .costume-bottom-nav-dir {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .costume-bottom-nav-name {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--navy);
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .costume-layout {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 40px 24px 64px;
          }
        }
        @media (max-width: 600px) {
          .costume-topnav { padding: 100px 16px 24px; }
          .costume-topnav-sib { max-width: 130px; }
          .costume-layout { padding: 32px 16px 48px; }
          .costume-bottom-nav { padding: 40px 16px 64px; }
          .costume-bottom-nav-link { max-width: 160px; padding: 14px 16px; }
          .costume-bottom-nav-name { max-width: 130px; }
        }
      `}</style>

      {/* ── TOP NAV ── */}
      <div className="costume-topnav">
        <nav className="costume-topnav-inner" aria-label="Costume navigation">
          <Link
            href="/costumes"
            className="costume-topnav-back"
            aria-label="Back to all costumes"
          >
            <span className="costume-topnav-arrow" aria-hidden="true">←</span>
            All Costumes
          </Link>

          {canNav && (
            <div className="costume-topnav-siblings">
              <Link
                href={`/costumes/${prevCostume.id}`}
                className="costume-topnav-sib"
                aria-label={`Previous costume: ${prevCostume.name}`}
              >
                <span className="costume-topnav-arrow" aria-hidden="true">←</span>
                <span className="costume-topnav-sib-name">{prevCostume.name}</span>
              </Link>
              <Link
                href={`/costumes/${nextCostume.id}`}
                className="costume-topnav-sib"
                aria-label={`Next costume: ${nextCostume.name}`}
              >
                <span className="costume-topnav-sib-name">{nextCostume.name}</span>
                <span className="costume-topnav-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* ── MAIN CONTENT ── */}
      <article className="costume-layout" aria-labelledby="costume-name-heading">

        {/* Gallery column */}
        <div>
          <PhotoGallery photos={photos} costumeName={costume.name} />
        </div>

        {/* Info column */}
        <div>
          <span className="costume-info-eyebrow">2026 HalloWheels</span>
          <h1 id="costume-name-heading" className="costume-info-name">{costume.name}</h1>

          {costume.tagline && (
            <p className="costume-info-tagline">{costume.tagline}</p>
          )}

          <div className="costume-info-divider" aria-hidden="true" />

          {bioParagraphs.length > 0 && (
            <div className="costume-info-bio">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          <div
            className="costume-support-block"
            aria-label={`${supportCount} support${supportCount !== 1 ? 's' : ''} so far`}
          >
            <span className="costume-support-number" aria-hidden="true">
              {supportCount}
            </span>
            <span className="costume-support-label">
              support{supportCount !== 1 ? 's' : ''} so far
              <small>Every $5 goes directly to C.A.T.S.</small>
            </span>
          </div>

          {siteState === 'voting' && (
            <SupportButton costumeId={costume.id} costumeName={costume.name} />
          )}
        </div>
      </article>

      {/* ── BOTTOM PREV / NEXT ── */}
      {canNav && (
        <nav
          className="costume-bottom-nav"
          aria-label="Navigate between costumes"
        >
          <Link
            href={`/costumes/${prevCostume.id}`}
            className="costume-bottom-nav-link"
            aria-label={`Previous costume: ${prevCostume.name}`}
          >
            <span className="costume-bottom-nav-dir">← Previous</span>
            <span className="costume-bottom-nav-name">{prevCostume.name}</span>
          </Link>

          <Link
            href={`/costumes/${nextCostume.id}`}
            className="costume-bottom-nav-link next"
            aria-label={`Next costume: ${nextCostume.name}`}
          >
            <span className="costume-bottom-nav-dir">Next →</span>
            <span className="costume-bottom-nav-name">{nextCostume.name}</span>
          </Link>
        </nav>
      )}
    </>
  )
}
