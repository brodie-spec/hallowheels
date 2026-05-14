'use client'

import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

export default function CostumeCard({ costume, supportCount, showAddButton }) {
  const { cart, addToCart } = useCart()
  const qty = cart[costume.id] || 0
  const heroPhoto = costume.photo_urls?.[0]

  return (
    <article
      className="costume-card"
      aria-label={costume.tagline ? `${costume.name} — ${costume.tagline}` : costume.name}
    >
      <Link
        href={`/costumes/${costume.id}`}
        className="costume-card-img-link"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="costume-card-img">
          {heroPhoto ? (
            <img src={heroPhoto} alt="" />
          ) : (
            <div className="costume-card-placeholder" aria-hidden="true">🎃</div>
          )}
        </div>
      </Link>

      <div className="costume-card-body">
        <Link href={`/costumes/${costume.id}`} className="costume-card-name">
          {costume.name}
        </Link>
        {costume.tagline && (
          <p className="costume-card-tagline">{costume.tagline}</p>
        )}
        <div className="costume-card-footer">
          <span
            className="costume-card-count"
            aria-label={`${supportCount} support${supportCount !== 1 ? 's' : ''} so far`}
          >
            <strong>{supportCount}</strong> support{supportCount !== 1 ? 's' : ''}
          </span>
          {showAddButton && (
            <button
              className={`btn btn-sm costume-card-btn${qty > 0 ? ' costume-card-btn--added' : ''}`}
              onClick={() => addToCart(costume.id)}
              aria-label={
                qty > 0
                  ? `Add another support for ${costume.name}. ${qty} already in cart.`
                  : `Show support for ${costume.name} — $5`
              }
            >
              {qty > 0 ? `+${qty} in cart` : 'Show Support'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
