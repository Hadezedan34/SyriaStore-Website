'use client'
import Link from 'next/link'
import { useCart } from './CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="cursor-pointer flex-1">
        <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
          <img 
            src={product.image || "/images/placeholder.jpg"} 
            alt={product.name} 
            className="h-full object-contain group-hover:scale-105 transition-transform" 
          />
        </div>
        <div className="p-4 text-right">
          <h3 className="text-lg font-bold text-[#002d56] line-clamp-1">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">{product.description}</p>
          
          {}
          <p 
            className="text-xl font-black text-[#002d56] mt-3" 
            suppressHydrationWarning
          >
            {product.price?.toLocaleString()} <span className="text-sm font-normal">SYP</span>
          </p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full bg-[#ffce00] text-[#002d56] font-bold py-2 rounded-lg hover:bg-yellow-500 transition shadow-sm flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          إضافة للسلة
        </button>
      </div>
    </div>
  )
}