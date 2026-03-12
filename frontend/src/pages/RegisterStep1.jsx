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

  const [modal, setModal] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const inputStyle =
    "w-full px-4 py-3 pr-12 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const showModal = (message, type = "error") => {
    setModal({ show: true, message, type });
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
      showModal("กรอกข้อมูลให้ครบก่อนนะ");
      return;
    }

    if (password.length < 6) {
      showModal("รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      showModal("รหัสผ่านไม่ตรงกัน");
      return;
    }

    navigate("/register/step2", {
      state: formData,
    });
  };

  return (
    <>
      <style>
        {`
        @keyframes waveMove{
          0%{
            background-position:100% 50%;
          }
          100%{
            background-position:0% 50%;
          }
        }

        .music-wave{
          background: linear-gradient(
            120deg,
            #fdaa23,
#fc980d,
            #ff7a18,
            #de490a,
            #8f2e04
          );

          background-size:600% 600%;
          animation:waveMove 8s linear infinite;
          animation-direction:alternate;
        }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center music-wave relative">

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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f99146] text-sm"
              >
                {showPassword ? "ซ่อน" : "แสดง"}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f99146] text-sm"
              >
                {showConfirm ? "ซ่อน" : "แสดง"}
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

        {/* MODAL */}
        {modal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[360px] p-8 rounded-2xl relative text-center">

              <button
                onClick={() => setModal({ ...modal, show: false })}
                className="absolute top-3 right-4 text-gray-400 text-xl"
              >
                ×
              </button>

              <h2 className="text-xl font-semibold text-red-500 mb-4">
                เกิดข้อผิดพลาด
              </h2>

              <p className="text-gray-600">
                {modal.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RegisterStep1;