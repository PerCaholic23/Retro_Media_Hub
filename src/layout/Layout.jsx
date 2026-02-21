import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#e9eff3] font-prompt">

      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <div className="bg-[#d6dee4] text-center py-6">
        <h2 className="text-2xl font-semibold mb-4">เกี่ยวกับเว็บไซต์</h2>
        <p>เว็บไซต์นี้จัดทำขึ้นเพื่อเป็นส่วนหนึ่งของวิชา System Engineering</p>
        <p>มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p>
      </div>

      <div className="bg-[#2f3b46] text-white text-center py-3">
        Copyright 2026 @RetroMediaHub
      </div>

    </div>
  );
}