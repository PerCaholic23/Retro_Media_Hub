import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterStep1() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a]">
      <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          สมัครสมาชิก
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            className={inputStyle}
          />

          <input
            type="email"
            placeholder="อีเมล"
            className={inputStyle}
          />

          <input
            type="text"
            placeholder="เบอร์โทรศัพท์"
            inputMode="numeric"
            pattern="[0-9]*"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/[^0-9]/g, ""))
            }
            className={inputStyle}
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className={inputStyle}
          />

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            className={inputStyle}
          />
        </div>

        <button
          onClick={() => navigate("/register/step2")}
          className="w-full mt-6 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
        >
          ถัดไป
        </button>

        <p className="text-center text-sm text-gray-700 mt-6">
          มีบัญชีอยู่แล้ว?{" "}
          <span
            onClick={() => navigate("/login")}
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
