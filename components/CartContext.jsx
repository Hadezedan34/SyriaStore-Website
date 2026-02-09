'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setCartItems(JSON.parse(saved))
      } catch (e) {
        setCartItems([])
      }
    }
  }, [])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const updated = [...prev, { ...product, quantity: product.quantity || 1 }]
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }


  const increaseQuantity = (id) => { /* برمجة الزيادة */ }
  const decreaseQuantity = (id) => { /* برمجة النقصان */ }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      increaseQuantity,
      decreaseQuantity 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}