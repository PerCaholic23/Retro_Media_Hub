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
          Register
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            className={inputStyle}
          />

          <input
            type="text"
            placeholder="Phone"
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
            placeholder="Password"
            className={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className={inputStyle}
          />
        </div>

        <button
          onClick={() => navigate("/register/step2")}
          className="w-full mt-6 bg-[#f99146] text-white py-3 rounded-xl font-medium hover:bg-[#f47f2a] transition"
        >
          Next
        </button>

        <p className="text-center text-sm text-gray-700 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="font-medium cursor-pointer underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default RegisterStep1;
