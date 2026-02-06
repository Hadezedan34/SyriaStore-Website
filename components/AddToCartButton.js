'use client'
import { useState } from 'react'

export default function AddToCartButton({ productId }) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleOrder(e) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // تجهيز البيانات مع ضمان أن productId نصي
    const payload = {
      customerName: formData.get('name'),
      customerPhone: formData.get('phone'),
      customerCity: formData.get('city'),
      productId: String(productId) 
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        alert("✅ تم إرسال الطلب بنجاح!")
        setShowForm(false)
        e.target.reset() // تفريغ الحقول
      } else {
        const errorData = await res.json()
        alert("❌ فشل: " + (errorData.error || "خطأ غير معروف"))
      }
    } catch (err) {
      alert("❌ خطأ في الاتصال بالسيرفر")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl">
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="w-full bg-[#ffce00] text-[#002d56] py-4 rounded-xl font-bold text-xl shadow-lg"
        >
          اطلب الآن (تثبيت طلب مباشر)
        </button>
      ) : (
        <form onSubmit={handleOrder} className="bg-white border-2 border-gray-100 p-6 rounded-2xl space-y-4 shadow-xl">
          <input name="name" placeholder="الاسم الكامل" required className="w-full p-3 bg-gray-50 border rounded-xl" />
          <input name="phone" placeholder="رقم الهاتف" required className="w-full p-3 bg-gray-50 border rounded-xl" />
          <input name="city" placeholder="المحافظة" required className="w-full p-3 bg-gray-50 border rounded-xl" />
          
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-[#002d56] text-white py-3 rounded-xl font-bold">
              {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl">إلغاء</button>
          </div>
        </form>
      )}
    </div>
  )
}