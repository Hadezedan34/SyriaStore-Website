import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// 1. جلب الطلبات (GET) - للمشتري وللبائع
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const sellerId = searchParams.get('sellerId');

    // أ- إذا كان الطلب من صفحة "متابعة طلباتي" للزبون
    if (phone) {
      const orders = await prisma.order.findMany({
        where: { customerPhone: phone },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(orders);
    }

    // ب- إذا كان الطلب من صفحة "لوحة البائع"
    if (sellerId && sellerId !== "undefined") {
      const orders = await prisma.order.findMany({
        where: {
          product: {
            sellerId: sellerId // التأكد من جلب الطلبات الخاصة بمنتجات هذا البائع فقط
          }
        },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(orders);
    }

    // ج- حالة احتياطية إذا لم يتم إرسال أي فلتر ()
    return NextResponse.json([]);
  } catch (error) {
    console.error("GET Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. إنشاء طلب جديد (POST) - من صفحة الدفع أو السلة
export async function POST(req) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, city, items, productId } = body;

    // حالة السلة (مجموعة منتجات)
    if (items && items.length > 0) {
      await Promise.all(
        items.map(item => 
          prisma.order.create({
            data: {
              customerName,
              customerPhone,
              customerCity: city || "",
              status: "PENDING",
              productId: item.id
            }
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    // حالة الطلب المباشر (منتج واحد)
    if (productId) {
      await prisma.order.create({
        data: {
          customerName,
          customerPhone,
          customerCity: city || "",
          status: "PENDING",
          productId: productId
        }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  } catch (error) {
    console.error("POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// لزر "تأكيد الإرسال" عند البائع
export async function PATCH(req) {
  try {
    const { orderId, newStatus } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("PATCH Error:", error.message);
    return NextResponse.json({ error: "فشل تحديث الحالة" }, { status: 500 });
  }
}