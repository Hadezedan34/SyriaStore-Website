'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function SuccessPage() {
  useEffect(() => {
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#002d56', '#ffce00', '#ffffff']
    })
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4" dir="rtl">
      {/* أيقونة متحركة */}
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl font-black text-[#002d56] mb-4">تم استلام طلبك بنجاح! 🎉</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        شكراً لك.. طلبك الآن قيد المراجعة، وسيقوم البائع بالتواصل معك قريباً لتأكيد الشحن.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/" className="bg-[#002d56] text-white px-8 py-4 rounded-2xl font-bold hover:bg-opacity-90 transition shadow-lg">
          العودة للتسوق
        </Link>
        <Link href="/orders" className="bg-gray-100 text-[#002d56] px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition">
          متابعة طلباتي
        </Link>
      </div>
    </div>
  )
}