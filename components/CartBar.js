'use client'

import { useState } from 'react'
import { useCart } from '@/lib/CartContext'
import { supabase } from '@/lib/supabase'

export default function CartBar() {
  const { cart, hydrated, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)

  if (!hydrated) return null

  const entries = Object.entries(cart)
  const costumeCount = entries.length
  const totalUnits = entries.reduce((s, [, q]) => s + q, 0)
  const totalAmount = totalUnits * 5
  const hasItems = costumeCount > 0

  async function handleDonate() {
    if (submitting || !hasItems) return
    setSubmitting(true)

    const base = process.env.NEXT_PUBLIC_NEON_FORM_URL
    if (base) {
      window.open(`${base}?donationAmt=${totalAmount}`, '_blank', 'noopener,noreferrer')
    }

    try {
      const rows = []
      for (const [costumeId, qty] of entries) {
        for (let i = 0; i < qty; i++) {
          rows.push({ costume_id: costumeId, amount: 5 })
        }
      }
      if (rows.length > 0) {
        await supabase.from('supports').insert(rows)
      }
    } catch (err) {
      console.error('Failed to record supports:', err)
    }

    clearCart()
    setSubmitting(false)
  }

  return (
    <>
      <style>{`
        .cart-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 900;
          background: var(--navy-dark);
          border-top: 3px solid var(--yellow);
          box-shadow: 0 -4px 24px rgba(0,0,0,0.28);
          padding: 14px 24px;
          transform: translateY(110%);
          transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
        }
        .cart-bar--visible {
          transform: translateY(0);
        }
        .cart-bar-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cart-bar-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .cart-bar-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--yellow);
        }
        .cart-bar-summary {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.88);
          white-space: nowrap;
        }
        .cart-bar-summary strong {
          color: var(--white);
          font-family: var(--font-display);
          font-size: 1.2rem;
        }
        .cart-bar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .cart-bar-clear {
          background: transparent !important;
          color: rgba(255,255,255,0.65) !important;
          border-color: rgba(255,255,255,0.25) !important;
        }
        .cart-bar-clear:hover {
          background: rgba(255,255,255,0.08) !important;
          color: var(--white) !important;
          border-color: rgba(255,255,255,0.5) !important;
          transform: none !important;
          box-shadow: none !important;
        }
        .cart-bar-donate:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }
        @media (max-width: 600px) {
          .cart-bar { padding: 12px 16px; }
          .cart-bar-summary { font-size: 0.85rem; }
          .cart-bar-actions .btn { font-size: 0.8rem; padding: 9px 14px; }
        }
      `}</style>

      <div
        className={`cart-bar${hasItems ? ' cart-bar--visible' : ''}`}
        role="region"
        aria-label="Support cart"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="cart-bar-inner">
          <div className="cart-bar-info">
            <span className="cart-bar-eyebrow">Your Cart</span>
            <span className="cart-bar-summary">
              {costumeCount} costume{costumeCount !== 1 ? 's' : ''}&ensp;&middot;&ensp;
              {totalUnits} support{totalUnits !== 1 ? 's' : ''}&ensp;&middot;&ensp;
              <strong>${totalAmount}</strong>
            </span>
          </div>
          <div className="cart-bar-actions">
            <button
              className="btn btn-sm cart-bar-clear"
              onClick={clearCart}
              aria-label="Clear all items from support cart"
            >
              Clear
            </button>
            <button
              className="btn btn-sm btn-yellow cart-bar-donate"
              onClick={handleDonate}
              disabled={submitting}
              aria-label={`Donate $${totalAmount} and submit ${totalUnits} support${totalUnits !== 1 ? 's' : ''} for ${costumeCount} costume${costumeCount !== 1 ? 's' : ''}`}
            >
              {submitting ? 'Processing…' : `Donate & Submit — $${totalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
