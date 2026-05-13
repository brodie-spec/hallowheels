'use client'

import { useEffect, useState } from 'react'

export default function HeroSlideshow({ photos }) {
  const [current, setCurrent] = useState(0)
  const [prev,    setPrev]    = useState(null)
  const [fading,  setFading]  = useState(false)

  useEffect(() => {
    if (photos.length <= 1) return
    const interval = setInterval(() => {
      setPrev(current)
      setFading(true)
      setTimeout(() => {
        setCurrent(i => (i + 1) % photos.length)
        setFading(false)
        setPrev(null)
      }, 800)
    }, 5000)
    return () => clearInterval(interval)
  }, [current, photos.length])

  return (
    <>
      <style>{`
        .slideshow {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 0.8s ease;
        }
        .slide-current { opacity: 1; z-index: 2; }
        .slide-prev    { opacity: 0; z-index: 1; }
        .slide-hidden  { opacity: 0; z-index: 0; }
      `}</style>
      <div className="slideshow">
        {photos.map((photo, i) => {
          let className = 'slide slide-hidden'
          if (i === current) className = `slide slide-current${fading ? ' slide-prev' : ''}`
          else if (i === prev) className = 'slide slide-current'
          return (
            <div
              key={photo.src}
              className={className}
              style={{ backgroundImage: `url(${photo.src})` }}
            />
          )
        })}
      </div>
    </>
  )
}
