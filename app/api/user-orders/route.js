import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const phone = searchParams.get('phone')
  const all = searchParams.get('all')

  try {
    const orders = await prisma.order.findMany({
      where: all ? {} : { customerPhone: phone }, 
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}