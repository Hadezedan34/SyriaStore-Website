 'use client'
import React from 'react'
import Link from 'next/link'
import { useCart } from '../../components/CartContext'

function formatSYP(n) {
  return n.toLocaleString('en-US') + ' SYP'
}

export default function CartPage() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart()

  const total = cartItems.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0)

  return (
    <section className="py-12">
      <div className="container">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm">Your cart is empty.</div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <ul className="divide-y">
              {cartItems.map(item => (
                <li key={item.id} className="py-4 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain bg-gray-50 p-2 rounded" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{formatSYP(item.price)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-700">{formatSYP((item.price || 0) * (item.quantity || 0))}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => decreaseQuantity(item.id)} className="px-2 py-1 bg-gray-100 rounded">-</button>
                      <div className="px-3 py-1 border rounded">{item.quantity}</div>
                      <button onClick={() => increaseQuantity(item.id)} className="px-2 py-1 bg-gray-100 rounded">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-4 text-sm text-red-600">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-lg font-medium">Total</div>
              <div className="text-2xl font-bold text-syria-gold">{formatSYP(total)}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/checkout" className="flex-1 bg-syria-gold text-syria-navy py-3 rounded text-center font-semibold">Proceed to Check out</Link>
              <button onClick={() => clearCart()} className="px-4 py-3 border rounded">Clear</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
