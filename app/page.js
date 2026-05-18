import Link from 'next/link'
import { getSettings, getSiteState } from '@/lib/getSettings'
import { supabase } from '@/lib/supabase'
import HeroSlideshow from '@/components/HeroSlideshow'
import ProgressBar from '@/components/ProgressBar'
import CountdownTimer from '@/components/CountdownTimer'

// Sample past photos for hero slideshow — replace with real paths in /public
const HERO_PHOTOS = [
  { src: '/photos/miles.jpg',      alt: 'Miles dressed as a motorcycle rider on his adaptive bike' },
  { src: '/photos/olaf.jpg',       alt: 'Child dressed as Olaf from Frozen in their adaptive stroller' },
  { src: '/photos/river.jpg',      alt: 'River dressed as a Target employee in their wheelchair with their cat' },
  { src: '/photos/starfighter.jpg',alt: 'Child in an X-Wing starfighter wheelchair costume' },
  { src: '/photos/tomato.jpg',     alt: 'Child dressed as a tomato' },
]

export default async function Home() {
  const settings  = await getSettings()
  const siteState = getSiteState(settings)

  // Fetch vote totals for progress bar
  let totalRaised = 0
  if (siteState === 'voting' || siteState === 'results') {
    const { data } = await supabase.from('supports').select('amount')
    if (data) totalRaised = data.reduce((sum, row) => sum + row.amount, 0)
  }

  const goal = parseInt(settings.goal_amount || '25000')

  const votingStartDate = new Date(settings.voting_start)
  const formattedDate = votingStartDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })

  return (
    <>
      <style>{`
        /* ── Hero ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-slideshow {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(27,61,110,0.82) 0%,
            rgba(27,61,110,0.55) 50%,
            rgba(27,61,110,0.25) 100%
          );
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 120px 24px 80px;
          max-width: 680px;
          margin-left: max(24px, calc((100vw - 1200px) / 2));
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--yellow);
          color: var(--navy);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          margin-bottom: 20px;
        }
        .hero h1 {
          font-size: clamp(3rem, 6vw, 5rem);
          color: var(--white);
          line-height: 1.1;
          margin-bottom: 20px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }
        .hero h1 span {
          color: var(--yellow);
        }
        .hero-desc {
          font-size: 1.15rem;
          color: rgba(255,255,255,0.88);
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 520px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }
        .hero-stat {
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-stat strong {
          color: var(--yellow);
          font-size: 1.4rem;
          font-family: var(--font-display);
          display: block;
        }

        /* ── Progress section ── */
        .progress-section {
          background: var(--navy);
          padding: 40px 0;
        }
        .progress-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .progress-label {
          color: rgba(255,255,255,0.7);
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .progress-amounts {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .progress-raised {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--yellow);
        }
        .progress-goal {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
        }
        .progress-track-dark {
          width: 100%;
          height: 14px;
          background: rgba(255,255,255,0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-pct {
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          margin-top: 8px;
          text-align: right;
        }

        /* ── What is section ── */
        .what-section {
          background: var(--white);
        }
        .what-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .what-photos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .what-photo {
          border-radius: var(--radius);
          overflow: hidden;
          aspect-ratio: 3/4;
        }
        .what-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .what-photo:hover img {
          transform: scale(1.04);
        }
        .what-photo.tall {
          grid-row: span 2;
          aspect-ratio: auto;
        }
        .what-text .section-label { margin-bottom: 12px; }
        .what-text h2 { margin-bottom: 20px; }
        .what-text p  { margin-bottom: 16px; }
        .what-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 32px;
        }
        .what-stat {
          background: var(--cream);
          border-radius: var(--radius);
          padding: 20px;
          text-align: center;
        }
        .what-stat strong {
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--orange);
          display: block;
          line-height: 1;
        }
        .what-stat span {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }

        /* ── How it works ── */
        .how-section {
          background: var(--cream);
        }
        .how-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 48px;
        }
        .how-step {
          text-align: center;
          padding: 32px 24px;
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          position: relative;
        }
        .how-step-num {
          width: 52px;
          height: 52px;
          background: var(--orange);
          color: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 auto 20px;
        }
        .how-step h3 {
          font-size: 1.1rem;
          margin-bottom: 10px;
        }
        .how-step p {
          font-size: 0.875rem;
        }

        /* ── Featured costumes ── */
        .featured-section {
          background: var(--white);
        }
        .featured-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .featured-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .featured-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
          color: inherit;
        }
        .featured-card-img {
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--cream-dark);
        }
        .featured-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .featured-card:hover .featured-card-img img {
          transform: scale(1.05);
        }
        .featured-card-body {
          padding: 20px;
        }
        .featured-card-name {
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: var(--navy);
          margin-bottom: 6px;
        }
        .featured-card-tagline {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 14px;
        }
        .featured-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid var(--gray-200);
        }
        .featured-card-support {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .featured-card-support span {
          color: var(--orange);
          font-weight: 700;
        }
        .support-pill {
          background: var(--orange);
          color: var(--white);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: var(--radius-full);
        }

        /* ── CTA band ── */
        .cta-band {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          padding: 80px 0;
          text-align: center;
        }
        .cta-band h2 {
          color: var(--white);
          margin-bottom: 16px;
        }
        .cta-band p {
          color: rgba(255,255,255,0.75);
          max-width: 520px;
          margin: 0 auto 36px;
          font-size: 1.05rem;
        }
        .cta-band .btn-yellow {
          font-size: 1.1rem;
          padding: 18px 44px;
        }

        /* ── Countdown state ── */
        .countdown-section {
          text-align: center;
          padding: 80px 24px;
        }
        .countdown-section h2 {
          margin-bottom: 16px;
        }
        .countdown-section p {
          max-width: 480px;
          margin: 0 auto 40px;
          font-size: 1.05rem;
        }

        /* ── Results state ── */
        .results-section {
          text-align: center;
          padding: 80px 24px;
          background: var(--white);
        }
        .results-total {
          font-family: var(--font-display);
          font-size: clamp(3rem, 8vw, 6rem);
          color: var(--orange);
          line-height: 1;
          margin: 24px 0 8px;
        }
        .results-section p {
          max-width: 480px;
          margin: 0 auto 40px;
          font-size: 1.05rem;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .what-grid       { grid-template-columns: 1fr; }
          .what-photos     { display: none; }
          .how-steps       { grid-template-columns: 1fr; }
          .featured-grid   { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .hero-content    { margin-left: 0; padding: 100px 16px 60px; }
          .featured-grid   { grid-template-columns: 1fr; }
          .what-stats      { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero" aria-label="Hero">
        <div className="hero-slideshow" aria-hidden="true">
          <HeroSlideshow photos={HERO_PHOTOS} />
        </div>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span aria-hidden="true">🎃</span>
            2026 HalloWheels
          </div>

          {siteState === 'voting' && (
            <>
              <h1>Show Your <span>Support</span> for These Amazing Kids</h1>
              <p className="hero-desc">
                Every dollar raised helps C.A.T.S. provide life-changing assistive technology
                to children with disabilities across Virginia. Browse the costumes and show
                your support today.
              </p>
              <div className="hero-actions">
                <Link href="/costumes" className="btn btn-yellow btn-lg">
                  See the Costumes
                </Link>
                <Link href="/sponsors" className="btn" style={{color:'white', borderColor:'rgba(255,255,255,0.5)'}}>
                  Become a Sponsor
                </Link>
              </div>
            </>
          )}

          {siteState === 'countdown' && (
            <>
              <h1>Coming <span style={{whiteSpace:'nowrap'}}>{formattedDate}</span></h1>
              <p className="hero-desc">
                HalloWheels is back! Get ready to see the most incredible, creative, and
                joyful costumes — all built around the mobility devices that help these
                amazing kids move through the world.
              </p>
              <div className="hero-actions">
                <Link href="/sponsors" className="btn btn-yellow btn-lg">
                  Become a Sponsor
                </Link>
              </div>
              <div className="countdown-section" style={{padding:'40px 0 0', textAlign:'left'}}>
                <CountdownTimer targetDate={
                  siteState === 'countdown_next' 
                    ? settings.next_voting_start 
                    : settings.voting_start
                } />
              </div>
            </>
          )}

          {siteState === 'results' && (
            <>
              <h1>Thank You for an <span>Amazing</span> HalloWheels!</h1>
              <p className="hero-desc">
                Because of your incredible generosity, children with disabilities across
                Virginia will have access to the assistive technology they need to grow,
                participate, and thrive.
              </p>
              <div className="hero-actions">
                <Link href="/costumes" className="btn btn-yellow btn-lg">
                  See All Costumes
                </Link>
                <Link href="/sponsors" className="btn" style={{color:'white', borderColor:'rgba(255,255,255,0.5)'}}>
                  Become a 2027 Sponsor
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── PROGRESS BAR (voting + results only) ── */}
      {(siteState === 'voting' || siteState === 'results') && (
        <div className="progress-section" role="region" aria-label="Fundraising progress">
          <div className="progress-inner">
            <div className="progress-header">
              <span className="progress-label">
                {siteState === 'voting' ? 'Fundraising Progress' : '2026 Final Total'}
              </span>
              <div className="progress-amounts">
                <span className="progress-raised">${totalRaised.toLocaleString()}</span>
                <span className="progress-goal">of ${goal.toLocaleString()} goal</span>
              </div>
            </div>
            <ProgressBar raised={totalRaised} goal={goal} />
            <p className="progress-pct">
              {Math.min(Math.round((totalRaised / goal) * 100), 100)}% funded
            </p>
          </div>
        </div>
      )}

      {/* ── WHAT IS HALLOWHEELS ── */}
      <section className="section what-section" aria-labelledby="what-heading">
        <div className="container">
          <div className="what-grid">
            <div className="what-photos" aria-hidden="true">
              <div className="what-photo tall">
                <img src="/photos/starfighter.jpg" alt="" />
              </div>
              <div className="what-photo">
                <img src="/photos/olaf.jpg" alt="" />
              </div>
              <div className="what-photo">
                <img src="/photos/river.jpg" alt="" />
              </div>
            </div>
            <div className="what-text">
              <span className="section-label">About HalloWheels</span>
              <h2 id="what-heading">Every Child Belongs. Every Creation Matters.</h2>
              <p>
                HalloWheels is an annual fundraiser where children with disabilities
                show off their incredible, handmade Halloween costumes — many built
                right around their wheelchairs, walkers, and adaptive devices.
              </p>
              <p>
                Every dollar raised goes directly to C.A.T.S. — Children's Assistive
                Technology Service — a Virginia nonprofit that provides mobility,
                communication, and positioning devices to children who need them,
                at no cost to families.
              </p>
              <div className="what-stats" role="list">
                <div className="what-stat" role="listitem">
                  <strong>100%</strong>
                  <span>of donations support C.A.T.S. programs</span>
                </div>
                <div className="what-stat" role="listitem">
                  <strong>VA</strong>
                  <span>statewide reach across Virginia</span>
                </div>
                <div className="what-stat" role="listitem">
                  <strong>Free</strong>
                  <span>assistive technology for families</span>
                </div>
                <div className="what-stat" role="listitem">
                  <strong>Kids</strong>
                  <span>of all ages and abilities welcome</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-section" aria-labelledby="how-heading">
        <div className="container text-center">
          <span className="section-label">How It Works</span>
          <h2 id="how-heading">Show Your Support in Three Steps</h2>
          <div className="divider" aria-hidden="true" />
          <div className="how-steps" role="list">
            <div className="how-step" role="listitem">
              <div className="how-step-num" aria-hidden="true">1</div>
              <h3>Browse the Costumes</h3>
              <p>Meet this year's incredible kids and their amazing handmade costumes, each one a work of art and heart.</p>
            </div>
            <div className="how-step" role="listitem">
              <div className="how-step-num" aria-hidden="true">2</div>
              <h3>Add to Your Cart</h3>
              <p>Show your support for any costume for $5. Support as many kids as you like — or show your support for all of them at once.</p>
            </div>
            <div className="how-step" role="listitem">
              <div className="how-step-num" aria-hidden="true">3</div>
              <h3>Donate Securely</h3>
              <p>Complete your donation through our secure payment partner. Your generosity goes directly to kids who need assistive technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COSTUMES (voting state only) ── */}
      {siteState === 'voting' && (
        <section className="section featured-section" aria-labelledby="featured-heading">
          <div className="container">
            <div className="featured-header">
              <div>
                <span className="section-label">2026 Costumes</span>
                <h2 id="featured-heading">Meet This Year's Stars</h2>
              </div>
              <Link href="/costumes" className="btn btn-secondary">
                See All Costumes
              </Link>
            </div>
            <FeaturedCostumes />
          </div>
        </section>
      )}

      {/* ── CTA BAND ── */}
      <section className="cta-band" aria-labelledby="cta-heading">
        <div className="container">
          <span className="section-label" style={{color:'var(--yellow)'}}>
            {siteState === 'voting' ? 'Join Us' : 'Get Involved'}
          </span>
          <h2 id="cta-heading">
            {siteState === 'voting'
              ? 'Every Dollar Makes a Difference'
              : 'Help Us Reach More Kids in 2027'}
          </h2>
          <p>
            {siteState === 'voting'
              ? 'Children across Virginia are waiting for the assistive technology they need to participate in everyday life. Your support changes that.'
              : 'Interested in sponsoring HalloWheels 2027 or learning more about C.A.T.S.? We\'d love to hear from you.'}
          </p>
          {siteState === 'voting'
            ? <Link href="/costumes" className="btn btn-yellow btn-lg">Show Your Support</Link>
            : <Link href="/sponsors" className="btn btn-yellow btn-lg">Learn About Sponsorship</Link>
          }
        </div>
      </section>
    </>
  )
}

// ── Featured costumes sub-component ──────────────────────────────────────────
async function FeaturedCostumes() {
  const { data: costumes } = await supabase
    .from('costumes')
    .select('id, name, tagline, photo_urls')
    .eq('year', 2026)
    .limit(3)

  if (!costumes || costumes.length === 0) return null

  return (
    <div className="featured-grid">
      {costumes.map(costume => (
        <Link
          key={costume.id}
          href={`/costumes/${costume.id}`}
          className="featured-card"
          aria-label={`View ${costume.name}'s costume page`}
        >
          <div className="featured-card-img">
            {costume.photo_urls?.[0] ? (
              <img src={costume.photo_urls[0]} alt={costume.name} />
            ) : (
              <div style={{
                width:'100%', height:'100%', minHeight:'200px',
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'var(--cream-dark)', fontSize:'3rem'
              }} aria-hidden="true">🎃</div>
            )}
          </div>
          <div className="featured-card-body">
            <div className="featured-card-name">{costume.name}</div>
            {costume.tagline && (
              <div className="featured-card-tagline">{costume.tagline}</div>
            )}
            <div className="featured-card-footer">
              <span className="featured-card-support">
                Show your support
              </span>
              <span className="support-pill" aria-hidden="true">$5</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
