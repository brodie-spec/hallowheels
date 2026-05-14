import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Script from 'next/script'

export const metadata = {
  title: 'HalloWheels 2026 — Children\'s Assistive Technology Service',
  description: 'Show your support for kids with disabilities through the power of amazing costumes. Every dollar raised helps C.A.T.S. provide assistive technology to children across Virginia.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Nav />
        <main id="main-content" tabIndex="-1">
          {children}
        </main>
        <Footer />
        <Script
          src="https://atdevicesforkids.app.neoncrm.com/forms/share/UE9QLUZPUk1TSEFSSU5HLUNPREUxOA=="
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
