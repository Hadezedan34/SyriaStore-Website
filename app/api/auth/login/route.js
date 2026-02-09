import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt' 
import prisma from '../../../../lib/prisma' 
import { signToken } from '../../../../lib/auth' 

export async function POST(req) {
  try {
    const body = await req.json()
    const email = (body.email || "").trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json({ error: 'الرجاء إدخال كافة البيانات' }, { status: 400 })
    }

    // 1. البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: email }
    })

    if (!user) {
      return NextResponse.json({ error: 'الإيميل غير مسجل' }, { status: 401 })
    }

    // 2. مقارنة كلمة المرور المشفرة (السر هنا)
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'كلمة المرور خاطئة' }, { status: 401 })
    }

    // 3. إنشاء التوكن (عشان يضل مسجل دخول وما يطلعه)
    const token = signToken({ id: user.id, email: user.email, role: user.role })

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role }
    })

    // 4. حفظ التوكن في الكوكيز
    res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`)

    return res

  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}