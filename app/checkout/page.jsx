'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SYRIAN_CITIES = [
  { name: "دمشق", deliveryFee: 15000, duration: "24 ساعة" },
  { name: "ريف دمشق", deliveryFee: 20000, duration: "1-2 يوم" },
  { name: "حلب", deliveryFee: 25000, duration: "2-3 أيام" },
  { name: "حمص", deliveryFee: 20000, duration: "1-2 يوم" },
  { name: "اللاذقية", deliveryFee: 25000, duration: "2-3 أيام" },
  { name: "طرطوس", deliveryFee: 25000, duration: "2-3 أيام" },
  { name: "حماة", deliveryFee: 20000, duration: "1-2 يوم" },
];

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [selectedCity, setSelectedCity] = useState(SYRIAN_CITIES[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('cart')
    if (data) {
      const parsedData = JSON.parse(data)
      
      // منطق مرن: تحويل البيانات لتنسيق موحد (Normalization)
      const normalizedData = parsedData.map(item => ({
        id: item.id || item._id,
        name: item.name || item.title || item.productName || "منتج بدون اسم",
        price: parseFloat(item.price || item.productPrice || 0),
        quantity: parseInt(item.quantity || item.qty || 1)
      }))
      
      setCartItems(normalizedData)
    }
  }, [])

  // حساب المجموع الفرعي بدقة
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const totalAmount = subtotal + selectedCity.deliveryFee

  const handleConfirmOrder = async (e) => {
    e.preventDefault()
    if (cartItems.length === 0) return alert("السلة فارغة")

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customerName,
          customerPhone,
          city: selectedCity.name,
        }),
      })

      if (res.ok) {
  // بدل الـ alert القديم
  localStorage.removeItem('cart') // تنظيف السلة
  router.push('/checkout/success') // الانتقال لصفحة الاحتفال
} else {
        alert("فشل في إرسال الطلب")
      }
    } catch (err) {
      alert("خطأ في الاتصال")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* القسم الأيمن: مراجعة المشتريات */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6 border-r-4 border-yellow-400 pr-3">قائمة مشترياتك</h2>
          
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center py-10 font-bold italic">السلة فارغة.. لم يتم العثور على منتجات!</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="block font-bold text-gray-800">{item.name}</span>
                    <span className="text-xs text-gray-500 italic">الكمية: {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold">{(item.price * item.quantity).toLocaleString()} ل.س</span>
                </div>
              ))}
              
              <div className="pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>سعر المنتجات:</span>
                  <span>{subtotal.toLocaleString()} ل.س</span>
                </div>
                <div className="flex justify-between text-gray-600 border-b pb-3">
                  <span>أجور التوصيل ({selectedCity.name}):</span>
                  <span>{selectedCity.deliveryFee.toLocaleString()} ل.س</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-blue-900 pt-2">
                  <span>الإجمالي الكلي:</span>
                  <span>{totalAmount.toLocaleString()} ل.س</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* القسم الأيسر: بيانات الشحن */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 border-r-4 border-blue-900 pr-3">معلومات التوصيل</h2>
          <form onSubmit={handleConfirmOrder} className="space-y-4">
            <input type="text" placeholder="الاسم الكامل" required className="w-full p-3 bg-gray-50 rounded-xl outline-none" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} />
            <input type="tel" placeholder="رقم الهاتف" required className="w-full p-3 bg-gray-50 rounded-xl outline-none font-mono" value={customerPhone} onChange={(e)=>setCustomerPhone(e.target.value)} />
            
            <select className="w-full p-3 bg-gray-50 rounded-xl outline-none cursor-pointer" onChange={(e) => setSelectedCity(SYRIAN_CITIES.find(c => c.name === e.target.value))}>
              {SYRIAN_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            
            <div className="text-sm bg-blue-50 p-3 rounded-lg text-blue-700">
              ⏱️ مدة التوصيل المتوقعة: <b>{selectedCity.duration}</b>
            </div>

            <button type="submit" disabled={isSubmitting || cartItems.length === 0} className="w-full bg-yellow-400 py-4 rounded-xl font-black text-lg hover:bg-yellow-500 transition-transform active:scale-95">
              {isSubmitting ? "جاري الإرسال..." : "تأكيد وإرسال الطلب"}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}