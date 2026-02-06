import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json(); // سنستخدم JSON بدلاً من FormData لضمان وصول البيانات
    const { title, description, price, category, image, sellerId } = body;

    console.log("البيانات الواصلة للسيرفر:", { title, price, sellerId });

    if (!title || !price || !image || !sellerId) {
      return NextResponse.json({ error: "بيانات المنتج أو معرف البائع ناقصة" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: title,
        description: description || "",
        price: parseFloat(price),
        image: image,
        category: category || "Other",
        sellerId: sellerId, // الحقل كما هو في السكيما
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("خطأ السيرفر:", error.message);
    return NextResponse.json({ error: "فشل في حفظ المنتج: " + error.message }, { status: 500 });
  }
}