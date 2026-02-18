require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

/* ===========================
   MIDDLEWARE
=========================== */

// 🔐 จำกัด CORS (กันคนยิงมั่วจากที่อื่น)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend ของคุณ
    credentials: true,
  })
);

app.use(express.json());

/* ===========================
   ROUTES
=========================== */

app.use("/api", authRoutes);

// health check route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ===========================
   START SERVER
=========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
