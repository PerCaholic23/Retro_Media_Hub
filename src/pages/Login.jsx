import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("กรุณากรอกข้อมูลให้ครบ", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      showToast("เข้าสู่ระบบสำเร็จ ✅", "success");

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (error) {
      showToast(
        error.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a] relative">
      <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
            โลโก้
          </div>
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

          {/* ช่องรหัสผ่าน + ไอคอนลูกตา */}
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f99146] hover:text-[#f47f2a] transition"
            >
              {showPassword ? (
                /* 👁️ เปิดตา */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M1.5 12s3.75-7.5 10.5-7.5S22.5 12 22.5 12 18.75 19.5 12 19.5 1.5 12 1.5 12z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                /* 🙈 ปิดตา */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M10.73 5.08A10.94 10.94 0 0112 4.5c6.75 0 10.5 7.5 10.5 7.5a15.72 15.72 0 01-4.21 5.16M6.53 6.53A15.75 15.75 0 001.5 12s3.75 7.5 10.5 7.5c1.61 0 3.08-.36 4.4-1"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="text-center text-sm text-gray-700 mt-6 space-y-2">
          <p>
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <span
              onClick={() => navigate("/register/step1")}
              className="font-medium cursor-pointer underline"
            >
              สมัครสมาชิก
            </span>
          </p>
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

export default Login;