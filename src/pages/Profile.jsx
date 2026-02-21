import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Profile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/profile/${storedUser.id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log("Profile error:", err));
  }, [navigate]);

  return (
    <div className="bg-[#e9eff3] min-h-screen font-prompt">
      
      {/* ✅ ใช้ Navbar แทน nav เก่า */}
     

      {/* PROFILE CONTENT */}
      <div className="p-20">
        <div className="bg-white rounded-3xl border-2 border-black p-12 shadow-lg">

          <h2 className="text-3xl font-bold mb-2">ข้อมูลของฉัน</h2>
          <p className="text-gray-500 mb-6">
            จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้
          </p>
          <hr className="mb-10" />

          <div className="grid grid-cols-2 gap-10">

            {/* LEFT */}
            <div className="space-y-6">
              <Input label="ชื่อผู้ใช้" value={user.username} />
              <Input label="ชื่อ" value={user.fullName} />
              <Input label="อีเมล" value={user.email} />
              <Input label="เบอร์มือถือ" value={user.phone} />

              <button className="border-2 border-black px-6 py-3 rounded-xl hover:bg-gray-100">
                แก้ไข QR พร้อมเพย์
              </button>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Input label="บ้านเลขที่" value={user.house} />
              <Input label="ถนน" value={user.road} />
              <Input label="ตำบล" value={user.subdistrict} />
              <Input label="อำเภอ" value={user.district} />
              <Input label="จังหวัด" value={user.province} />
              <Input label="รหัสไปรษณีย์" value={user.postalCode} />
            </div>

          </div>

          <div className="flex justify-center mt-10">
            <button className="bg-orange-400 text-white px-10 py-3 rounded-xl shadow-md hover:scale-105 transition">
              ยืนยัน
            </button>
          </div>   
        </div>
      </div>
     

    </div>
  );
}

function Input({ label, value }) {
  return (
    <div>
      <label className="block text-gray-600 mb-1">{label}</label>
      <input
        value={value || ""}
        readOnly
        className="w-full bg-gray-100 rounded-xl px-4 py-3 border"
      />
    </div>
  );
}