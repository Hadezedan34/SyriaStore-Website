import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '../../../../lib/prisma'
import { signToken } from '../../../../lib/auth'

const ALLOWED_ROLES = ['BUYER', 'SELLER']

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, name, role } = body
    
    // التأكد من وجود البيانات الأساسية
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // التأكد من عدم وجود حساب مسبق بنفس الإيميل
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User exists' }, { status: 409 })
    }

    // تحديد الصلاحية (Role)
    const chosenRole = role ? String(role).toUpperCase() : 'BUYER'
    const finalRole = ALLOWED_ROLES.includes(chosenRole) ? chosenRole : 'BUYER'

    // تشفير كلمة المرور
    const hash = await bcrypt.hash(password, 10)
    
    // إنشاء المستخدم في قاعدة البيانات
    const user = await prisma.user.create({ 
      data: { 
        email, 
        password: hash, 
        name: name || null, 
        role: finalRole 
      } 
    })

    // إنشاء توكن الدخول
    const token = signToken({ id: user.id, email: user.email, role: user.role })

    // اضافة الاسم في النافبار
    const res = NextResponse.json({ 
      ok: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, // الحقل اللي كان ناقص
        role: user.role 
      } 
    })

    // وضع التوكن في الكوكيز (Cookie)
    res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`)
    
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}