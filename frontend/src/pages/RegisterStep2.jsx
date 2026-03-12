import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const step1Data = location.state;

  const API = process.env.REACT_APP_API_URL;
  console.log("API RegisterStep2.jsx ", API);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    street: "",
    province: "",
    district: "",
    postalCode: "",
  });

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
      showModal("ข้อมูลหาย กรุณากรอกใหม่");
      setTimeout(() => navigate("/register/step1"), 1200);
      return;
    }

    const allData = { ...step1Data, ...formData };

    try {
      await axios.post(`${API}/api/register`, allData);

      showModal("สมัครสมาชิกสำเร็จ", "success");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      showModal("สมัครไม่สำเร็จ");
    }
  };

  return (
    <>
      <style>
        {`
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

          background-size:600% 600%;
          animation:waveMove 8s linear infinite;
          animation-direction:alternate;
        }
        `}
      </style>

      <div className="min-h-screen flex items-center justify-center music-wave relative">

        <div className="w-full max-w-lg bg-[#f6d5cd] rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            ข้อมูลที่อยู่
          </h2>

          <div className="space-y-4">
            <input
              name="fullName"
              placeholder="ชื่อ-นามสกุล"
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              name="address"
              placeholder="บ้านเลขที่ / อาคาร"
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              name="soy"
              placeholder="หมู่ / ซอย"
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              name="street"
              placeholder="ถนน / ตำบล"
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              name="province"
              placeholder="จังหวัด"
              onChange={handleChange}
              className={inputStyle}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="district"
                placeholder="อำเภอ / เขต"
                onChange={handleChange}
                className={inputStyle}
              />

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

        {/* MODAL */}
        {modal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[380px] p-8 rounded-2xl relative text-center">

              <button
                onClick={() => setModal({ ...modal, show: false })}
                className="absolute top-3 right-4 text-gray-400 text-xl"
              >
                ×
              </button>

              <h2
                className={`text-xl font-semibold mb-4 ${
                  modal.type === "success"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {modal.type === "success"
                  ? "สำเร็จ"
                  : "เกิดข้อผิดพลาด"}
              </h2>

              <p className="text-gray-600">
                {modal.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RegisterStep2;