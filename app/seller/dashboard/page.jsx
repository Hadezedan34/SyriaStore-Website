"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SellerDashboard() {
  const router = useRouter()
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [preview, setPreview] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [useFileUploader, setUseFileUploader] = useState(true)
  
  const [orders, setOrders] = useState([])
  const [myProducts, setMyProducts] = useState([])

  // قائمة الأصناف - عدلها حسب رغبتك
  const categories = [
    { id: 'Electronics', label: 'إلكترونيات' },
    { id: 'Home', label: 'منزل' },
    { id: 'Vehicles', label: 'مركبات' },
    { id: 'Food', label: 'طعام' },
    { id: 'HomeMade', label: 'صناعات يدوية' },
    { id: 'Other', label: 'أخرى' }
  ];

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

  // ميزة إضافة المنتج
  async function handleAddProduct(e) {
    e.preventDefault();
    setLoadingAdd(true);
    const formData = new FormData(e.currentTarget);
    const user = JSON.parse(localStorage.getItem('user'));
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

  // ميزة الحذف - مربوطة مع الـ API تبعك
  async function handleDelete(productId) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;

    try {
      const res = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData(); // تحديث القائمة
      } else {
        const err = await res.json();
        alert(err.error || "فشل الحذف");
      }
    } catch (error) {
      alert("خطأ في الاتصال بالسيرفر");
    }
  }

  if (loadingData) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-blue-500 font-black">جاري التحميل...</div>

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans" dir="rtl">
      
      <style jsx global>{`
        body { background-color: #0F172A !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="bg-[#1E293B] rounded-3xl p-6 mb-8 border border-slate-700/50 flex flex-col md:flex-row justify-between items-center shadow-2xl">
          <div>
            <h1 className="text-2xl font-black text-white">لوحة التاجر <span className="text-blue-500">.</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Syria Store Merchant Console</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="bg-[#0F172A] px-5 py-3 rounded-2xl border border-slate-700 text-center">
              <span className="block text-[9px] font-bold text-slate-500">منتجاتك</span>
              <span className="text-xl font-black text-white">{myProducts.length}</span>
            </div>
            <div className="bg-blue-600/10 px-5 py-3 rounded-2xl border border-blue-500/20 text-center">
              <span className="block text-[9px] font-bold text-blue-400">الطلبات</span>
              <span className="text-xl font-black text-blue-500">{orders.length}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          
          {/* Aside: Add Product Form */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="bg-[#1E293B] rounded-3xl p-8 sticky top-8 border border-slate-700/50 shadow-xl">
              <h2 className="text-md font-black mb-6 text-white flex items-center gap-2 text-right">
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                إضافة منتج جديد
              </h2>
              
              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 mr-1">اسم المنتج</label>
                  <input name="title" required className="w-full p-3.5 bg-[#0F172A] border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-white text-sm" placeholder="مثلاً: لابتوب ديل" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 mr-1 text-right">السعر</label>
                    <input name="price" type="number" required className="w-full p-3.5 bg-[#0F172A] border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-blue-400 font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 mr-1 text-right">الفئة</label>
                    <select name="category" className="w-full p-3.5 bg-[#0F172A] border border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-300 text-sm">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-400">صورة المنتج</label>
                    <div className="flex bg-[#0F172A] p-1 rounded-lg border border-slate-700">
                      <button type="button" onClick={() => setUseFileUploader(true)} className={`px-3 py-1 rounded-md text-[9px] font-bold transition ${useFileUploader ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>رفع ملف</button>
                      <button type="button" onClick={() => setUseFileUploader(false)} className={`px-3 py-1 rounded-md text-[9px] font-bold transition ${!useFileUploader ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>رابط</button>
                    </div>
                  </div>

                  {useFileUploader ? (
                    <div className="relative h-32 bg-[#0F172A] rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden group hover:border-blue-500/50 transition-all">
                      {preview ? <img src={preview} className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-500 font-bold">ارفع صورة</span>}
                      <input type="file" onChange={(e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onloadend=()=>setPreview(r.result); r.readAsDataURL(f); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  ) : (
                    <input type="text" placeholder="ضع الرابط هنا..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-3.5 bg-[#0F172A] border border-slate-700 rounded-xl outline-none text-xs text-slate-400" />
                  )}
                </div>

                <button disabled={loadingAdd} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  {loadingAdd ? "جاري الحفظ..." : "نشر المنتج"}
                </button>
              </form>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Orders Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
                <span className="w-8 h-[1px] bg-slate-700"></span> الطلبات الجديدة
              </h3>
              
              {orders.length === 0 ? (
                <div className="bg-[#1E293B] rounded-3xl p-10 text-center border border-slate-700/30 text-slate-500 text-xs">لا يوجد طلبات</div>
              ) : (
                <div className="grid gap-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700/50 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <img src={order.product?.image} className="w-12 h-12 rounded-xl object-cover bg-[#0F172A]" />
                        <div>
                          <h4 className="text-sm font-black text-white">{order.product?.title}</h4>
                          <p className="text-[10px] text-blue-400 font-bold">{order.customerName}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-[#0F172A] hover:bg-green-600 text-[9px] font-black rounded-lg border border-slate-700 transition-all">شحن</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Products Section */}
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
                <span className="w-8 h-[1px] bg-slate-700"></span> منتجاتي في المتجر
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProducts.map(product => (
                  <div key={product.id} className="bg-[#1E293B] rounded-2xl p-3 border border-slate-700/50 flex gap-4 relative group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={product.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-black text-white">{product.title}</h4>
                      <p className="text-[9px] text-blue-500 font-bold uppercase">{product.category}</p>
                      <span className="text-sm font-black text-slate-300 mt-1">{product.price} SYP</span>
                    </div>
                    
                    {/* زر الحذف الفعال */}
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="absolute left-2 top-2 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      title="حذف المنتج"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>//sadasdasdasd
  )
}