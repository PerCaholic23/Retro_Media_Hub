// const dns = require("dns").promises;
// dns.setServers(["1.1.1.1", "1.0.0.1"]);

// const jwt = require("jsonwebtoken");
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const User = require("../models/user");
// const bcrypt = require("bcrypt");

// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// //Handle from register
// app.post("/api/register", async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       phone,
//       password,
//       fullName,
//       address,
//       street,
//       province,
//       district,
//       postalCode
//     } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       username,
//       email,
//       phone,
//       password: hashedPassword,
//       fullName,
//       address,
//       street,
//       province,
//       district,
//       postalCode
//     });

//     await user.save();

//     res.status(201).json({ message: "User created" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. ตรวจสอบว่ามี Email นี้ในระบบไหม
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "ไม่พบอีเมลนี้ในระบบ" });
//     }

//     // 2. ตรวจสอบรหัสผ่าน (เทียบรหัสที่พิมพ์มา กับ รหัสที่ถูก Hash ใน DB)
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
//     }

//     // 3. สร้าง Token (กุญแจยืนยันตัวตน)
//     // ใช้ JWT_SECRET จากไฟล์ .env (ถ้ายังไม่มีให้ไปตั้งใน .env เช่น JWT_SECRET=mysecret)
//     const token = jwt.sign(
//       { id: user._id }, 
//       process.env.JWT_SECRET || "fallback_secret", 
//       { expiresIn: "1d" }
//     );

//     /* ===========================================
//        ✅ นี่คือส่วนที่ส่งกลับไปให้ React (ที่คุณถาม)
//        =========================================== */
//     res.json({
//       message: "เข้าสู่ระบบสำเร็จ",
//       token: token,
//       user: { 
//         id: user._id, 
//         email: user.email,
//         username: user.username // คุณสามารถส่งชื่อไปโชว์ที่หน้าเว็บได้
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.get("/api/category", (req, res) => {
//   res.json([
//     { category_slug: "cd", totalStock: 15 },
//     { category_slug: "vinyl", totalStock: 8 },
//     { category_slug: "cassette", totalStock: 5 },
//     { category_slug: "poster", totalStock: 12 },
//     { category_slug: "tshirt", totalStock: 20 }
//   ]);
// });

// // app.listen...
// // app.listen(5000, () => {
// //   console.log("Server running on port 5000");
// // });
// module.exports = app;