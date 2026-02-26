import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  const products = [
    { id: 1, name: "CD เพลง Rock มือสอง", price: 450, desc: "แผ่น CD มือสอง สภาพดี" },
    { id: 2, name: "เสื้อวง Nirvana วินเทจ", price: 890, desc: "เสื้อวงแท้ ปี 90s" },
    { id: 3, name: "แผ่นเสียง Beatles แท้", price: 1200, desc: "Vinyl แท้จาก UK" },
    { id: 4, name: "โปสเตอร์ศิลปิน Queen", price: 350, desc: "โปสเตอร์สะสมหายาก" },
    { id: 5, name: "เทปคาสเซ็ท Classic", price: 250, desc: "เทปเพลงคลาสสิค" },
  ];

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return <div>ไม่พบสินค้า</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
    });

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div className="bg-[#e9eff3] font-prompt min-h-screen relative">
      <div className="px-24 py-16 flex gap-16">
        <div className="w-1/2 h-96 bg-gray-400 rounded-3xl flex items-center justify-center text-white text-2xl">
          IMAGE
        </div>

        <div className="w-1/2">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <p className="text-2xl text-[#f28c45] font-semibold mb-6">
            ฿{product.price}
          </p>

          <p className="mb-8 text-gray-700">{product.desc}</p>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-gray-800 text-white px-8 py-3 rounded-2xl hover:bg-gray-700 transition duration-300"
            >
              เพิ่มลงตะกร้า
            </button>

            <button
              onClick={() => {
                const productData = {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  checked: true,
                };

                addToCart(productData);

                navigate("/checkout", {
                  state: {
                    product: {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                    },
                  },
                });
              }}
              className="bg-orange-500 text-white px-8 py-3 rounded-2xl hover:bg-orange-600 transition duration-300"
            >
              สั่งสินค้า
            </button>
          </div>
        </div>
      </div>

      {/* Toast แจ้งเตือน */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
          ✅ เพิ่มลงตะกร้าแล้ว
        </div>
      )}
    </div>
  );
}
