import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import platformQR from "../image/platform_qr.png";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const directProduct = location.state?.product || null;

  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sellerQR, setSellerQR] = useState(null);

  const itemsToCheckout = directProduct
    ? [directProduct]
    : cartItems.filter((item) => item.checked);

  const subtotal = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const shippingFee = subtotal > 0 ? 39 : 0;
  const total = subtotal + shippingFee;

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) setAddress(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  /* ================= HANDLE ORDER ================= */
  const handleOrderInitiate = () => {
    if (itemsToCheckout.length === 0) {
      alert("ไม่มีสินค้าในรายการ");
      return;
    }
    setShowConfirmModal(true);
  };

  const processOrder = async () => {
    setShowConfirmModal(false);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: itemsToCheckout,
        }),
      });

      const data = await res.json();

      if (data.qr === "platform") {
        setSellerQR(platformQR);
      } else {
        setSellerQR(data.qr);
      }

      if (!res.ok) {
        alert(data.message || "เกิดข้อผิดพลาด");
        return;
      }

      if (paymentMethod === "cod") {
        clearCart();
        setShowSuccessModal(true);
      } else {
        setShowQRModal(true);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const handleQRPaymentDone = () => {
    clearCart();
    setShowQRModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col px-24 py-10 pb-40 space-y-8 bg-[#f9f9f9]">

      {/* รายการสินค้า */}
      <div className="bg-white rounded-3xl p-6 shadow-md space-y-6">
        {itemsToCheckout.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-300 rounded-xl flex items-center justify-center text-white font-bold">
                <img
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-gray-200"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.artist}</p>
                <p className="text-sm text-gray-400">จำนวน: {item.quantity || 1}</p>
              </div>
            </div>
            <p className="font-semibold text-lg text-gray-800">
              ฿{(item.price * (item.quantity || 1)).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ที่อยู่ในการจัดส่ง */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-l-8 border-orange-400 relative">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-semibold text-lg text-orange-500 italic">📍 ที่อยู่ในการจัดส่ง</h2>


        </div>

        {loading ? (
          <p className="text-gray-400 animate-pulse">กำลังโหลดข้อมูล...</p>
        ) : address ? (
          <div className="space-y-1">
            {/* ดันชื่อไปซ้าย ดันปุ่มไปขวาด้วย flex justify-between */}
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg text-gray-800">
                {address.fullName} <span className="text-gray-300 font-light mx-2">|</span> {address.phone}
              </p>

              <button
                onClick={() => navigate("/profile")}
                className="text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-orange-200 bg-white"
              >
                แก้ไขที่อยู่
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* รายละเอียดที่อยู่เรียงแนวนอน */}
            <p className="text-gray-500 text-base leading-relaxed pr-32"> {/* เพิ่ม pr เพื่อไม่ให้ข้อความยาวไปทับปุ่ม */}
              {[
                address.address,
                address.soy && address.soy !== "-" ? ` ${address.soy}` : null,
                address.street && address.street !== "-" ? ` ${address.street}` : null,
                address.district,
                address.province,
                address.postalCode
              ].filter(Boolean).join(", ")}
            </p>
          </div>
        ) : (
          /* ส่วนกรณีไม่พบที่อยู่คงเดิม */
          <div className="flex justify-between items-center">
            <p className="text-red-500">ไม่พบข้อมูลที่อยู่ กรุณาตั้งค่าที่อยู่ก่อนสั่งซื้อ</p>
            <button onClick={() => navigate("/profile")} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold">ไปที่หน้าตั้งค่า</button>
          </div>
        )}
      </div>

      {/* วิธีชำระเงิน */}
      <div className="bg-white rounded-3xl p-6 shadow-md">
        <h2 className="font-semibold mb-4 text-lg">วิธีการชำระเงิน</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPaymentMethod("qr")}
            className={`px-6 py-3 rounded-xl border transition font-medium ${paymentMethod === "qr" ? "bg-orange-400 text-white border-orange-400" : "bg-white border-gray-200"
              }`}
          >
            QR พร้อมเพย์
          </button>
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`px-6 py-3 rounded-xl border transition font-medium ${paymentMethod === "cod" ? "bg-orange-400 text-white border-orange-400" : "bg-white border-gray-200"
              }`}
          >
            เก็บเงินปลายทาง
          </button>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-24 py-5 flex justify-between items-center z-40">
        <div className="space-y-1 text-gray-600">
          <p className="text-sm">รวมสินค้า: ฿{subtotal.toLocaleString()}</p>
          <p className="text-sm">ค่าจัดส่ง: ฿{shippingFee}</p>
          <p className="text-xl font-bold text-orange-500">ยอดรวม: ฿{total.toLocaleString()}</p>
        </div>
        <button
          onClick={handleOrderInitiate}
          className="bg-[#f28c45] text-white px-10 py-4 rounded-2xl hover:scale-105 transition font-bold shadow-md"
        >
          สั่งสินค้า
        </button>
      </div>

      {/* =========================================
          MODALS AREA (ฉบับแก้ทางแก้ให้เต็มจอแน่นอน)
      ========================================= */}

      {/* 1. ยืนยันการสั่งซื้อ */}
      {showConfirmModal && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center pointer-events-auto">
          {/* พื้นหลังเบลอ - ใช้ fixed ทับอีกชั้นเพื่อให้แน่ใจว่าหลุดจากทุก container */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowConfirmModal(false)}
          ></div>

          {/* กล่องเนื้อหา */}
          <div className="relative bg-white w-[90%] max-w-[380px] p-8 rounded-[2rem] text-center shadow-2xl z-[10000]">
            <h2 className="text-2xl font-bold mb-4">ยืนยันการสั่งซื้อ</h2>
            <p className="text-gray-500 mb-8">คุณต้องการสั่งซื้อสินค้าใช่หรือไม่?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-100 py-3 rounded-xl font-medium text-gray-500">ยกเลิก</button>
              <button onClick={processOrder} className="flex-1 bg-orange-400 py-3 rounded-xl font-medium text-white shadow-lg shadow-orange-200">ยืนยัน</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-lg" onClick={() => setShowQRModal(false)}></div>

          <div className="relative bg-white w-[90%] max-w-[420px] p-8 rounded-[2.5rem] text-center shadow-2xl z-[10000]">
            <button onClick={() => setShowQRModal(false)} className="absolute top-5 right-6 text-gray-400 text-2xl">✕</button>
            <h2 className="text-xl font-semibold mb-6 text-orange-500 italic">สแกนชำระเงิน</h2>
            <div className="w-60 h-60 bg-gray-100 mx-auto rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
              {sellerQR ? (
                <img
                  src={sellerQR}
                  alt="Seller PromptPay QR"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-300">ไม่มี QR ของผู้ขาย</span>
              )}
            </div>
            <p className="text-lg font-bold">ยอดรวม: ฿{total.toLocaleString()}</p>
            <button onClick={handleQRPaymentDone} className="mt-8 w-full bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100">ชำระเงินเรียบร้อยแล้ว</button>
          </div>
        </div>
      )}

      {/* 3. Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md"></div>

          <div className="relative bg-white w-[90%] max-w-[400px] p-10 rounded-[2rem] text-center shadow-2xl z-[10000]">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">✓</div>
            <h2 className="text-2xl font-bold text-green-500 mb-2">สั่งซื้อสำเร็จ</h2>
            <p className="text-gray-500 mb-8">ขอบคุณที่เลือกช้อปกับเรา!</p>
            <button onClick={() => navigate("/home")} className="w-full bg-[#f28c45] text-white py-4 rounded-xl font-bold">กลับหน้าแรก</button>
          </div>
        </div>
      )}

    </div>
  );
}