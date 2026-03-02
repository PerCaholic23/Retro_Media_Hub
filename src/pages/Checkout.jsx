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
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setAddress(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  /* ================= HANDLE ORDER ================= */
  const handleOrder = () => {
    if (itemsToCheckout.length === 0) {
      alert("ไม่มีสินค้าในรายการ");
      return;
    }

    clearCart();

    if (paymentMethod === "qr") {
      setShowQRModal(true);
    } else {
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-24 py-10 pb-40 space-y-8">

      {/* ================= รายการสินค้า ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-md space-y-6">
        {itemsToCheckout.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-300 rounded-xl flex items-center justify-center text-white">
                IMG
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.artist}</p>
              </div>
            </div>
            <p className="font-semibold text-lg">
              ฿{(item.price * (item.quantity || 1)).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* ================= ที่อยู่ (เพิ่ม Soy เข้าไปแล้ว) ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-l-8 border-orange-400">
        <h2 className="font-semibold mb-4 text-lg text-orange-500">
          📍 ที่อยู่ในการจัดส่ง
        </h2>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : address ? (
          <>
            <p className="font-medium text-lg">
              {address.fullName} {address.phone}
            </p>
            <p className="text-gray-500 leading-relaxed">
              {address.address} 
              {/* ตรวจสอบว่ามีข้อมูลซอย และข้อมูลไม่เป็นเครื่องหมายขีด หรือค่าว่าง */}
              {address.soy && address.soy !== "-" && ` ${address.soy}`} 
              {address.street && address.street !== "-" && ` ${address.street}`} <br />
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
            className={`px-6 py-3 rounded-xl border transition font-medium ${
              paymentMethod === "qr"
                ? "bg-orange-400 text-white border-orange-400"
                : "bg-white border-gray-200"
            }`}
          >
            QR พร้อมเพย์
          </button>

          <button
            onClick={() => setPaymentMethod("cod")}
            className={`px-6 py-3 rounded-xl border transition font-medium ${
              paymentMethod === "cod"
                ? "bg-orange-400 text-white border-orange-400"
                : "bg-white border-gray-200"
            }`}
          >
            เก็บเงินปลายทาง
          </button>
        </div>
      </div>

      {/* ================= Sticky Bottom ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-24 py-5 flex justify-between items-center z-10">
        <div className="space-y-1 text-gray-600">
          <p>รวมสินค้า: ฿{subtotal.toLocaleString()}</p>
          <p>ค่าจัดส่ง: ฿{shippingFee}</p>
          <p className="text-xl font-bold text-orange-500">
            ยอดรวม: ฿{total.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleOrder}
          className="bg-[#f28c45] text-white px-10 py-4 rounded-2xl hover:scale-105 transition font-bold"
        >
          สั่งสินค้า
        </button>
      </div>

      {/* ================= QR MODAL ================= */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] p-8 rounded-3xl relative text-center">
            <button
              onClick={() => {
                setShowQRModal(false);
                navigate("/home");
              }}
              className="absolute top-3 right-4 text-gray-400 text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-6 text-orange-500">
              กรุณาชำระเงินผ่าน QR พร้อมเพย์
            </h2>
            <div className="w-64 h-64 bg-gray-300 mx-auto rounded-2xl flex items-center justify-center text-gray-500 text-lg shadow-inner">
              QR IMAGE
            </div>
            <p className="mt-6 text-gray-600">
              สแกนเพื่อชำระเงิน ฿{total.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-8 rounded-3xl text-center shadow-xl">
            <h2 className="text-2xl font-semibold text-green-500 mb-4">
              สั่งซื้อเสร็จสิ้น
            </h2>
            <p className="text-gray-600 mb-6">
              ระบบได้รับคำสั่งซื้อเรียบร้อยแล้ว
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/home");
              }}
              className="bg-[#f28c45] text-white px-8 py-3 rounded-xl hover:scale-105 transition"
            >
              กลับหน้าแรก
            </button>
          </div>
        </div>
      )}

    </div>
  );
}