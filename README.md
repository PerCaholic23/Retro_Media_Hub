# Orange App

## วิธีติดตั้ง

1. Clone โปรเจค
2. ติดตั้ง dependency

Backend
cd backend
npm install

Frontend
cd frontend
npm install

3. สร้างไฟล์ .env ในโฟลเดอร์ backend (ดูจาก .env.example)

4. สร้าง database ชื่อ orangeapp
5. Import ไฟล์ database.sql

6. รัน backend
npm start

7. รัน frontend
npm start


# การทำงานในแต่ละขั้นตอน
1) โคลน project มาลงที่เครื่องตัวเอง
2) ติดตั้ง dependency ที่จำเป็น npm install เพื่อติดตั้งโดยจะเป็นการดึงไฟล์มาจาก package.json (dependency ที่จำเป็นทั้งหมด) \n
3) รันคำสั่ง npm start และ node server.js ใน terminal &nbsp

# ข้อควรรู้
Backend และ Frontend รันแยกกัน โดย npm start จะเป็นการรัน Frontend ส่วน node server.js จะเป็นการรัน Backend