import prisma from '../../../lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '../../../components/AddToCartButton'

export default async function ProductDetails({ params }) {
  // انتزاع الـ id من الرابط
  const { id } = await params

  // جلب المنتج من قاعدة البيانات
  const product = await prisma.product.findUnique({
    where: { id: id }
  })

  if (!product) return notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="container mx-auto px-4 text-right">
        <Link href="/" className="text-[#002d56] mb-8 inline-flex items-center hover:font-bold">
          <span className="ml-2">→</span> العودة للرئيسية
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-12 rounded-2xl shadow-lg">
          {/* صورة المنتج */}
          <div className="bg-white rounded-xl flex items-center justify-center p-4 border border-gray-100">
            <img 
              src={product.image || '/images/placeholder.jpg'} 
              alt={product.name} 
              className="max-h-[450px] object-contain" 
            />
          </div>

          {/* معلومات المنتج */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#002d56] mb-4">{product.name}</h1>
            
            <div className="bg-yellow-50 inline-block px-4 py-2 rounded-lg mb-6 self-start">
              <span className="text-3xl font-black text-[#002d56]">
                {Number(product.price).toLocaleString()} ل.س
              </span>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-xl font-bold mb-4">تفاصيل المنتج:</h2>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {product.description || "لا يوجد وصف متوفر لهذا المنتج حالياً."}
              </p>
            </div>

            <div className="mt-auto pt-8 space-y-4">
              {/* تمرير المنتج مع التأكد أن p صغيرة */}
             // ابحث عن مكان وضع الزر واستبدله بهذا السطر:
<AddToCartButton product={{ id: product.id, name: product.name }} />
              <p className="text-center text-sm text-gray-400">توصيل متوفر لجميع المحافظات السورية 🇸🇾</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}