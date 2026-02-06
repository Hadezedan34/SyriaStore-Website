import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // تأكد من مسار بريزما عندك

// 1. جلب المنتجات (موجود مسبقاً مع إضافة فلتر البائع)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    const products = await prisma.product.findMany({
      where: sellerId ? { sellerId: sellerId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب المنتجات" }, { status: 500 });
  }
}

// 2. تعديل المنتج (PUT)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, price, description, category } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        price: parseFloat(price),
        description,
        category,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "فشل تحديث المنتج" }, { status: 500 });
  }
}

// 3. حذف المنتج (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID المنتج مطلوب" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "فشل الحذف، قد يكون المنتج مرتبطاً بطلبات حالية" }, { status: 500 });
  }
}