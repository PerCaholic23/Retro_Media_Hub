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
          err.response?.data?.message ||
            "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          "error"
        );
      }
    }
  };

  return (
    <div className="bg-[#e9eff3] min-h-screen font-prompt p-10 md:p-20 relative">
      <div className="bg-white rounded-3xl border-2 border-black p-8 md:p-12 shadow-lg max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">ข้อมูลของฉัน</h2>
        <p className="text-gray-500 mb-6">
          จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้
        </p>
        <hr className="mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <Input label="ชื่อผู้ใช้" name="username" value={user.username} onChange={handleChange} readOnly />
            <Input label="ชื่อ-นามสกุล" name="fullName" value={user.fullName} onChange={handleChange} />
            <Input label="อีเมล" name="email" value={user.email} onChange={handleChange} />
            <Input label="เบอร์มือถือ" name="phone" value={user.phone} onChange={handleChange} />

            <div className="pt-4">
              <label className="block text-gray-600 mb-2">QR พร้อมเพย์</label>

              <div className="mb-4">
                {user.promptpayQR ? (
                  <img
                    src={user.promptpayQR}
                    alt="QR"
                    className="w-48 h-48 object-contain border-2 border-gray-200 rounded-xl bg-white"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                    ไม่มีรูป QR Code
                  </div>
                )}
              </div>

              <label className="cursor-pointer border-2 border-black px-6 py-2 rounded-xl hover:bg-gray-100 inline-block transition font-medium">
                {user.promptpayQR ? "แก้ไข QR พร้อมเพย์" : "เพิ่ม QR พร้อมเพย์"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <Input label="บ้านเลขที่" name="address" value={user.address} onChange={handleChange} />
            <Input label="ถนน / ตำบล" name="street" value={user.street} onChange={handleChange} />
            <Input label="จังหวัด" name="province" value={user.province} onChange={handleChange} />
            <Input label="อำเภอ / เขต" name="district" value={user.district} onChange={handleChange} />
            <Input label="รหัสไปรษณีย์" name="postalCode" value={user.postalCode} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={handleSave}
            className="bg-orange-400 text-white px-16 py-3 rounded-xl shadow-md hover:scale-105 transition font-bold text-lg"
          >
            ยืนยัน
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg text-white transition 
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, readOnly = false }) {
  return (
    <div>
      <label className="block text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full rounded-xl px-4 py-3 border border-gray-300 outline-none transition ${
          readOnly
            ? "bg-gray-100 cursor-not-allowed text-gray-500 shadow-inner"
            : "bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        }`}
      />
    </div>
  );
}