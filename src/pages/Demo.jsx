import { useNavigate } from "react-router-dom";
import axios from "axios";


function Demo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-8">
          Demo Pages
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register/step1")}
            className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            Register Step 1
          </button>

          <button
            onClick={() => navigate("/register/step2")}
            className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition"
          >
            Register Step 2
          </button>
        </div>
      </div>
    </div>
  );
}

export default Demo;
