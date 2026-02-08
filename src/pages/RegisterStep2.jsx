import { useNavigate } from "react-router-dom";

function RegisterStep2() {
  const navigate = useNavigate();

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-[#f9f1ef] border border-[#faa268] focus:outline-none focus:ring-2 focus:ring-[#f99146]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#de490a]">
      <div className="w-full max-w-lg bg-[#f6d5cd] rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Address Information
        </h2>

        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className={inputStyle} />

          <input
            type="text"
            placeholder="House No. / Building / Village"
            className={inputStyle}
          />

          <input
            type="text"
            placeholder="Street / Sub-district"
            className={inputStyle}
          />

          <input type="text" placeholder="Province" className={inputStyle} />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="District" className={inputStyle} />
            <input
              type="text"
              placeholder="Postal Code"
              className={inputStyle}
            />
          </div>
        </div>

        <button className="w-full mt-8 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition">
          Confirm
        </button>

        <button
          onClick={() => navigate("/register/step1")}
          className="w-full mt-3 text-sm text-gray-800 underline"
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default RegisterStep2;
