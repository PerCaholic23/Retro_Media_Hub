import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart, toggleItem, toggleAll } = useCart();
  const navigate = useNavigate();

  // คำนวณเฉพาะสินค้าที่ถูกเลือก
  const selectedItems = cartItems.filter((item) => item.checked);

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("กรุณาเลือกสินค้าก่อนสั่งซื้อ");
      return;
    }

    navigate("/checkout");
  };

  return (
    
    <div className="px-24 py-10">
     
      {/* =========================
         รายการสินค้า
      ========================= */}
      <div className="space-y-6">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg">ยังไม่มีสินค้าในตะกร้า</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-6">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 accent-orange-400"
                />

                <div className="w-20 h-20 bg-gray-300 rounded-xl flex items-center justify-center text-white">
                  IMG
                </div>

                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.artist}</p>
                  <p className="text-sm">จำนวน: {item.quantity}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <p className="font-semibold">
                  ฿{item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================
         สรุปราคา
      ========================= */}
      {cartItems.length > 0 && (
        <>
          <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner px-24 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={
                  cartItems.length > 0 &&
                  cartItems.every((item) => item.checked)
                }
                onChange={toggleAll}
                className="w-5 h-5 accent-orange-400"
              />
              <span>เลือกทั้งหมด</span>
            </div>

            <div className="flex items-center gap-8">
              <p className="text-lg">
                ราคารวม:{" "}
                <span className="font-bold">฿{totalPrice}</span>
              </p>

              <button
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
                className={`px-8 py-3 rounded-2xl shadow transition ${
                  selectedItems.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#f28c45] text-white hover:scale-105"
                }`}
              >
                สั่งสินค้า
              </button>
            </div>
          </div>

          {/* เว้นพื้นที่กัน footer ทับ */}
          <div className="h-24"></div>
        </>
      )}
    </div>
  );
}