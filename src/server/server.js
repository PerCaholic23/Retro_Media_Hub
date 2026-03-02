const dns = require("dns").promises;
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Models test
const User = require("../../src/models/user");
const Product = require("../../src/models/product");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* =================================================
   AUTH SECTION
================================================= */

// Register
app.post("/api/register", async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      password,
      fullName,
      address,
      street,
      province,
      district,
      postalCode
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      fullName,
      address,
      street,
      province,
      district,
      postalCode
    });

    await user.save();
    res.status(201).json({ message: "User created" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "ไม่พบอีเมลนี้ในระบบ" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =================================================
   PROFILE
================================================= */

app.get("/api/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/profile/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.json({ message: "อัปเดตข้อมูลสำเร็จ", user: updatedUser });

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =================================================
   PRODUCT SECTION
================================================= */

// ดึงจำนวน stock ตามหมวด (dynamic จาก DB)
app.get("/api/category", authMiddleware, async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user.id)
        }
      },

      {
        $group: {
          _id: "$category",
          productCount: { $sum: 1 }
        }
      }
    ]);

    const formatted = result.map(item => ({
      category_slug: item._id,
      productCount: item.productCount
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ดึงสินค้าตามหมวด
app.get("/api/category/:slug", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.slug
    }).populate("owner", "username");

    res.json(products);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// เพิ่มสินค้า
app.post("/api/product", authMiddleware, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      owner: req.user.id
    });

    await product.save();
    res.json(product);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ลบสินค้า
app.put("/api/product/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!updated)
      return res.status(403).json({ message: "Not your product" });

    res.json(updated);

  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

// แก้ไขสินค้า
app.delete("/api/product/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!deleted)
      return res.status(403).json({ message: "Not your product" });

    res.json({ message: "Deleted" });

  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

app.get("/api/my-products/:slug", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.slug,
      owner: req.user.id
    });

    res.json(products);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});