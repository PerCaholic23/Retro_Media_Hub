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
    soy: "", // เพิ่มฟิลด์ซอย
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.id) {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/api/profile/${storedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleSave = async () => {
    // ===== VALIDATION (เพิ่มตรวจสอบ soy) =====
    if (
      !user.fullName ||
      !user.email ||
      !user.phone ||
      !user.address ||
      !user.street ||
      !user.province ||
      !user.district ||
      !user.postalCode
      // soy ไม่ต้องตรวจสอบก็ได้ (optional) แต่ต้องมีชื่อฟิลด์ส่งไป
    ) {
      showToast("กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }

    // ตรวจสอบ email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      showToast("รูปแบบอีเมลไม่ถูกต้อง", "error");
      return;
    }

    // ตรวจสอบเบอร์โทร (ตัวเลข 10 หลัก)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(user.phone)) {
      showToast("เบอร์โทรต้องเป็นตัวเลข 10 หลัก", "error");
      return;
    }

    // ตรวจสอบรหัสไปรษณีย์ (5 หลัก)
    const postalRegex = /^[0-9]{5}$/;
    if (!postalRegex.test(user.postalCode)) {
      showToast("รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก", "error");
      return;
    }

    // ===== SAVE =====
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!storedUser || !storedUser.id) {
        showToast("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่", "error");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/profile/${storedUser.id}`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("บันทึกข้อมูลสำเร็จ", "success");

    } catch (err) {
      if (!err.response) {
        showToast("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", "error");
      } else {
        showToast(
          err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          "error"
        );
      }
    }
  };

  return (
    <div className="bg-[#e9eff3] min-h-screen font-prompt p-10 md:p-20 relative">
      <div className="bg-white rounded-3xl border-2 border-black p-8 md:p-12 shadow-lg max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">ข้อมูลของฉัน</h2>
        <p className="text-gray-500 mb-6">
          จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้
        </p>
        <hr className="mb-10 border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE: ข้อมูลทั่วไป */}
          <div className="space-y-6">
            <Input label="ชื่อผู้ใช้" name="username" value={user.username} onChange={handleChange} readOnly />
            <Input label="ชื่อ-นามสกุล" name="fullName" value={user.fullName} onChange={handleChange} />
            <Input label="อีเมล" name="email" value={user.email} onChange={handleChange} />
            <Input label="เบอร์มือถือ" name="phone" value={user.phone} onChange={handleChange} />

            <div className="pt-4">
              <label className="block text-gray-600 mb-2 font-medium">QR พร้อมเพย์ (สำหรับรับชำระเงิน)</label>
              <div className="mb-4">
                {user.promptpayQR ? (
                  <img
                    src={user.promptpayQR}
                    alt="QR"
                    className="w-48 h-48 object-contain border-2 border-gray-200 rounded-xl bg-white shadow-sm"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                    ไม่มีรูป QR Code
                  </div>
                )}
              </div>

              <label className="cursor-pointer border-2 border-black px-6 py-2 rounded-xl hover:bg-black hover:text-white inline-block transition-all font-medium">
                {user.promptpayQR ? "แก้ไข QR พร้อมเพย์" : "เพิ่ม QR พร้อมเพย์"}
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

        <div className="flex justify-center mt-12">
          <button
            onClick={handleSave}
            className="bg-[#f28c45] text-white px-20 py-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all font-bold text-l"
          >
            ยืนยัน
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-8 py-4 rounded-2xl shadow-2xl text-white font-medium z-50 transition-all transform scale-100
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500 animate-bounce"}`}
        >
          {toast.type === "success" ? "✅ " : "❌ "}
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, readOnly = false }) {
  return (
    <div className="group">
      <label className="block text-gray-600 mb-1.5 text-sm font-medium group-focus-within:text-orange-400 transition-colors">
        {label}
      </label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={`ระบุ${label}`}
        className={`w-full rounded-2xl px-5 py-3.5 border border-gray-200 outline-none transition-all ${
          readOnly
            ? "bg-gray-100 cursor-not-allowed text-gray-500 shadow-inner border-transparent"
            : "bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-50 shadow-sm"
        }`}
      />
    </div>
  );
}