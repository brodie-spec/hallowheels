'use client'


const SPONSOR_LEVELS = [
  {
    name: 'Ghost',
    amount: 250,
    emoji: '👻',
    color: '#6B7280',
    description: 'Your sponsorship helps prepare a donated piece of pediatric assistive technology, so it is clean, safe, and ready for a child who needs it.',
    benefits: [],
    cumulativeBenefits: [],
    formUrl: 'https://atdevicesforkids.app.neoncrm.com/forms/ghost-sponsor-2026',
  },
  {
    name: 'Goblin',
    amount: 500,
    emoji: '👺',
    color: '#22c55e',
    description: 'Your sponsorship helps restore and adapt donated equipment, giving a child greater mobility, independence, and participation in everyday life.',
    benefits: ['Company logo with link back on atdevicesforkids.org'],
    cumulativeBenefits: ['Ghost'],
    formUrl: 'https://atdevicesforkids.app.neoncrm.com/forms/goblin-sponsor-2026',
  },
  {
    name: 'Witches Brew',
    amount: 1000,
    emoji: '🧙',
    color: '#a855f7',
    description: 'Your sponsorship helps provide the batteries, parts, supplies, and tools necessary to keep specialized equipment safe, functional, and ready to use.',
    benefits: ['Personal thank you letter from a board member'],
    cumulativeBenefits: ['Ghost', 'Goblin'],
    formUrl: 'https://atdevicesforkids.app.neoncrm.com/forms/witches-brew-2026',
  },
  {
    name: 'Haunted Mansion',
    amount: 2500,
    emoji: '🏚️',
    color: '#E8621A',
    description: 'You are making a direct impact to get assistive technology throughout the state of Virginia by helping our transportation team.',
    benefits: ['Featured in a C.A.T.S. newsletter'],
    cumulativeBenefits: ['Ghost', 'Goblin', 'Witches Brew'],
    formUrl: 'https://atdevicesforkids.app.neoncrm.com/forms/haunted-mansion-2026',
  },
  {
    name: 'Great Pumpkin',
    amount: 5000,
    emoji: '🎃',
    color: '#F5B800',
    description: 'Your sponsorship provides major support for C.A.T.S.\'s statewide equipment reuse program, helping children receive the mobility, positioning, and communication devices they need to grow, participate, and thrive.',
    benefits: ['Behind-the-scenes facility tour of C.A.T.S.\'s equipment reuse operation'],
    cumulativeBenefits: ['Ghost', 'Goblin', 'Witches Brew', 'Haunted Mansion'],
    formUrl: 'https://atdevicesforkids.app.neoncrm.com/forms/great-pumpkin-2026',
  },
  {
    name: 'HalloWheels Champion',
    amount: 10000,
    emoji: '🏆',
    color: '#1B3D6E',
    description: 'Your sponsorship provides premier support for HalloWheels and C.A.T.S.\'s year-round mission, helping ensure that children with disabilities across Virginia have access to no-cost assistive technology at the right time.',
    benefits: ['Additional Recognition: Dedicated "Sponsored by" signage at Hallowheels trunk-or-treat events'],
    cumulativeBenefits: ['Ghost', 'Goblin', 'Witches Brew', 'Haunted Mansion', 'Great Pumpkin'],
    formUrl: 'https://atdevicesforkids.app.neoncrm.com/forms/hallowheels-champion',
  },
]

const SHARED_BENEFITS = [
  'Mention on Hallowheels.org',
  'Company logo included where applicable',
  'Social media thank you recognition',
  'Inclusion in the Hallowheels booklet',
  'Recognition on signs at Hallowheels trunk-or-treat events',
]

export default function SponsorsPage() {
  return (
    <>
      <style>{`
        /* ── Hero ── */
        .sponsors-hero {
          background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 60%, var(--navy-light) 100%);
          padding: 140px 24px 80px;
          text-align: center;
        }
        .sponsors-hero h1 {
          color: var(--white);
          margin-bottom: 16px;
        }
        .sponsors-hero h1 span {
          color: var(--yellow);
        }
        .sponsors-hero p {
          color: rgba(255,255,255,0.78);
          max-width: 580px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        /* ── Shared benefits ── */
        .benefits-section {
          background: var(--cream);
          padding: 64px 0;
        }
        .benefits-inner {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
        }
        .benefits-inner h2 {
          margin-bottom: 8px;
        }
        .benefits-inner .divider {
          margin-bottom: 32px;
        }
        .benefits-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 40px;
          box-shadow: var(--shadow);
        }
        .benefits-title {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 20px;
        }
        .benefits-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }
        .benefits-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
          color: var(--text);
          line-height: 1.5;
        }
        .benefits-check {
          width: 22px;
          height: 22px;
          background: var(--yellow);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          font-size: 0.7rem;
          color: var(--navy);
          font-weight: 700;
        }
        .benefits-plus {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--gray-200);
          font-size: 0.875rem;
          color: var(--text-muted);
          font-style: italic;
        }

        /* ── Levels ── */
        .levels-section {
          background: var(--white);
          padding: 80px 0;
        }
        .levels-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .levels-header h2 {
          margin-bottom: 8px;
        }
        .levels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
        }
        .level-card {
          background: var(--white);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: 32px 28px;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .level-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .level-emoji {
          font-size: 2.8rem;
          line-height: 1;
          margin-bottom: 16px;
          display: block;
        }
        .level-name {
          font-family: var(--font-display);
          font-size: 1.4rem;
          color: var(--navy);
          margin-bottom: 4px;
        }
        .level-amount {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-display);
          margin-bottom: 16px;
          display: block;
        }
        .level-divider {
          width: 40px;
          height: 3px;
          border-radius: var(--radius-full);
          margin-bottom: 16px;
        }
        .level-description {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .level-includes {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .level-benefits {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 28px;
        }
        .level-benefits li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .level-benefits .check {
          color: var(--green, #22c55e);
          font-size: 0.75rem;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .level-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 12px;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.9rem;
          border: 2px solid;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          background: transparent;
        }

        /* ── Form section ── */
        /* ── Questions band ── */
        .questions-band {
          background: var(--navy);
          padding: 64px 24px;
          text-align: center;
        }
        .questions-band h2 {
          color: var(--white);
          margin-bottom: 12px;
        }
        .questions-band p {
          color: rgba(255,255,255,0.7);
          max-width: 440px;
          margin: 0 auto 28px;
        }
        .questions-band a {
          color: var(--yellow);
          text-decoration: underline;
          font-weight: 600;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .levels-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .levels-grid { grid-template-columns: 1fr; }
          .benefits-card { padding: 24px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="sponsors-hero" aria-labelledby="sponsors-heading">
        <div className="container">
          <span className="section-label" style={{color:'var(--yellow)'}}>2026 HalloWheels</span>
          <h1 id="sponsors-heading">
            Become a <span>Sponsor</span>
          </h1>
          <p>
            Your sponsorship helps C.A.T.S. provide life-changing assistive technology
            to children with disabilities across Virginia — at no cost to families.
            Every level makes a direct, measurable difference.
          </p>
        </div>
      </section>

      {/* ── SHARED BENEFITS ── */}
      <section className="benefits-section" aria-labelledby="benefits-heading">
        <div className="benefits-inner">
          <span className="section-label">What Every Sponsor Receives</span>
          <h2 id="benefits-heading">All HalloWheels Sponsors Receive</h2>
          <div className="divider" aria-hidden="true" />
          <div className="benefits-card">
            <p className="benefits-title">Included at every sponsorship level</p>
            <ul className="benefits-list" role="list">
              {SHARED_BENEFITS.map((benefit, i) => (
                <li key={i}>
                  <span className="benefits-check" aria-hidden="true">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="benefits-plus">
              Each level also includes additional benefits described below.
            </p>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '24px' }}>
            Sponsorships may be customized to align with your organization's goals and level of involvement. Contact us at <a href="mailto:info@atdevicesforkids.org">info@atdevicesforkids.org</a> to learn more.
          </p>
        </div>
      </section>

      {/* ── LEVELS ── */}
      <section className="levels-section" aria-labelledby="levels-heading">
        <div className="levels-header">
          <div className="container">
            <span className="section-label">Sponsorship Levels</span>
            <h2 id="levels-heading">Choose Your Level of Impact</h2>
            <div className="divider" aria-hidden="true" />
          </div>
        </div>
        <div className="levels-grid" role="list">
          {SPONSOR_LEVELS.map((level, i) => (
            <article
              key={level.name}
              className="level-card"
              role="listitem"
              aria-label={`${level.name} sponsorship level — $${level.amount.toLocaleString()}`}
            >
              <span className="level-emoji" aria-hidden="true">{level.emoji}</span>
              <div className="level-name">{level.name}</div>
              <span
                className="level-amount"
                style={{ color: level.color }}
              >
                ${level.amount.toLocaleString()}
              </span>
              <div
                className="level-divider"
                style={{ background: level.color }}
                aria-hidden="true"
              />
              <p className="level-description">{level.description}</p>

              {level.cumulativeBenefits.length > 0 && level.benefits.length > 0 && (
                <div>
                  <p className="level-includes">Includes all benefits of: {level.cumulativeBenefits.join(', ')}, plus:</p>
                </div>
              )}
              {level.cumulativeBenefits.length === 0 && level.benefits.length > 0 && (
                <p className="level-includes">Level benefits:</p>
              )}
              {level.benefits.length > 0 && (
                <ul className="level-benefits" role="list">
                  {level.benefits.map((benefit, i) => (
                    <li key={i}>
                      <span className="check" aria-hidden="true">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => window.open(
                  level.formUrl,
                  'neon-form',
                  'width=600,height=700,scrollbars=yes,resizable=yes'
                )}
                className="level-btn"
                style={{
                  borderColor: level.color,
                  color: level.color,
                  cursor: 'pointer',
                  background: 'transparent',
                }}
                aria-label={`Become a ${level.name} sponsor for $${level.amount.toLocaleString()}`}
              >
                Become a {level.name} Sponsor
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── QUESTIONS ── */}
      <section className="questions-band" aria-labelledby="questions-heading">
        <h2 id="questions-heading">Questions About Sponsorship?</h2>
        <p>
          We'd love to talk about how your organization can make a difference
          for children with disabilities across Virginia.
        </p>
        <p>
          <a href="mailto:info@atdevicesforkids.org">
            info@atdevicesforkids.org
          </a>
        </p>
      </section>
    </>
  )
}
