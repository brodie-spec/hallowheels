'use client'

import { useCart } from '@/lib/CartContext'

export default function SupportButton({ costumeId, costumeName }) {
  const { cart, addToCart } = useCart()
  const qty = cart[costumeId] || 0

  return (
    <div className="support-btn-wrap">
      <button
        className="btn btn-primary btn-lg"
        onClick={() => addToCart(costumeId)}
        aria-label={
          qty > 0
            ? `Add another support for ${costumeName}. Currently ${qty} support${qty !== 1 ? 's' : ''} in cart.`
            : `Show your support for ${costumeName} — $5`
        }
      >
        {qty > 0 ? 'Add Another Support' : 'Show Support — $5'}
      </button>
      {qty > 0 && (
        <p
          className="support-btn-count"
          aria-live="polite"
          aria-atomic="true"
        >
          {qty} support{qty !== 1 ? 's' : ''} in your cart
        </p>
      )}
    </div>
  )
}
