'use client'

import { useState } from 'react'

export default function PhotoGallery({ photos, costumeName }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="gallery-empty" role="img" aria-label={`No photos available for ${costumeName}`}>
        🎃
      </div>
    )
  }

  return (
    <div className="photo-gallery">
      <div
        className="gallery-main"
        role="img"
        aria-label={`${costumeName} — photo ${activeIndex + 1} of ${photos.length}`}
      >
        <img
          src={photos[activeIndex]}
          alt={`${costumeName}, photo ${activeIndex + 1} of ${photos.length}`}
          className="gallery-main-img"
          key={activeIndex}
        />
      </div>

      {photos.length > 1 && (
        <div
          className="gallery-thumbs"
          role="list"
          aria-label={`${costumeName} photo thumbnails`}
        >
          {photos.map((url, i) => (
            <button
              key={i}
              role="listitem"
              className={`gallery-thumb${i === activeIndex ? ' active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1} of ${photos.length}`}
              aria-pressed={i === activeIndex}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              <img src={url} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
