-- สร้าง database ถ้ายังไม่มี
1.CREATE DATABASE IF NOT EXISTS orangeapp;

-- เลือก database
USE orangeapp;

-- ลบ table เดิมถ้ามี (กัน error ตอน import ซ้ำ)
DROP TABLE IF EXISTS users;

-- สร้าง table users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  house VARCHAR(50),
  village VARCHAR(100),
  road VARCHAR(100),
  subdistrict VARCHAR(100),
  district VARCHAR(100),
  province VARCHAR(100),
  postalCode VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


2.CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2),
  image VARCHAR(255),
  stock INT,
  category_slug VARCHAR(100)
);