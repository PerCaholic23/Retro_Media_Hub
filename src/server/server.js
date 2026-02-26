const dns = require("dns").promises;
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Models test
const User = require("../models/user");
const Product = require("../models/product");

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

/* =================================================
   PRODUCT SECTION
================================================= */

// ดึงจำนวน stock ตามหมวด (dynamic จาก DB)
app.get("/api/category", async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalStock: { $sum: 1 }
        }
      }
    ]);

    const formatted = result.map(item => ({
      category_slug: item._id,
      totalStock: item.totalStock
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
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// เพิ่มสินค้า
app.post("/api/product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ลบสินค้า
app.delete("/api/product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสินค้าสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "ลบไม่สำเร็จ" });
  }
});

// แก้ไขสินค้า
app.put("/api/product/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    res.json({
      message: "แก้ไขสำเร็จ",
      product: updatedProduct
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "แก้ไขไม่สำเร็จ" });
  }
});

/* ================================================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});