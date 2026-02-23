const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("../models/user");
const bcrypt = require("bcrypt");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Handle from register
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});