import { NextResponse } from 'next/server'

export async function GET(req) {
  const response = NextResponse.redirect(new URL('/', req.url))
  const handleLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('cart'); // هذا السطر سيحل مشكلتك نهائياً
  window.location.href = '/login';
};
  // حذف التوكن من الكوكيز
  response.cookies.set('token', '', { expires: new Date(0) })
  return response
}