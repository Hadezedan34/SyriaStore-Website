"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SellerDashboard() {
  const router = useRouter()
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [preview, setPreview] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [useFileUploader, setUseFileUploader] = useState(true) // ميزة التبديل
  
  const [orders, setOrders] = useState([])
  const [myProducts, setMyProducts] = useState([])
  const [filter, setFilter] = useState('ALL')

  const fetchData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) { router.push('/login'); return; }
      const user = JSON.parse(userData);
      
      const resOrders = await fetch(`/api/orders?sellerId=${user.id}`);
      const dataOrders = await resOrders.json();
      if (resOrders.ok) setOrders(Array.isArray(dataOrders) ? dataOrders : []);
      
      const resProducts = await fetch(`/api/products?sellerId=${user.id}`);
      const dataProducts = await resProducts.json();
      if (resProducts.ok) setMyProducts(dataProducts);
    } catch (error) { console.error(error) } finally { setLoadingData(false) }
  }

  useEffect(() => { fetchData() }, [])

  async function handleAddProduct(e) {
    e.preventDefault();
    setLoadingAdd(true);
    const formData = new FormData(e.currentTarget);
    const user = JSON.parse(localStorage.getItem('user'));
    
    // اختيار الصورة بناءً على الميزة المختارة
    const finalImage = useFileUploader ? preview : imageUrl;

    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          price: formData.get('price'),
          description: formData.get('description'),
          category: formData.get('category'),
          image: finalImage,
          sellerId: user.id
        }),
      });
      if (res.ok) {
        e.target.reset();
        setPreview(null);
        setImageUrl('');
        fetchData();
        alert("تم النشر بنجاح");
      }
    } catch (err) { alert("خطأ في السيرفر"); } finally { setLoadingAdd(false); }
  }

  if (loadingData) return <div className="min-h-screen flex items-center justify-center bg-white font-black text-slate-300">جاري التحميل...</div>

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1C21]" dir="rtl">
      
      <style jsx global>{`
        body { background-color: #F8FAFC !important; margin: 0; }
        input, select, textarea { border: 1px solid #E2E8F0 !important; transition: all 0.3s; }
        input:focus { border-color: #2563EB !important; ring: 2px rgba(37, 99, 235, 0.1); }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <header className="bg-white rounded-[2rem] p-8 mb-10 shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">لوحة التحكم <span className="text-blue-600">.</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Syria Store Merchant Console</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-center px-4">
              <span className="block text-[10px] font-black text-slate-400 uppercase">منتجاتك</span>
              <span className="text-2xl font-black text-slate-900">{myProducts.length}</span>
            </div>
            <div className="text-center px-4 border-r border-slate-200">
              <span className="block text-[10px] font-black text-slate-400 uppercase">الطلبات</span>
              <span className="text-2xl font-black text-blue-600">{orders.length}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Form إضافة المنتج */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100">
              <h2 className="text-lg font-black mb-8 text-slate-800 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                إضافة قطعة جديدة
              </h2>
              
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 mr-1 uppercase">اسم المنتج</label>
                  <input name="title" required className="w-full p-4 bg-white rounded-xl outline-none font-bold text-slate-700" placeholder="مثلاً: لابتوب ديل" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 mr-1 uppercase">السعر</label>
                    <input name="price" type="number" required className="w-full p-4 bg-white rounded-xl outline-none font-black text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 mr-1 uppercase">الفئة</label>
                    <select name="category" className="w-full p-4 bg-white rounded-xl outline-none font-bold text-slate-500">
                      <option value="Electronics">إلكترونيات</option>
                      <option value="Home">منزل</option>
                    </select>
                  </div>
                </div>

                {/* ميزة التبديل بين الرابط والملف */}
                <div className="space-y-4">
                   <div className="flex justify-between items-center mb-2">
                     <label className="text-xs font-black text-slate-400 uppercase">صورة المنتج</label>
                     <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setUseFileUploader(true)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition ${useFileUploader ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>رفع ملف</button>
                        <button type="button" onClick={() => setUseFileUploader(false)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition ${!useFileUploader ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>رابط URL</button>
                     </div>
                   </div>

                   {useFileUploader ? (
                      <div className="relative h-44 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:bg-slate-100 transition-all cursor-pointer overflow-hidden">
                        {preview ? <img src={preview} className="w-full h-full object-cover" /> : (
                          <span className="text-[10px] font-black text-slate-400 uppercase">اضغط لرفع الصورة</span>
                        )}
                        <input type="file" onChange={(e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onloadend=()=>setPreview(r.result); r.readAsDataURL(f); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                   ) : (
                      <input type="text" placeholder="ضع رابط الصورة هنا..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-4 bg-white rounded-xl outline-none font-medium text-sm text-slate-500" />
                   )}
                </div>

                <button disabled={loadingAdd} className="w-full py-5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 mt-4">
                  {loadingAdd ? "جاري الحفظ..." : "نشر المنتج"}
                </button>
              </form>
            </div>
          </aside>

          {/* العرض (Orders & Products) */}
          <section className="col-span-12 lg:col-span-8 space-y-10">
            {/* Orders */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">قائمة الطلبات</h3>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <div className="divide-y divide-slate-50">
                {orders.length === 0 ? <div className="p-20 text-center text-slate-300 font-bold uppercase text-xs">لا يوجد طلبات حالياً</div> : 
                  orders.map(order => (
                    <div key={order.id} className="p-8 flex items-center gap-6 hover:bg-slate-50/50">
                      <img src={order.product?.image} className="w-16 h-16 rounded-2xl object-cover bg-slate-100" />
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-slate-800">{order.product?.title}</h4>
                        <p className="text-xs text-slate-400 font-bold">{order.customerName}</p>
                      </div>
                      <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">شحن</button>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {myProducts.map(product => (
                <div key={product.id} className="bg-white rounded-[2.5rem] p-5 border border-slate-100 hover:shadow-xl transition-all group">
                  <div className="aspect-video rounded-[1.8rem] overflow-hidden bg-slate-50 mb-6 relative">
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  </div>
                  <div className="px-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-xl font-black text-slate-800">{product.title}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{product.category}</p>
                    </div>
                    <span className="text-xl font-black text-blue-600">{product.price} SYP</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}