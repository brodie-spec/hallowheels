'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Nav() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <style>{`
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: var(--nav-height);
          z-index: 1000;
          background: rgba(253, 246, 236, 0.96);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }

        .nav.scrolled {
          background: rgba(253, 246, 236, 0.96);
          backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }
        .nav-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .nav-logo-text {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          color: var(--navy);
          line-height: 1;
        }
        .nav-logo-text span {
          color: var(--orange);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
        }
        .nav-links a {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--navy);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          transition: all 0.2s;
          text-decoration: none;
        }
        .nav-links a:hover {
          background: var(--cream-dark);
          color: var(--orange);
        }
        .nav-cta {
          background: var(--orange) !important;
          color: var(--white) !important;
          padding: 10px 22px !important;
        }
        .nav-cta:hover {
          background: var(--orange-light) !important;
          color: var(--white) !important;
        }
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
        }
        .nav-hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--navy);
          border-radius: 2px;
          transition: all 0.3s;
        }
        .nav-hamburger[aria-expanded="true"] span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .nav-hamburger[aria-expanded="true"] span:nth-child(2) {
          opacity: 0;
        }
        .nav-hamburger[aria-expanded="true"] span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .nav-mobile {
          display: none;
          position: fixed;
          top: var(--nav-height);
          left: 0; right: 0;
          background: var(--cream);
          border-top: 1px solid var(--cream-dark);
          padding: 16px 24px 24px;
          box-shadow: var(--shadow-lg);
          z-index: 999;
        }
        .nav-mobile.open { display: block; }
        .nav-mobile ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-mobile a {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: var(--navy);
          padding: 12px 16px;
          border-radius: var(--radius);
          text-decoration: none;
          transition: all 0.2s;
        }
        .nav-mobile a:hover {
          background: var(--cream-dark);
          color: var(--orange);
        }
        .nav-mobile .nav-cta {
          background: var(--orange) !important;
          color: var(--white) !important;
          text-align: center;
          margin-top: 8px;
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <nav className={`nav${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Hallowheels home">
            <div className="nav-logo-text">
              Hallo<span>Wheels</span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            <li><Link href="/costumes">Costumes</Link></li>
            <li><Link href="/sponsors">Sponsors</Link></li>
            <li>
              <Link href="/costumes" className="nav-cta">
                Show Your Support
              </Link>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`nav-mobile${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul role="list">
          <li><Link href="/costumes" onClick={closeMenu}>Costumes</Link></li>
          <li><Link href="/sponsors" onClick={closeMenu}>Sponsors</Link></li>
          <li>
            <Link href="/costumes" className="nav-cta" onClick={closeMenu}>
              Show Your Support
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
