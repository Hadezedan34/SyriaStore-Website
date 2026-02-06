'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // حالة التحميل
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'فشل تسجيل الدخول')
        setLoading(false)
        return
      }

      // 🟢 الخطوة السحرية: تخزين بيانات المستخدم في المتصفح
      // من الصورة السابقة، الـ Navbar ناطر شي اسمه 'user'
      localStorage.setItem('user', JSON.stringify(data.user))

      // 🔵 الخطوة الثانية: الانتقال للصفحة الرئيسية مع تحديث كامل
      // استخدمنا window.location لضمان أن الـ Navbar يقرأ البيانات فوراً
      window.location.href = '/'
      
    } catch (err) {
      setError('مشكلة في الاتصال بالسيرفر')
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 text-right" dir="rtl">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-black text-[#002d56] mb-6 text-center">تسجيل الدخول</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">البريد الإلكتروني</label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email"
              placeholder="example@mail.com" 
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#ffce00] outline-none transition-all" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">كلمة المرور</label>
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#ffce00] outline-none transition-all text-left" 
              required
            />
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-bold border-r-4 border-red-500">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-md ${
              loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#ffce00] text-[#002d56] hover:bg-yellow-500 hover:shadow-yellow-200'
            }`}
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            ليس لديك حساب؟ <a href="/auth/register" className="text-[#002d56] font-bold underline">سجل الآن</a>
          </p>
        </form>
      </div>
    </div>
  )
}