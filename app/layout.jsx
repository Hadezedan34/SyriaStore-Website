import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { CartProvider } from '../components/CartContext'

export const metadata = {
  title: 'SyriaStore | متجر سوريا',
  description: 'منصة التسوق الإلكتروني الأولى',
}

export default function RootLayout({ children }) {
  return (
    // أضفنا dir="rtl" و lang="ar" ليكون التنسيق العربي صحيحاً
    <html lang="ar" dir="rtl"> 
      <body className="bg-gray-50 text-gray-900">
        <CartProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto p-4 min-h-screen">
            {children}
          </main>
          {/* يمكنك إضافة Footer هنا لاحقاً */}
        </CartProvider>
      </body>
    </html>
  )
}