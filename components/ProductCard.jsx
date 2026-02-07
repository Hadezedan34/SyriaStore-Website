export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="h-48 overflow-hidden">
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-5 text-right">
        <h3 className="font-black text-[#002d56] mb-1">{product.title}</h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-1">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#002d56]">{product.price} SYP</span>
          <button className="bg-[#ffce00] text-[#002d56] px-4 py-2 rounded-xl text-xs font-black">تفاصيل</button>
        </div>
      </div>
    </div>
  )
}