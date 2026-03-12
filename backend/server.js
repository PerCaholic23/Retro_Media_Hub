const dns = require("dns").promises;
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Models test
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order")

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));

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
      postalCode,
      soy
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
      postalCode,
      soy
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
   For fetching address
================================================= */

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

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

// Get all products (for homepage)
app.get("/api/products", authMiddleware, async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {
      owner: { $ne: req.user.id }
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate("owner", "username");

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ดึงสินค้า 1 ชิ้นตาม ID
app.get("/api/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("owner", "username");

    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================================= */
/* When user order something it will trigger this section */
/* ================================================= */
app.post("/api/order", authMiddleware, async (req, res) => {
  try {

    const { items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {

      const product = await Product.findById(item.id).populate("owner");

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: "Stock not enough" });
      }

      // reduce stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        seller: product.owner._id,
        name: product.name,
        artist: product.artist,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || ""
      });

      total += product.price * item.quantity;
    }

    const order = new Order({
      buyer: req.user.id,
      items: orderItems,
      total,
      paymentMethod
    });

    await order.save();

    // return seller QR (first seller for now)
    const firstSeller = await User.findById(orderItems[0].seller);

    res.json({
      message: "Order created",
      sellerQR: firstSeller.promptpayQR
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
});

/* ================================================= */
/* For sending data to dashboard 69afb954f04075f2cac93f22
69a00124259dcbc704369672*/ 
/* ================================================= */
app.get("/api/dashboard", authMiddleware, async (req, res) => {

  const userId = req.user.id;
  const { month } = req.query;

  let revenueMatch = {
    "items.seller": new mongoose.Types.ObjectId(userId)
  };

  let expenseMatch = {
    buyer: new mongoose.Types.ObjectId(userId)
  };

  if (month) {

    revenueMatch.$expr = {
      $eq: [{ $month: "$createdAt" }, Number(month)]
    };

    expenseMatch.$expr = {
      $eq: [{ $month: "$createdAt" }, Number(month)]
    };

  } else {

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    revenueMatch.createdAt = { $gte: thirtyDaysAgo };
    expenseMatch.createdAt = { $gte: thirtyDaysAgo };

  }

  const revenueData = await Order.aggregate([
    { $unwind: "$items" },
    { $match: revenueMatch },
    {
      $group: {
        _id: { day: { $dayOfMonth: "$createdAt" } },
        total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    }
  ]);

  const expenseData = await Order.aggregate([
  { $match: expenseMatch },
  {
    $group: {
      _id: { day: { $dayOfMonth: "$createdAt" } },
      total: { $sum: "$total" }
    }
  }
]);

  res.json({ revenueData, expenseData });

});


/* =================================================
   ORDER HISTORY (เพิ่มส่วนนี้เพื่อให้หน้าประวัติขึ้นข้อมูล)
================================================= */

// ดึงรายการสั่งซื้อทั้งหมดของ "ผู้ซื้อ" (สำหรับหน้า OrderHistory)
app.get("/api/order/my-orders", authMiddleware, async (req, res) => {
  try {
    // หา Order ใน MongoDB ที่ buyer ตรงกับ ID จาก Token
    // .sort({ createdAt: -1 }) เพื่อให้รายการล่าสุดอยู่ด้านบน
    const orders = await Order.find({ buyer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});