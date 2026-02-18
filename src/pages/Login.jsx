import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const handleLogin = async () => {
    if (!email || !password) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        {
          email: email,
          password: password,
        }
      );

      // เก็บ token
      localStorage.setItem("token", res.data.token);

      alert(res.data.message);

      navigate("/home");

    } catch (error) {
      console.log("Login Error:", error.response?.data);
      alert(error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a]">
      <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
            โลโก้
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          เข้าสู่ระบบ
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="อีเมล"
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
        >
          เข้าสู่ระบบ
        </button>

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
    </div>
  );
}

export default Login;
