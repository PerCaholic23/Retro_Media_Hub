import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function RegisterStep1() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: location.state?.username || "",
    email: location.state?.email || "",
    phone: location.state?.phone || "",
    password: location.state?.password || "",
    confirmPassword: location.state?.confirmPassword || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const inputStyle =
    "w-full px-4 py-3 pr-12 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 2500);
  };

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
      showToast("กรอกข้อมูลให้ครบก่อนนะ");
      return;
    }

    if (password.length < 6) {
      showToast("รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      showToast("รหัสผ่านไม่ตรงกัน");
      return;
    }

    navigate("/register/step2", {
      state: formData,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a] relative">
      <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          สมัครสมาชิก
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="ชื่อผู้ใช้"
            value={formData.username}
            onChange={handleChange}
            className={inputStyle.replace("pr-12", "")}
          />

          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            value={formData.email}
            onChange={handleChange}
            className={inputStyle.replace("pr-12", "")}
          />

          <input
            type="text"
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            value={formData.phone}
            onChange={handleChange}
            className={inputStyle.replace("pr-12", "")}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="รหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
              className={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f99146] text-lg"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="ยืนยันรหัสผ่าน"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f99146] text-lg"
            >
              {showConfirm ? "🙈" : "👁"}
            </button>
          </div>
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

      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg text-white
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default RegisterStep1;