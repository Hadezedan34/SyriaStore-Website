'use client'
import React from 'react'
import { CartProvider } from './CartContext'

export default function ClientProviders({ children }) {
  return <CartProvider>{children}</CartProvider>
}
