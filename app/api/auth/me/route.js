import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import prisma from '../../../../lib/prisma'

export async function GET(req) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/token=([^;]+)/)
    const token = match ? match[1] : null
    const payload = token ? verifyToken(token) : null
    if (!payload) return NextResponse.json({ user: null })

    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, email: true, name: true, role: true } })
    return NextResponse.json({ user })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ user: null })
  }
}
