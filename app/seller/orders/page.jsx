'use client'
import { useState, useEffect } from 'react'

export default function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const userData = localStorage.getItem('user')
      if (!userData) {
        console.error("لا يوجد مستخدم مسجل دخول")
        setLoading(false)
        return
      }
      
      const user = JSON.parse(userData)
      // السطر اللي عمل المشكلة حطيناه هون في مكانه الصحيح للفحص
      console.log("برسل للسيرفر ID البائع:", user.id); 

      const res = await fetch(`/api/orders?sellerId=${user.id}`)
      const data = await res.json()
      
      if (res.ok) {
        setOrders(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchOrders() 
  }, [])

  const updateStatus = async (orderId) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId, newStatus: 'DONE' })
      })

      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'DONE' } : o))
        alert("تم تحديث حالة الطلب إلى DONE ✅")
      } else {
        const errorData = await res.json()
        alert("فشل التحديث: " + errorData.error)
      }
    } catch (err) {
      alert("خطأ في الاتصال بالسيرفر")
    }
  }

  if (loading) return <div className="text-center py-20 font-bold">جاري تحميل الطلبات...</div>

  return (
    <div className="p-10 text-right bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-black mb-8 text-[#002d56]">📦 طلبات الزبائن الواردة</h1>
      
      <div className="grid gap-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
            <p className="text-gray-500">لا يوجد طلبات لمنتجاتك حالياً.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                    منتج: {order.product?.name || "منتج محذوف"}
                  </span>
                  <span className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleString('ar-SY')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#002d56]">الزبون: {order.customerName}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <p>📞 <span className="font-mono">{order.customerPhone}</span></p>
                  <p>📍 <span>{order.customerCity}</span></p>
                  <p>💰 <span className="font-bold text-green-600">{order.product?.price?.toLocaleString()} ل.س</span></p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                <span className={`px-4 py-2 rounded-xl text-xs font-black ${
                  order.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status === 'DONE' ? '✅ تم التوصيل' : '🕒 قيد الانتظار'}
                </span>

                {order.status !== 'DONE' && (
                  <button 
                    onClick={() => updateStatus(order.id)}
                    className="w-full md:w-auto bg-[#ffce00] text-[#002d56] px-8 py-3 rounded-2xl font-black hover:shadow-lg transition-all active:scale-95"
                  >
                    تأكيد الإرسال
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}