'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('BUYER')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      })

      const data = await res.json()

      if (!res.ok) {
        return setError(data.error || 'فشل التسجيل')
      }

      
     
      localStorage.setItem('user', JSON.stringify(data.user))

   
      router.push('/')
      router.refresh() 
      window.location.reload();
      

    } catch (err) {
      setError('حدث خطأ غير متوقع')
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">إنشاء حساب في سوريا ستور</h1>
        
        {error && <p className="bg-red-100 text-red-600 p-2 mb-4 rounded text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="الاسم" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded" required 
          />
          <input 
            type="email" placeholder="البريد الإلكتروني" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded" required 
          />
          <input 
            type="password" placeholder="كلمة المرور" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded" required 
          />
          
          <select 
            value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="BUYER">مشتري</option>
            <option value="SELLER">بائع</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            تسجيل الحساب
          </button>
        </form>
      </div>
    </div>
  )
}