import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();

  // ข้อมูลจาก step1
  const step1Data = location.state;

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    street: "",
    province: "",
    district: "",
    postalCode: "",
  });

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "postalCode") {
      setFormData({
        ...formData,
        postalCode: value.replace(/[^0-9]/g, ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!step1Data) {
      alert("ข้อมูลหาย กรุณากรอกใหม่");
      navigate("/register/step1");
      return;
    }

    const allData = {
      ...step1Data,
      ...formData,
    };

    try {
      await axios.post("http://localhost:5000/api/register", allData);

      alert("สมัครสมาชิกสำเร็จ 🎉");
      navigate("/");
    } catch (err) {
      alert("สมัครไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a]">
      <div className="w-full max-w-lg bg-[#f6d5cd] rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          ข้อมูลที่อยู่
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="ชื่อ-นามสกุล"
            className={inputStyle}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="บ้านเลขที่ / อาคาร / หมู่บ้าน"
            className={inputStyle}
            onChange={handleChange}
          />

          <input
            type="text"
            name="street"
            placeholder="ถนน / ตำบล"
            className={inputStyle}
            onChange={handleChange}
          />

          <input
            type="text"
            name="province"
            placeholder="จังหวัด"
            className={inputStyle}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="district"
              placeholder="อำเภอ / เขต"
              className={inputStyle}
              onChange={handleChange}
            />

            <input
              type="text"
              name="postalCode"
              placeholder="รหัสไปรษณีย์"
              inputMode="numeric"
              maxLength={5}
              value={formData.postalCode}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
        >
          ยืนยันข้อมูล
        </button>

        <button
          onClick={() => navigate("/register/step1")}
          className="w-full mt-3 text-sm text-gray-800 underline"
        >
          ← ย้อนกลับ
        </button>
      </div>
    </div>
  );
}

export default RegisterStep2;
