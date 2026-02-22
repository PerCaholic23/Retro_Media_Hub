require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
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
app.use("/api/category", categoryRoutes);
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
/*const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});*/

