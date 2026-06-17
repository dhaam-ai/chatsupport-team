// PerformanceAnalytics.tsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TrendingUp, TrendingDown, Award, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { mockPerformanceData, mockManagersData, mockReportsData } from "../data/mockManagers";

interface PerformanceAnalyticsProps {
  managers?: any[];
  selectedManager?: string | null;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  managers = mockManagersData,
  selectedManager,
}) => {
  const [timeRange, setTimeRange] = useState("7d");

  const COLORS = ["#7c43df", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  const categoryDistribution = [
    { name: "Resolved", value: 65 },
    { name: "Pending", value: 20 },
    { name: "Escalated", value: 10 },
    { name: "On Hold", value: 5 },
  ];

  const managerComparison = [
    { manager: "Jessica", resolution: 96, satisfaction: 94, efficiency: 89, quality: 92 },
    { manager: "Michael", resolution: 89, satisfaction: 87, efficiency: 91, quality: 85 },
    { manager: "Sarah", resolution: 92, satisfaction: 90, efficiency: 88, quality: 94 },
    { manager: "David", resolution: 88, satisfaction: 85, efficiency: 86, quality: 82 },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {["24h", "7d", "30d", "90d"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              timeRange === range
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            {range}
          </button>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {/* Resolution Rate Trend */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Resolution Rate</h3>
            <p className="text-sm text-gray-600">Daily resolution percentage</p>
          </div>
          <div className="h-64 -mx-2 lg:-mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="resolution"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ticket Distribution</h3>
            <p className="text-sm text-gray-600">By status</p>
          </div>
          <div className="h-64 -mx-2 lg:-mx-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx] }}
                ></div>
                <span className="text-gray-700">{item.name}</span>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Manager Comparison Radar */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Manager Performance Metrics</h3>
          <p className="text-sm text-gray-600">Comparative performance across key metrics</p>
        </div>
        <div className="h-80 -mx-2 lg:-mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={managerComparison}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="manager" stroke="#9ca3af" />
              <PolarRadiusAxis stroke="#9ca3af" angle={90} domain={[0, 100]} />
              <Radar
                name="Resolution"
                dataKey="resolution"
                stroke="#7c43df"
                fill="#7c43df"
                fillOpacity={0.3}
              />
              <Radar
                name="Satisfaction"
                dataKey="satisfaction"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Manager Rankings */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Top Performing Managers</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {managers.slice(0, 5).map((manager, idx) => (
            <div key={idx} className="px-4 lg:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="font-bold text-lg text-purple-600 flex-shrink-0">
                  #{idx + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{manager.name}</p>
                  <p className="text-xs text-gray-600">{manager.agentsCount} agents managed</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900">{manager.performanceRating}%</span>
                  </div>
                  <p className="text-xs text-gray-600">Performance</p>
                </div>
                <button className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold transition-colors">
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceAnalytics;
