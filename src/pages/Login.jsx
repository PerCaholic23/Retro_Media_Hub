// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Logo from "../image/LogoText.png";   // 👈 เพิ่มบรรทัดนี้

// function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const [modal, setModal] = useState({
//     show: false,
//     message: "",
//     type: "error",
//   });

//   const inputStyle =
//     "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

//   const showModal = (message, type = "error") => {
//     setModal({ show: true, message, type });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       showModal("กรุณากรอกข้อมูลให้ครบ", "error");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:5000/api/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));

//       showModal("เข้าสู่ระบบสำเร็จ", "success");

//       setTimeout(() => {
//         navigate("/home");
//       }, 1200);

//     } catch (error) {
//       showModal(
//         error.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
//         "error"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#de490a] relative">
//       <div className="w-full max-w-md bg-[#f6d5cd] rounded-3xl shadow-xl p-8">

//         {/* ===== โลโก้ ===== */}
//         <div className="flex justify-center mb-6">
//           <img
//             src={Logo}
//             alt="Logo"
//             className="h-20 object-contain"   // 👈 ปรับขนาดได้ที่นี่
//           />
//         </div>

//         <h2 className="text-2xl font-bold text-center mb-6">
//           เข้าสู่ระบบ
//         </h2>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
//             type="text"
//             placeholder="อีเมล"
//             className={inputStyle}
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           {/* ช่องรหัสผ่าน */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="รหัสผ่าน"
//               className={inputStyle + " pr-12"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f99146] hover:text-[#f47f2a] transition text-sm"
//             >
//               {showPassword ? (
//   /* ไอคอนตอนเปิดตา */
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
// ) : (
//   /* ไอคอนตอนปิดตา (มีเส้นขีดฆ่า) */
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
// )}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-6 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
//           >
//             เข้าสู่ระบบ
//           </button>
//         </form>

//         <div className="text-center text-sm text-gray-700 mt-6">
//           ยังไม่มีบัญชีใช่ไหม?{" "}
//           <span
//             onClick={() => navigate("/register/step1")}
//             className="font-medium cursor-pointer underline"
//           >
//             สมัครสมาชิก
//           </span>
//         </div>
//       </div>

//       {/* MODAL */}
//       {modal.show && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white w-[380px] p-8 rounded-2xl relative text-center">

//             <button
//               onClick={() => setModal({ ...modal, show: false })}
//               className="absolute top-3 right-4 text-gray-400 text-xl"
//             >
//               ✕
//             </button>

//             <h2
//               className={`text-2xl font-semibold mb-4 ${
//                 modal.type === "success"
//                   ? "text-green-500"
//                   : "text-red-500"
//               }`}
//             >
//               {modal.type === "success" ? "สำเร็จ" : "เกิดข้อผิดพลาด"}
//             </h2>

//             <p className="text-gray-600">
//               {modal.message}
//             </p>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import Logo from "../image/LogoText.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      Swal.fire({
        title: 'เข้าสู่ระบบสำเร็จ !',
        icon: 'success',
        timer: 1300,
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/home"), 1300);
    } catch (error) {
      Swal.fire({
        title: 'เข้าสู่ระบบไม่สำเร็จ !',
        text: error.response?.data?.message || "ข้อมูลไม่ถูกต้อง",
        icon: 'error',
        confirmButtonColor: '#de490a',
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
          .font-compact { font-family: 'Prompt', sans-serif !important; }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center bg-[#de490a] font-compact p-6">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#f99146_0%,_#de490a_100%)] opacity-40"></div>

        {/* --- กรอบเล็กลง (max-w-[380px]) --- */}
        <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-9 relative z-10 border border-white/10">
          
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Logo" className="h-16 drop-shadow-sm" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#2d1a18] tracking-tight">เข้าสู่ระบบ</h2>
            <div className="h-1 w-10 bg-[#f99146] mx-auto mt-2 rounded-full"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#4a2c2a] uppercase tracking-widest ml-1">อีเมล</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-2 py-2 bg-transparent border-b-2 border-[#f6d5cd] focus:border-[#de490a] outline-none transition-all text-[#2d1a18] font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#4a2c2a] uppercase tracking-widest ml-1">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-2 py-2 bg-transparent border-b-2 border-[#f6d5cd] focus:border-[#de490a] outline-none transition-all text-[#2d1a18] font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#de490a] p-2"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.303 4.5 12 4.5c4.697 0 8.601 3.549 9.964 7.178.07.185.07.392 0 .577-1.363 3.629-5.267 7.178-9.964 7.178-4.697 0-8.601-3.549-9.964-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <label className="flex items-center cursor-pointer text-[#4a2c2a] font-medium">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[#de490a] mr-2" />
                จดจำฉัน
              </label>
              <button type="button" className="text-[#de490a] font-bold hover:underline">ลืมรหัสผ่าน?</button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg
                ${isLoading ? 'bg-gray-300' : 'bg-[#de490a] hover:bg-[#2d1a18] text-white active:scale-95 shadow-orange-900/20'}`}
            >
              {isLoading ? "Loading..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-[13px] text-gray-400">
              ยังไม่มีบัญชี?{" "}
              <span
                onClick={() => navigate("/register/step1")}
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