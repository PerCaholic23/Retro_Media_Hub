import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // เรียก API ไปยัง Backend Port 5000
        const res = await axios.get("http://localhost:5000/api/order/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Orders received:", res.data); 
        setOrders(res.data);
      } catch (error) {
        console.error("Fetch orders error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-[#f0f4f8] min-h-screen font-prompt p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* ===== HEADER SECTION ===== */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-normal text-gray-800 tracking-tight">
              ประวัติการสั่งซื้อ
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-light">ตรวจสอบรายการที่คุณเคยสั่งซื้อทั้งหมด</p>
          </div>

          <button 
            onClick={() => navigate("/home")}
            className="relative group flex items-center gap-2 px-2 py-1.5 transition-all duration-300"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400 group-hover:text-[#f28c45] group-hover:-translate-x-1 transition-all duration-300" 
              fill="none" viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-base font-normal text-gray-500 group-hover:text-gray-900 transition-colors duration-300">
              กลับหน้าหลัก
            </span>
            <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#f28c45] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-gray-400 animate-pulse">กำลังโหลดข้อมูล...</div>
        ) : orders.length === 0 ? (
          /* เอาเงาออก เหลือแค่เส้นขอบดำบางๆ */
          <div className="bg-white rounded-3xl p-16 text-center border border-black">
            <p className="text-gray-400 text-lg mb-6">คุณยังไม่มีรายการสั่งซื้อ</p>
            <button 
              onClick={() => navigate("/home")} 
              className="text-[#f28c45] font-bold hover:underline transition-all"
            >
              ไปเลือกสินค้าที่น่าสนใจกันเลย!
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              /* --- จุดที่แก้ไข: เอา shadow ออกทั้งหมด และเอา hover:translate ออกเพื่อให้การ์ดอยู่นิ่งๆ แบบสะอาดตา --- */
              <div 
                key={order._id} 
                className="bg-white rounded-[2rem] p-6 md:p-8 border border-black transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase block mb-1">Order ID</span>
                    <span className="text-xs font-mono font-bold bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                      #{order._id.toUpperCase()}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-green-200">
                    {order.paymentMethod === 'cod' ? 'เก็บเงินปลายทาง' : 'สำเร็จ'}
                  </span>
                </div>

                {/* รายการสินค้า */}
                <div className="space-y-5">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group/item">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image || "https://via.placeholder.com/150"} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-2xl border border-gray-100 group-hover/item:border-[#f28c45] transition-colors"
                        />
                        <div>
                          <p className="font-bold text-gray-800 leading-tight mb-0.5">{item.name}</p>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{item.artist}</p>
                          <p className="text-xs text-orange-500 font-bold mt-1">จำนวน x{item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black text-lg text-gray-900">฿{item.price?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase mb-1">วันที่สั่งซื้อ</span>
                    <p className="text-sm font-bold text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('th-TH', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-black mb-1 uppercase">ยอดรวมสุทธิ</p>
                    <p className="text-3xl font-black text-[#f28c45]">฿{order.total?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}