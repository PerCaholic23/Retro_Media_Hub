import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    soy: "",
    street: "",
    province: "",
    district: "",
    postalCode: "",
    promptpayQR: ""
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); 
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      navigate("/");
      return;
    }
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/profile/${storedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        showToast("ไม่สามารถดึงข้อมูลโปรไฟล์ได้", "error");
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, promptpayQR: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ===== แก้ไขส่วนบันทึกข้อมูลและกลับหน้า Home =====
  const handleSave = async () => {
    if (!user.fullName || !user.email || !user.phone || !user.address || !user.street || !user.province || !user.district || !user.postalCode) {
      showToast("กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }
    // ... (ส่วนการตรวจสอบ Regex เหมือนเดิม)
    
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      
      await axios.put(`http://localhost:5000/api/profile/${storedUser.id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("บันทึกข้อมูลสำเร็จ", "success");
      
      // หน่วงเวลา 1.5 วินาทีเพื่อให้เห็น Toast แล้วค่อยไปหน้า Home
      setTimeout(() => {
        navigate("/home"); 
      }, 1500);

    } catch (err) {
      showToast(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
    }
  };

  return (
    <div className="bg-[#e9eff3] min-h-screen font-prompt p-10 md:p-20 relative">
      <div className="bg-white rounded-3xl border-2 border-black p-8 md:p-12 shadow-lg max-w-6xl mx-auto relative overflow-hidden">
        
        {/* ===== เพิ่มปุ่มปิด/ย้อนกลับที่มุมขวาบน ===== */}
        <button 
          onClick={() => navigate("/home")}
          className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold mb-2 text-gray-800">ข้อมูลของฉัน</h2>
        <p className="text-gray-500 mb-6">จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้</p>
        <hr className="mb-10 border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-20">
          {/* LEFT SIDE: ข้อมูลทั่วไป */}
          <div className="space-y-6">
            <Input label="ชื่อผู้ใช้" name="username" value={user.username} onChange={handleChange} readOnly />
            <Input label="ชื่อ-นามสกุล" name="fullName" value={user.fullName} onChange={handleChange} />
            <Input label="อีเมล" name="email" value={user.email} onChange={handleChange} />
            <Input label="เบอร์มือถือ" name="phone" value={user.phone} onChange={handleChange} />

            <div className="pt-4">
              <label className="block text-gray-600 mb-2 font-medium text-sm">QR พร้อมเพย์ (สำหรับรับชำระเงิน)</label>
              <div className="mb-4">
                {user.promptpayQR ? (
                  <img src={user.promptpayQR} alt="QR" className="w-40 h-40 object-contain border-2 border-gray-200 rounded-xl bg-white shadow-sm" />
                ) : (
                  <div className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">ไม่มีรูป QR Code</div>
                )}
              </div>
              <label className="cursor-pointer border-2 border-black px-5 py-2 rounded-xl hover:bg-black hover:text-white inline-block transition-all font-medium text-sm">
                {user.promptpayQR ? "แก้ไข QR" : "เพิ่ม QR"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* RIGHT SIDE: ข้อมูลที่อยู่ */}
          <div className="space-y-6">
            <Input label="บ้านเลขที่ / อาคาร" name="address" value={user.address} onChange={handleChange} />
            <Input label="หมู่ / ซอย" name="soy" value={user.soy} onChange={handleChange} />
            <Input label="ถนน / ตำบล" name="street" value={user.street} onChange={handleChange} />
            <Input label="จังหวัด" name="province" value={user.province} onChange={handleChange} />
            <Input label="อำเภอ / เขต" name="district" value={user.district} onChange={handleChange} />
            <Input label="รหัสไปรษณีย์" name="postalCode" value={user.postalCode} onChange={handleChange} />
          </div>
        </div>

        {/* ปุ่มกึ่งกลาง: ยืนยัน */}
        <div className="flex justify-center mt-4">
          <button onClick={handleSave} className="bg-[#f28c45] text-white px-20 py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all font-bold">
            บันทึกข้อมูล
          </button>
        </div>

        {/* ===== ปุ่มออกจากระบบ (ขวาล่าง) ===== */}
        <div className="absolute bottom-12 right-8">
          <button 
            onClick={handleLogout}
            className="text-red-500 font-bold border-2 border-red-500 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 shadow-sm"
          >
            <span>ออกจากระบบ</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-8 py-4 rounded-2xl shadow-2xl text-white font-medium z-50 transition-all ${toast.type === "success" ? "bg-green-500" : "bg-red-500 animate-bounce"}`}>
          {toast.type === "success" ? "✅ " : "❌ "}
          {toast.message}
        </div>
      )}
    </div>
  );
}
// วางต่อท้ายไฟล์ Profile.jsx (ข้างล่างสุด นอก export default function Profile)

function Input({ label, name, value, onChange, readOnly = false }) {
  return (
    <div className="group">
      <label className="block text-gray-600 mb-1.5 text-xs font-medium group-focus-within:text-orange-400 transition-colors">
        {label}
      </label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full rounded-2xl px-5 py-3 border border-gray-200 outline-none transition-all ${
          readOnly 
            ? "bg-gray-100 text-gray-500" 
            : "bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-50 shadow-sm"
        }`}
      />
    </div>
  );
}
