import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterStep1() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData({
        ...formData,
        phone: value.replace(/[^0-9]/g, ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNext = () => {
    const { username, email, phone, password, confirmPassword } = formData;

    if (!username || !email || !phone || !password || !confirmPassword) {
      alert("กรอกข้อมูลให้ครบก่อนนะ");
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    navigate("/register/step2", {
      state: formData,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a]">
      <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          สมัครสมาชิก
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="ชื่อผู้ใช้"
            className={inputStyle}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            className={inputStyle}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.phone}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            className={inputStyle}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="ยืนยันรหัสผ่าน"
            className={inputStyle}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-6 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
        >
          ถัดไป
        </button>

        <p className="text-center text-sm text-gray-700 mt-6">
          มีบัญชีอยู่แล้ว?{" "}
          <span
            onClick={() => navigate("/")}
            className="font-medium cursor-pointer underline"
          >
            เข้าสู่ระบบ
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterStep1;
