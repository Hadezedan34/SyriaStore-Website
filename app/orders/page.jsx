'use client'
import { useState, useEffect } from 'react'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // متغير جديد لمنع ظهور الرسالة قبل البحث

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 5) return; // منع البحث إذا كان الرقم قصيراً جداً

    setLoading(true)
    setHasSearched(true)
    
    try {
      const res = await fetch(`/api/orders?phone=${phone.trim()}`, { cache: 'no-store' })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-right" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-[#002d56] mb-8">متابعة طلباتي</h1>

        {/* نموذج البحث */}
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-8 border border-gray-100">
          <p className="mb-4 text-gray-600">أدخل رقم هاتفك الذي استخدمته عند الطلب لمشاهدة الحالة:</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text" 
              placeholder="09xxxxxxxx" 
              className="flex-1 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-left font-mono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} // هنا نحدث الرقم فقط ولا نبحث
            />
            <button 
              type="submit"
              className="bg-[#002d56] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-800 transition shadow-md"
            >
              بحث عن الطلبات
            </button>
          </form>
        </div>

        {/* عرض النتائج */}
        {loading ? (
          <div className="text-center py-10 font-bold text-blue-900">جاري البحث عن طلباتك...</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex justify-between items-center transition-all hover:border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={order.product?.image} alt="" className="object-contain max-h-full" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#002d56] text-lg">{order.product?.name}</h3>
                    <p className="text-sm text-gray-400 font-mono">ID: #{order.id.slice(-5)}</p>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end gap-2">
                  <span className={`px-4 py-1 rounded-full text-xs font-black ${
                    order.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'DONE' ? '✅ تم التوصيل' : '🕒 قيد المعالجة'}
                  </span>
                  <p className="font-black text-blue-900">{order.product?.price?.toLocaleString()} ل.س</p>
                </div>
              </div>
            ))}

            {/* لا تظهر هذه الرسالة إلا إذا ضغط المستخدم زر البحث ولم يجد شيئاً */}
            {hasSearched && orders.length === 0 && !loading && (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-bold">عذراً.. لم نجد أي طلبات مرتبطة بالرقم {phone}</p>
                <p className="text-xs text-gray-400 mt-2">تأكد من كتابة الرقم كما أدخلته في صفحة الدفع</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}