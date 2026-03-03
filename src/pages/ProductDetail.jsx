import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  // 1. เพิ่ม State สำหรับเก็บจำนวนสินค้าที่เลือก
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Error");
        }

        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div class="flex items-center justify-center min-h-screen">
        <div role="status">
          <svg aria-hidden="true" class="inline w-10 h-10 w-8 h-8 text-neutral-tertiary animate-spin fill-brand" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="white" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#f28c45" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
  }

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
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
        </div>

        {/* DETAILS */}
        <div className="w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>

          <p className="text-3xl text-[#f28c45] font-bold mb-6">
            ฿{product.price.toLocaleString()}
          </p>

          <p className="mb-8 text-gray-600 leading-relaxed text-lg">{product.description}</p>

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