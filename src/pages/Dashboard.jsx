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

    // Inside Dashboard.jsx -> fetchDashboard function

    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { revenueData, expenseData } = res.data;

      const months = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      const combined = {};

      revenueData.forEach(item => {
        const m = item._id.month;
        if (!combined[m]) combined[m] = { month: months[m], revenue: 0, expense: 0 };
        combined[m].revenue = item.total;
      });

      expenseData.forEach(item => {
        const m = item._id.month;
        if (!combined[m]) combined[m] = { month: months[m], revenue: 0, expense: 0 };
        combined[m].expense = item.total;
      });

      const finalChartData = Object.values(combined).map(item => ({
        ...item,
        profit: item.revenue - item.expense
      }));

      const totalRev = finalChartData.reduce((sum, i) => sum + i.revenue, 0);
      const totalExp = finalChartData.reduce((sum, i) => sum + i.expense, 0);

      setSummary({
        totalRevenue: totalRev,
        totalExpense: totalExp,
        totalProfit: totalRev - totalExp,
        chartData: finalChartData
      });
    };
    fetchDashboard();
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