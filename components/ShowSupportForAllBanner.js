'use client'

import { useState } from 'react'
import { useCart } from '@/lib/CartContext'

const HIDDEN = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
}

export default function ShowSupportForAllBanner({ costumeIds }) {
  const { addToCartAll } = useCart()
  const [selected, setSelected] = useState(1)
  const [added, setAdded] = useState(false)

  const totalCost = selected * costumeIds.length * 5

  function handleAddAll() {
    addToCartAll(costumeIds, selected)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <section className="support-all-banner" aria-labelledby="support-all-heading">
      <div className="support-all-inner">
        <div className="support-all-text">
          <h2 id="support-all-heading">Show Your Support for Every Kid</h2>
          <p>Add supports for all {costumeIds.length} costumes at once</p>
        </div>

        <div className="support-all-controls">
          <fieldset className="support-all-fieldset">
            <legend className="support-all-legend">Supports per costume</legend>
            <div className="support-all-options">
              {[1, 2, 3, 4, 5].map(n => (
                <label
                  key={n}
                  className={`support-all-option${selected === n ? ' selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="supports-per-costume"
                    value={n}
                    checked={selected === n}
                    onChange={() => setSelected(n)}
                    style={HIDDEN}
                  />
                  <span>{n} {n === 1 ? 'support' : 'supports'}</span>
                  <em>${n * 5}</em>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            className={`btn btn-lg support-all-btn${added ? ' support-all-btn--added' : ' btn-yellow'}`}
            onClick={handleAddAll}
            aria-label={
              added
                ? `Added ${selected} support${selected !== 1 ? 's' : ''} per costume to cart`
                : `Add ${selected} support${selected !== 1 ? 's' : ''} for each of ${costumeIds.length} costumes — $${totalCost} total`
            }
          >
            {added ? '✓ Added to Cart!' : `Add All — $${totalCost}`}
          </button>
        </div>
      </div>
    </section>
  )
}
