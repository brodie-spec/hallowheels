import Link from 'next/link'
import SponsorCarousel from '@/components/SponsorCarousel'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .footer {
          background: var(--navy);
          color: rgba(255,255,255,0.7);
          padding: 0 0 32px;
        }
        .footer-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 48px 24px 0;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .footer-brand .footer-logo {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--white);
          margin-bottom: 12px;
        }
        .footer-brand .footer-logo span {
          color: var(--yellow);
        }
        .footer-brand p {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          max-width: 260px;
        }
        .footer-tagline {
          font-style: italic;
          color: var(--yellow) !important;
          margin-top: 12px !important;
          font-size: 0.875rem !important;
        }
        .footer-col h4 {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--yellow);
          margin-bottom: 16px;
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-col a {
          color: rgba(255,255,255,0.65);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-col a:hover {
          color: var(--white);
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-bottom p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }
        .footer-bottom a {
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          text-decoration: none;
        }
        .footer-bottom a:hover { color: var(--white); }
        .footer-cats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }
        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <footer className="footer" role="contentinfo">
        <SponsorCarousel />
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                Hallo<span>Wheels</span>
              </div>
              <p>A fundraiser benefiting Children's Assistive Technology Service — equipping children for access and opportunity across Virginia.</p>
              <p className="footer-tagline">Every child belongs. Every creation matters.</p>
            </div>

            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/costumes">Costumes</Link></li>
                <li><Link href="/sponsor">Become a Sponsor</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>About C.A.T.S.</h4>
              <ul>
                <li>
                  <a href="https://atdevicesforkids.org" target="_blank" rel="noopener noreferrer">
                    atdevicesforkids.org
                  </a>
                </li>
                <li>
                  <a href="mailto:info@atdevicesforkids.org">
                    info@atdevicesforkids.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {year} Children's Assistive Technology Service. All rights reserved.</p>
            <div className="footer-cats">
              <span>A C.A.T.S. fundraiser</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
