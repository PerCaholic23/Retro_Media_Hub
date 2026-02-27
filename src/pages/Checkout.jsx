import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const directProduct = location.state?.product || null;

  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [loading, setLoading] = useState(true);

  const [showQRModal, setShowQRModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAddress(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= HANDLE ORDER ================= */
  const handleOrder = async () => {
    if (itemsToCheckout.length === 0) {
      alert("ไม่มีสินค้าในรายการ");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: itemsToCheckout,
          paymentMethod,
          shippingFee,
          total,
        }),
      });

      if (res.ok) {
        clearCart();

        if (paymentMethod === "qr") {
          setShowQRModal(true);
        } else {
          setShowSuccessModal(true);
        }
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="px-24 py-10 pb-40 space-y-8">

      {/* ================= รายการสินค้า ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-md space-y-6">
        {itemsToCheckout.map((item) => (
          <div key={item.id}
            className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-300 rounded-xl flex items-center justify-center text-white">
                IMG
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.artist}</p>
              </div>
            </div>
            <p className="font-semibold">
              ฿{item.price * (item.quantity || 1)}
            </p>
          </div>
        ))}
      </div>

      {/* ================= ที่อยู่ ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-md">
        <h2 className="font-semibold mb-4 text-lg text-orange-500">
          📍 ที่อยู่ในการจัดส่ง
        </h2>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : address ? (
          <>
            <p className="font-medium">
              {address.fullName} {address.phone}
            </p>
            <p className="text-gray-500">
              {address.house} {address.road} {address.subdistrict}{" "}
              {address.district} {address.province} {address.postalCode}
            </p>
          </>
        ) : (
          <p className="text-red-500">ไม่พบข้อมูลที่อยู่</p>
        )}
      </div>

      {/* ================= วิธีชำระเงิน ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-md">
        <h2 className="font-semibold mb-4 text-lg">
          วิธีการชำระเงิน
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => setPaymentMethod("qr")}
            className={`px-6 py-3 rounded-xl border ${
              paymentMethod === "qr"
                ? "bg-orange-400 text-white"
                : "bg-white"
            }`}
          >
            QR พร้อมเพย์
          </button>

          <button
            onClick={() => setPaymentMethod("cod")}
            className={`px-6 py-3 rounded-xl border ${
              paymentMethod === "cod"
                ? "bg-orange-400 text-white"
                : "bg-white"
            }`}
          >
            เก็บเงินปลายทาง
          </button>
        </div>
      </div>

      {/* ================= Sticky Bottom ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-24 py-5 flex justify-between items-center">
        <div className="space-y-1 text-gray-600">
          <p>รวมสินค้า: ฿{subtotal}</p>
          <p>ค่าจัดส่ง: ฿{shippingFee}</p>
          <p className="text-lg font-bold text-orange-500">
            ยอดรวม: ฿{total}
          </p>
        </div>

        <button
          onClick={handleOrder}
          className="bg-[#f28c45] text-white px-10 py-4 rounded-2xl hover:scale-105 transition"
        >
          สั่งสินค้า
        </button>
      </div>

      {/* ================= QR MODAL ================= */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-8 rounded-2xl relative text-center">
            <button
              onClick={() => {
                setShowQRModal(false);
                navigate("/home");
              }}
              className="absolute top-3 right-4 text-gray-400 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6">
              กรุณาชำระเงินผ่าน QR
            </h2>

            {/* อนาคตเปลี่ยนเป็น QR ร้าน */}
            <div className="w-60 h-60 bg-gray-300 mx-auto rounded-xl flex items-center justify-center">
              QR IMAGE
            </div>

            <p className="mt-4 text-gray-500">
              สแกนเพื่อชำระเงิน ฿{total}
            </p>
          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-8 rounded-2xl relative text-center">
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/home");
              }}
              className="absolute top-3 right-4 text-gray-400 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-green-500 mb-4">
              🎉 สั่งซื้อสำเร็จ
            </h2>

            <p className="text-gray-600">
              ขอบคุณสำหรับการสั่งซื้อ
            </p>
          </div>
        </div>
      )}

    </div>
  );
}