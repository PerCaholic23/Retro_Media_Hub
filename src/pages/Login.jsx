import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a]">
      <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">
        
        {/* โลโก้ */}
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
            placeholder="อีเมล หรือ ชื่อผู้ใช้"
            className={inputStyle}
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className={inputStyle}
          />
        </div>

        <button
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

          <p
            className="cursor-pointer hover:text-black"
            onClick={() => alert("ระบบลืมรหัสผ่านยังไม่ได้เปิดใช้งาน")}
          >
            ลืมรหัสผ่าน?
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
