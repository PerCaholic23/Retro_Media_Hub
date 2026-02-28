import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../image/LogoText.png";   // 👈 เพิ่มบรรทัดนี้

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [modal, setModal] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const showModal = (message, type = "error") => {
    setModal({ show: true, message, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showModal("กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showModal("เข้าสู่ระบบสำเร็จ", "success");

      setTimeout(() => {
        navigate("/home");
      }, 1200);

    } catch (error) {
      showModal(
        error.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a] relative">
      <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">

        {/* ===== โลโก้ ===== */}
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="h-20 object-contain"   // 👈 ปรับขนาดได้ที่นี่
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="อีเมล"
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* ช่องรหัสผ่าน */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              className={inputStyle + " pr-12"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f99146] hover:text-[#f47f2a] transition text-sm"
            >
              {showPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="text-center text-sm text-gray-700 mt-6">
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <span
            onClick={() => navigate("/register/step1")}
            className="font-medium cursor-pointer underline"
          >
            สมัครสมาชิก
          </span>
        </div>
      </div>

      {/* MODAL */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[380px] p-8 rounded-2xl relative text-center">

            <button
              onClick={() => setModal({ ...modal, show: false })}
              className="absolute top-3 right-4 text-gray-400 text-xl"
            >
              ✕
            </button>

            <h2
              className={`text-2xl font-semibold mb-4 ${
                modal.type === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {modal.type === "success" ? "สำเร็จ" : "เกิดข้อผิดพลาด"}
            </h2>

            <p className="text-gray-600">
              {modal.message}
            </p>

          </div>
        </div>
      )}
    </div>
  );
}

export default Login;