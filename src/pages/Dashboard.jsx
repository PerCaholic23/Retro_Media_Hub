import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    totalProfit: 0,
    chartData: []
  });

  useEffect(() => {
    // 🔥 ดึงข้อมูลจาก backend จริงภายหลัง
    // ตอนนี้ทำ mock data ก่อน

    const mockData = [
      { month: "ม.ค.", revenue: 20000, expense: 12000 },
      { month: "ก.พ.", revenue: 35000, expense: 18000 },
      { month: "มี.ค.", revenue: 28000, expense: 15000 },
      { month: "เม.ย.", revenue: 40000, expense: 20000 },
      { month: "พ.ค.", revenue: 45000, expense: 22000 },
    ];

    const formatted = mockData.map(item => ({
      ...item,
      profit: item.revenue - item.expense
    }));

    const totalRevenue = formatted.reduce((sum, i) => sum + i.revenue, 0);
    const totalExpense = formatted.reduce((sum, i) => sum + i.expense, 0);
    const totalProfit = totalRevenue - totalExpense;

    setSummary({
      totalRevenue,
      totalExpense,
      totalProfit,
      chartData: formatted
    });

  }, []);

  return (
    <div className="bg-[#e9eff3] min-h-screen p-20 font-prompt">

      <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-8 mb-16">

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-gray-500 mb-2">รายได้รวม</h2>
          <p className="text-3xl font-bold text-green-500">
            ฿{summary.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-gray-500 mb-2">รายจ่ายรวม</h2>
          <p className="text-3xl font-bold text-red-500">
            ฿{summary.totalExpense.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-gray-500 mb-2">กำไรสุทธิ</h2>
          <p className="text-3xl font-bold text-orange-500">
            ฿{summary.totalProfit.toLocaleString()}
          </p>
        </div>

      </div>

      {/* LINE CHART */}
      <div className="bg-white rounded-3xl p-10 shadow-md">
        <h2 className="text-2xl font-semibold mb-6">แนวโน้มรายได้</h2>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={summary.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={3}
              name="รายได้"
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#ef4444"
              strokeWidth={3}
              name="รายจ่าย"
            />

            <Line
              type="monotone"
              dataKey="profit"
              stroke="#f28c45"
              strokeWidth={3}
              name="กำไร"
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}