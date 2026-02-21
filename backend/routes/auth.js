const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

/* ===========================
   REGISTER
=========================== */
router.post("/register", async (req, res) => {
  try {
    const { username, fullName, email, password, phone } = req.body;

    if (!username || !fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
    }

    // 🔥 เช็ค email ซ้ำ
    const checkSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาด" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
      }

      // 🔐 hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql =
        "INSERT INTO users (username, fullName, email, password, phone) VALUES (?, ?, ?, ?, ?)";

      db.query(
        insertSql,
        [username, fullName, email, hashedPassword, phone],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "เกิดข้อผิดพลาด" });
          }

          res.json({ message: "สมัครสมาชิกสำเร็จ ✅" });
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   LOGIN
=========================== */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not set" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "เข้าสู่ระบบสำเร็จ 🎉",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        
      },
    });
  });
});

/* ===========================
   VERIFY TOKEN MIDDLEWARE
=========================== */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "ไม่มี token" });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token ไม่ถูกต้อง" });
  }
};

/* ===========================
   PROTECTED ROUTE EXAMPLE
=========================== */
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "เข้าถึงข้อมูลได้",
    user: req.user,
  });
});

router.put("/me/address", verifyToken, (req, res) => {
  const userId = req.user.id;
  const { house, road, subdistrict, district, province, postalCode } = req.body;

  db.query(
    `UPDATE users 
     SET house=?, road=?, subdistrict=?, district=?, province=?, postalCode=?
     WHERE id=?`,
    [house, road, subdistrict, district, province, postalCode, userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "อัปเดตที่อยู่สำเร็จ" });
    }
  );
});

router.get("/me", verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT 
      id,
      username,
      fullName,
      email,
      phone,
      house,
      road,
      subdistrict,
      district,
      province,
      postalCode
     FROM users 
     WHERE id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});
module.exports = router;
