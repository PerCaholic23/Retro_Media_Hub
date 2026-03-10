import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const { cartItems, removeFromCart, toggleItem, toggleAll, updateQuantity } = useCart();
  const navigate = useNavigate();

  // 1. State สำหรับจัดการ Modal (เลียนแบบสไตล์หน้า Login)
  const [modal, setModal] = useState({
    show: false,
    message: "",
    type: "confirm", // 'confirm' หรือ 'success'
    onConfirm: null,
  });

  const selectedItems = cartItems.filter((item) => item.checked);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ฟังก์ชันสำหรับเปิด Modal
  const openModal = (message, type = "confirm", onConfirm = null) => {
    setModal({ show: true, message, type, onConfirm });
  };

  const handleRemoveClick = (item) => {
    openModal(
      `คุณต้องการลบ "${item.name}" ออกจากตะกร้าใช่หรือไม่?`,
      "confirm",
      () => removeFromCart(item.id)
    );
  };
  // ฟังก์ชันลบสินค้าที่เลือกทั้งหมด
  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) return;

    openModal(
      `คุณต้องการลบสินค้าที่เลือกทั้งหมด ${selectedItems.length} รายการใช่หรือไม่?`,
      "confirm",
      () => {
        // ลบทีละรายการผ่าน removeFromCart
        selectedItems.forEach(item => removeFromCart(item.id));
        // หรือถ้ามีฟังก์ชัน removeMultiple ใน Context ก็เรียกใช้ได้ครับ
      }
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#e9eff3] px-10 md:px-24 py-10 pb-40 relative">
      <h2 className="text-2xl font-bold mb-8">ตะกร้าสินค้า</h2>

      <div className="space-y-6">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg text-center bg-white p-10 rounded-3xl">ยังไม่มีสินค้าในตะกร้า</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-6 ">
                {/*Orange checkbox*/}
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 accent-orange-400"
                />

                {/*Image thumbnail*/}
                <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : "IMG"}
                </div>

                {/*Container storing name, artist and quantity selecter*/}
                <div className="flex items-center gap-6">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <h2 className="text-[#9CB0BF] text-lg">{item.artist}</h2>
                  </div>

                  
                </div>
              </div>

              <div>
              <div className="flex items-center border border-gray-200 rounded-xl w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-50 text-xl"
                    >-</button>
                    <span className="px-4 py-1 font-medium border-x border-gray-200">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-50 text-xl text-orange-500"
                    >+</button>
                  </div>
              </div>

              {/*Container storing price and delete item*/}
              <div className="flex items-center">
                <p className="font-bold text-xl text-orange-600">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => handleRemoveClick(item)}
                  className="ml-[200px] text-gray-400 hover:text-red-500 transition"
                >
                  ลบสินค้า
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* สรุปราคาด้านล่าง */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t px-24 py-5 flex justify-between items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cartItems.length > 0 && cartItems.every((item) => item.checked)}
                onChange={toggleAll}
                className="w-6 h-6 accent-orange-400 cursor-pointer"
              />
              <span className="font-medium">เลือกทั้งหมด</span>
            </div>

            {/* ปุ่มลบสินค้าที่เลือก */}
            <button
              onClick={handleRemoveSelected}
              disabled={selectedItems.length === 0}
              className={`text-sm font-medium transition-colors ${selectedItems.length === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700 underline"
                }`}
            >
              ลบที่เลือก ({selectedItems.length})
            </button>
          </div>

          <div className="flex items-center gap-8">
            <p className="text-xl">
              ราคารวม: <span className="font-bold text-orange-600">฿{totalPrice.toLocaleString()}</span>
            </p>
            <button
              disabled={selectedItems.length === 0}
              onClick={handleCheckout}
              className={`px-10 py-3 rounded-2xl font-bold transition-all transform active:scale-95 ${selectedItems.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#f28c45] text-white hover:bg-[#e07b34] shadow-lg shadow-orange-100"
                }`}
            >
              สั่งสินค้า
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL แจ้งเตือน (สไตล์เดียวกับหน้า Login) ================= */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white w-[400px] p-10 rounded-[2rem] relative text-center shadow-2xl animate-in zoom-in duration-200">

            {/* ปุ่มปิด X */}
            <button
              onClick={() => setModal({ ...modal, show: false })}
              className="absolute top-5 right-6 text-gray-400 text-2xl hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className={`text-2xl font-bold mb-4 ${modal.type === "confirm" ? "text-orange-500" : "text-green-500"}`}>
              {modal.type === "confirm" ? "ยืนยันการทำรายการ" : "สำเร็จ"}
            </h2>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {modal.message}
            </p>

            <div className="flex justify-center gap-4">
              {modal.type === "confirm" && (
                <>
                  <button
                    onClick={() => {
                      modal.onConfirm();
                      setModal({ ...modal, show: false });
                    }}
                    className="bg-[#f28c45] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#e07b34] transition flex-1"
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => setModal({ ...modal, show: false })}
                    className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition flex-1"
                  >
                    ยกเลิก
                  </button>
                </>
              )}
              {modal.type === "success" && (
                <button
                  onClick={() => setModal({ ...modal, show: false })}
                  className="bg-green-500 text-white px-10 py-3 rounded-xl font-medium hover:bg-green-600 transition"
                >
                  ตกลง
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}