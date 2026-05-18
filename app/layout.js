import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CartBar from '@/components/CartBar'
import { CartProvider } from '@/lib/CartContext'

export const metadata = {
  title: 'HalloWheels 2026 — Children\'s Assistive Technology Service',
  description: 'Show your support for kids with disabilities through the power of amazing costumes. Every dollar raised helps C.A.T.S. provide assistive technology to children across Virginia.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Nav />
          <main id="main-content" tabIndex="-1">
            {children}
          </main>
          <CartBar />
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
