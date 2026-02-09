'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from './CartContext' 

export default function Navbar() {
  const [query, setQuery] = useState('')
  const { cartItems } = useCart()
  const itemCount = cartItems?.reduce((s, it) => s + (it.quantity || 0), 0) || 0

  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user')
        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
          setUser(JSON.parse(savedUser))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("خطأ في قراءة بيانات المستخدم:", error)
        localStorage.removeItem('user')
        setUser(null)
      }
    }

    loadUser()
    window.addEventListener('storage', loadUser)
    return () => window.removeEventListener('storage', loadUser)
  }, [])

  function handleLogout() {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-[#002d56] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* اللوغو */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-[#ffce00] p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-yellow-500/20">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#002d56]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-[#ffce00] tracking-tighter">SyriaStore</span>
                <span className="text-[10px] text-gray-300 font-bold">سـوريا ستور</span>
              </div>
            </Link>
          </div>

          {/* شريط البحث  */}
          <div className="flex-1 max-w-xl mx-4 hidden sm:block">
            <div className="relative group text-right" dir="rtl">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="عن ماذا تبحث اليوم؟"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-xl py-2 pl-10 pr-4 focus:bg-white focus:text-[#002d56] transition-all outline-none focus:ring-2 focus:ring-[#ffce00]"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#002d56]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                </svg>
              </div>
            </div>
          </div>

          {/* قسم المستخدم والسلة */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            
            {/* زر مراقبة الطلبات  */}
            <Link 
              href="/orders" 
              className="hidden md:flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-[#ffce00] transition px-2 border-l border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>طلباتي</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 md:gap-4" dir="rtl">
                {user.role === 'SELLER' && (
                  <div className="flex gap-2">
                    <Link 
                      href="/seller/dashboard" 
                      className="text-xs font-bold border border-[#ffce00] text-[#ffce00] px-3 py-1.5 rounded-lg hover:bg-[#ffce00] hover:text-[#002d56] transition shadow-lg shadow-yellow-500/5"
                    >
                      DashBoard
                    </Link>
                    
                    <Link 
                      href="/seller/orders" 
                      className="text-xs font-bold bg-[#ffce00] text-[#002d56] px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition flex items-center gap-1 shadow-lg shadow-yellow-500/10"
                    >
                      <span>طلبات الزبائن</span>
                      <span className="bg-[#002d56] text-white text-[9px] px-1 rounded animate-pulse">جديد</span>
                    </Link>
                  </div>
                )}
                
                <div className="flex flex-col items-start hidden sm:flex leading-tight">
                  <span className="text-[10px] text-gray-400">أهلاً بك</span>
                  <span className="text-sm font-bold text-[#ffce00] truncate max-w-[100px]">{user.name}</span>
                </div>

                <button 
                  onClick={handleLogout} 
                  className="p-2 text-gray-400 hover:text-red-400 transition"
                  title="خروج"
                >
                  <svg xmlns="http://www.w3.org/2000/xl" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 md:gap-3">
                <Link href="/auth/login" className="text-sm font-bold hover:text-[#ffce00] transition px-2">دخول</Link>
                <Link href="/auth/register" className="bg-[#ffce00] text-[#002d56] text-sm px-4 py-2 rounded-xl font-black shadow-lg shadow-yellow-500/20 hover:scale-105 transition-transform">سجل</Link>
              </div>
            )}

            <div className="w-[1px] h-6 bg-white/10 mx-1 hidden md:block"></div>

            <Link href="/cart" className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffce00] group-hover:rotate-6 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#002d56] shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}