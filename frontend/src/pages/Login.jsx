import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Logo from "../image/LogoText.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL;
  console.log("API Login.jsx", API);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API}/api/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ !",
        icon: "success",
        timer: 1300,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/home"), 1300);
    } catch (error) {
      Swal.fire({
        title: "เข้าสู่ระบบไม่สำเร็จ !",
        text: error.response?.data?.message || "ข้อมูลไม่ถูกต้อง",
        icon: "error",
        confirmButtonColor: "#de490a",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');

        .font-compact{
          font-family:'Prompt',sans-serif!important;
        }

        input::-ms-reveal,
        input::-ms-clear{
          display:none;
        }

        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button{
          display:none!important;
        }

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

          background-size:400% 400%;
          animation:waveMove 5s linear infinite;
          animation-direction:alternate;
        }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center font-compact p-6 relative overflow-hidden music-wave">

        <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-9 relative z-10 border border-white/10">

          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Logo" className="h-16 drop-shadow-sm"/>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#2d1a18] tracking-tight">
              เข้าสู่ระบบ
            </h2>
            <div className="h-1 w-10 bg-[#f99146] mx-auto mt-2 rounded-full"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#4a2c2a] uppercase tracking-widest ml-1">
                อีเมล
              </label>

              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-2 py-2 bg-transparent border-b-2 border-[#f6d5cd] focus:border-[#de490a] outline-none transition-all text-[#2d1a18] font-medium"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#4a2c2a] uppercase tracking-widest ml-1">
                รหัสผ่าน
              </label>

              <div className="relative flex items-center">

                <input
                  type={showPassword ? "text":"password"}
                  placeholder="••••••••"
                  className="w-full px-2 py-2 bg-transparent border-b-2 border-[#f6d5cd] focus:border-[#de490a] outline-none transition-all text-[#2d1a18] font-medium pr-10"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#de490a] p-2 hover:opacity-70 transition-opacity flex items-center justify-center"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.303 4.5 12 4.5c4.697 0 8.601 3.549 9.964 7.178.07.185.07.392 0 .577-1.363 3.629-5.267 7.178-9.964 7.178-4.697 0-8.601-3.549-9.964-7.178z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  )}
                </button>

              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg
              ${
                isLoading
                ? "bg-gray-300"
                : "bg-[#de490a] hover:bg-[#2d1a18] text-white active:scale-95 shadow-orange-900/20"
              }`}
            >
              {isLoading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
            </button>

          </form>

          <div className="text-center mt-8">
            <p className="text-[13px] text-gray-400">
              ยังไม่มีบัญชี?{" "}
              <span
                onClick={()=>navigate("/register/step1")}
                className="text-[#de490a] font-bold cursor-pointer hover:underline ml-1"
              >
                สมัครสมาชิก
              </span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;