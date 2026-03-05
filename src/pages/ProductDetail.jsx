import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error");
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

  const nextImage = () => {
    if (!product?.images?.length) return;

    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product?.images?.length) return;

    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg aria-hidden="true" className="w-10 h-10 animate-spin fill-[#f28c45] text-gray-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
      </div>
    );
  }

  if (!product) return <div className="p-20 text-center">ไม่พบสินค้า</div>;

  // ตรวจสอบสถานะสินค้าหมด
  const isOutOfStock = product.stock <= 0;

  // ฟังก์ชันเพิ่ม/ลดจำนวน (คุมไม่ให้เกิน Stock)
  const increment = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0],
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const productData = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      checked: true,
      image: product.images?.[0],
    };
    addToCart(productData);
    navigate("/checkout", { state: { product: productData } });
  };

  return (
    <div className="bg-[#e9eff3] font-prompt min-h-screen relative">
      <div className="px-24 py-16 flex gap-16">
        {/* IMAGE */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6">          
          {/* Main Image Container */}
          <div className="group w-full h-[550px] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden relative">            
            {/* Layer: Fixed Acrylic Base (แผ่นขาวที่อยู่คงที่ ไม่ต้อง Animate เพื่อลดการกระพริบ) */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />

            {product.images && product.images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                  {/* Layer: Background Blur (รูปเบลอที่เปลี่ยนตามรูปจริง) */}
                  <img 
                    src={product.images[currentImage]} 
                    alt="blur background" 
                    className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
                  />
                  
                  {/* Layer: Main Image (รูปคมชัด) */}
                  <img
                    src={product.images[currentImage]}
                    alt={product.name}
                    className="relative z-10 w-full h-full object-contain p-8"
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-gray-400 z-10">ไม่มีรูปภาพ</div>
            )}

            {/* Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-[#f28c45] opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-[#f28c45] opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                >
                  ›
                </button>
              </>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                <span className="bg-black/70 text-white px-8 py-3 rounded-full text-2xl font-bold border-2 border-white">
                  สินค้าหมด
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Section: ปรับให้โชว์รูปทั้งหมดและคลิกเลือกได้ */}
          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide justify-center">
              {product.images?.map((img, index) => (
              <div
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-24 h-24 min-w-[96px] rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden bg-white flex-shrink-0
                  ${currentImage === index 
                    ? "border-[#f28c45] shadow-md scale-105" 
                    : "border-transparent hover:border-gray-200"
                  }`}
              >
                <img 
                  src={img} 
                  alt={`thumbnail-${index}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
          <p className="text-3xl text-[#f28c45] font-bold mb-6">฿{product.price.toLocaleString()}</p>
          <p className="mb-8 text-gray-600 leading-relaxed text-lg">{product.description}</p>

          {/* QUANTITY SELECTOR */}
          <div className="mb-8">
            <p className="text-gray-500 mb-3 font-medium">จำนวนที่ต้องการ</p>
            <div className="flex items-center gap-4">
              <div className={`flex items-center border-2 rounded-2xl bg-white overflow-hidden w-fit ${isOutOfStock ? "opacity-40 border-gray-200" : "border-gray-300"}`}>
                <button
                  onClick={decrement}
                  disabled={isOutOfStock}
                  className="px-5 py-2 hover:bg-gray-100 transition disabled:cursor-not-allowed font-bold text-xl"
                >
                  −
                </button>
                <div className="px-6 py-2 font-semibold text-lg border-x-2 border-gray-100 min-w-[60px] text-center">
                  {isOutOfStock ? 0 : quantity}
                </div>
                <button
                  onClick={increment}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="px-5 py-2 hover:bg-gray-100 transition disabled:cursor-not-allowed font-bold text-xl text-[#f28c45]"
                >
                  +
                </button>
              </div>

              {/* แสดงจำนวนคงเหลือ */}
              <div>
                {isOutOfStock ? (
                  <span className="text-red-500 font-bold animate-pulse text-lg">สินค้าหมดชั่วคราว</span>
                ) : (
                  <span className="text-gray-500">คงเหลือในคลัง: <b className="text-gray-800">{product.stock}</b> ชิ้น</span>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-10 py-4 rounded-2xl font-bold flex-1 transition duration-300 ${isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 active:scale-95"
                }`}
            >
              เพิ่มลงตะกร้า
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`px-10 py-4 rounded-2xl font-bold flex-1 transition duration-300 shadow-lg ${isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border border-gray-300"
                : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-orange-200"
                }`}
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