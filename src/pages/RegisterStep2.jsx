import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const step1Data = location.state;

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    street: "",
    province: "",
    district: "",
    postalCode: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 2500);
  };

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
      showToast("ข้อมูลหาย กรุณากรอกใหม่");
      setTimeout(() => navigate("/register/step1"), 1200);
      return;
    }

    const allData = { ...step1Data, ...formData };

    try {
      await axios.post("http://localhost:5000/api/register", allData);

      showToast("สมัครสมาชิกสำเร็จ 🎉", "success");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      showToast("สมัครไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a] relative">
      <div className="w-full max-w-lg bg-[#f6d5cd] rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          ข้อมูลที่อยู่
        </h2>

        <div className="space-y-4">
          <input name="fullName" placeholder="ชื่อ-นามสกุล" onChange={handleChange} className={inputStyle} />
          <input name="address" placeholder="บ้านเลขที่ / อาคาร" onChange={handleChange} className={inputStyle} />
          <input name="street" placeholder="ถนน / ตำบล" onChange={handleChange} className={inputStyle} />
          <input name="province" placeholder="จังหวัด" onChange={handleChange} className={inputStyle} />

          <div className="grid grid-cols-2 gap-4">
            <input name="district" placeholder="อำเภอ / เขต" onChange={handleChange} className={inputStyle} />
            <input
              name="postalCode"
              placeholder="รหัสไปรษณีย์"
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
          onClick={() =>
            navigate("/register/step1", {
              state: step1Data,
            })
          }
          className="w-full mt-3 text-sm text-gray-800 underline"
        >
          ← ย้อนกลับ
        </button>
      </div>

      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg text-white
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default RegisterStep2;