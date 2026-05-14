'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hw_cart')
      if (stored) setCart(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('hw_cart', JSON.stringify(cart))
    } catch {}
  }, [cart, hydrated])

  function addToCart(costumeId) {
    setCart(prev => ({ ...prev, [costumeId]: (prev[costumeId] || 0) + 1 }))
  }

  function removeFromCart(costumeId) {
    setCart(prev => {
      const next = { ...prev }
      if (!next[costumeId]) return next
      if (next[costumeId] <= 1) delete next[costumeId]
      else next[costumeId]--
      return next
    })
  }

  function clearCart() {
    setCart({})
  }

  function addToCartAll(costumeIds, units = 1) {
    setCart(prev => {
      const next = { ...prev }
      for (const id of costumeIds) {
        next[id] = (next[id] || 0) + units
      }
      return next
    })
  }

  return (
    <CartContext.Provider value={{ cart, hydrated, addToCart, removeFromCart, clearCart, addToCartAll }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
