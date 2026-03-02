import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  
  // 1. เพิ่ม State สำหรับเก็บจำนวนสินค้าที่เลือก
  const [quantity, setQuantity] = useState(1);

  const products = [
    { id: 1, name: "CD เพลง Rock มือสอง", price: 450, desc: "แผ่น CD มือสอง สภาพดี" },
    { id: 2, name: "เสื้อ Nirvana วินเทจ", price: 890, desc: "เสื้อวงแท้ ปี 90s" },
    { id: 3, name: "แผ่นเสียง Beatles แท้", price: 1200, desc: "Vinyl แท้จาก UK" },
    { id: 4, name: "โปสเตอร์ Queen", price: 350, desc: "โปสเตอร์สะสมหายาก" },
    { id: 5, name: "เทป Classic", price: 250, desc: "เทปเพลงคลาสสิค" },
  ];

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <div className="p-20 text-center">ไม่พบสินค้า</div>;
  }

  // ฟังก์ชันเพิ่ม/ลดจำนวน
  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity, // ส่งจำนวนที่เลือกไป
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleBuyNow = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity, // ใช้จำนวนที่เลือก
      checked: true,
    };

    addToCart(productData);
    navigate("/checkout", {
      state: { product: productData },
    });
  };

  return (
    <div className="bg-[#e9eff3] font-prompt min-h-screen relative">
      <div className="px-24 py-16 flex gap-16">
        {/* IMAGE */}
        <div className="w-1/2 h-[450px] bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 text-2xl overflow-hidden">
           {/* ใส่ <img src={product.image} ... /> ตรงนี้ได้เลย */}
           IMAGE
        </div>

        {/* DETAILS */}
        <div className="w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>

          <p className="text-3xl text-[#f28c45] font-bold mb-6">
            ฿{product.price.toLocaleString()}
          </p>

          <p className="mb-8 text-gray-600 leading-relaxed text-lg">{product.desc}</p>

          {/* 2. ส่วนเลือกจำนวน (Quantity Selector) */}
          <div className="mb-8">
            <p className="text-gray-500 mb-3 font-medium">จำนวน</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-300 rounded-2xl bg-white overflow-hidden w-fit">
                <button 
                  onClick={decrement}
                  className="px-5 py-2 hover:bg-gray-100 transition active:bg-gray-200 font-bold text-xl"
                >
                  −
                </button>
                <div className="px-6 py-2 font-semibold text-lg border-x-2 border-gray-100 min-w-[60px] text-center">
                  {quantity}
                </div>
                <button 
                  onClick={increment}
                  className="px-5 py-2 hover:bg-gray-100 transition active:bg-gray-200 font-bold text-xl text-[#f28c45]"
                >
                  +
                </button>
              </div>
              <span className="text-gray-400 text-sm">มีสินค้าพร้อมส่ง</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-gray-800 text-white px-10 py-4 rounded-2xl hover:bg-gray-700 hover:scale-105 active:scale-95 transition duration-300 font-bold flex-1"
            >
              เพิ่มลงตะกร้า
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-orange-500 text-white px-10 py-4 rounded-2xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition duration-300 font-bold flex-1 shadow-lg shadow-orange-200"
            >
              สั่งซื้อเลย
            </button>
          </div>
        </div>
      </div>

      {/* Toast แจ้งเตือน */}
      {showToast && (
        <div className="fixed bottom-10 right-10 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center gap-3">
          <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">✓</div>
          เพิ่มลงตะกร้าจำนวน {quantity} ชิ้นแล้ว
        </div>
      )}
    </div>
  );
}