'use client'

import { useState, useEffect } from 'react'

import ProductCard from '../components/ProductCard'



export default function HomePage() {

  const [products, setProducts] = useState([])

  const [filteredProducts, setFilteredProducts] = useState([])

  const [activeCategory, setActiveCategory] = useState('الكل')

  const [loading, setLoading] = useState(true)



  // التصنيفات الجديدة حسب طلبك

  const categories = [

    { id: 'الكل', name: 'كل المنتجات', icon: '🛒' },

    { id: 'Vehicles', name: 'مركبات', icon: '🚗' },

    { id: 'Food', name: 'طعام', icon: '🍕' },

    { id: 'Home', name: 'منزل', icon: '🏠' },

    { id: 'Electronics', name: 'إلكترونيات', icon: '⚡' },

    { id: 'Handmade', name: 'صناعات يدوية', icon: '🎨' },

    { id: 'Other', name: 'أخرى', icon: '📦' },

  ]



  useEffect(() => {

    async function fetchProducts() {

      try {

        const res = await fetch('/api/products')

        const data = await res.json()

        setProducts(data)

        setFilteredProducts(data)

      } catch (err) {

        console.error("خطأ في جلب المنتجات")

      } finally {

        setLoading(false)

      }

    }

    fetchProducts()

  }, [])



  useEffect(() => {

    if (activeCategory === 'الكل') {

      setFilteredProducts(products)

    } else {

      const filtered = products.filter(p => p.category === activeCategory)

      setFilteredProducts(filtered)

    }

  }, [activeCategory, products])



  return (

    <div className="flex flex-col md:flex-row gap-6 min-h-screen p-4 md:p-8" dir="rtl">

     

      {/* القائمة الجانبية بتصنيفاتك الجديدة */}

      <aside className="w-full md:w-64 shrink-0">

        <div className="sticky top-24 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">

          <h2 className="text-xl font-black text-[#002d56] mb-6 pr-2 border-r-4 border-[#ffce00]">التصنيفات</h2>

          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">

            {categories.map((cat) => (

              <button

                key={cat.id}

                onClick={() => setActiveCategory(cat.id)}

                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all whitespace-nowrap font-bold ${

                  activeCategory === cat.id

                    ? 'bg-[#002d56] text-white shadow-lg shadow-blue-900/20 scale-105'

                    : 'bg-transparent text-gray-500 hover:bg-gray-50'

                }`}

              >

                <span className="text-xl">{cat.icon}</span>

                <span>{cat.name}</span>

              </button>

            ))}

          </nav>

        </div>

      </aside>



      {/* قسم عرض المنتجات */}

      <main className="flex-1">

        <div className="mb-8">

          <h1 className="text-3xl font-black text-[#002d56] mb-2">

            {categories.find(c => c.id === activeCategory)?.name}

          </h1>

          <div className="h-1 w-20 bg-[#ffce00] rounded-full"></div>

        </div>



        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5, 6].map(i => (

              <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-[2rem]"></div>

            ))}

          </div>

        ) : filteredProducts.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredProducts.map((product) => (

              <ProductCard key={product.id} product={product} />

            ))}

          </div>

        ) : (

          <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">

            <div className="text-5xl mb-4">🏜️</div>

            <p className="text-gray-400 font-bold text-lg">لا توجد منتجات متوفرة حالياً في قسم {categories.find(c => c.id === activeCategory)?.name}</p>

          </div>

        )}

      </main>

    </div>

  )

}

