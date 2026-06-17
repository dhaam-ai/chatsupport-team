// ManagerMonitoringDashboard.tsx
import React, { useState, useMemo } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  BarChart3,
  Zap,
  Target,
  Phone,
  Mail,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { mockManagersData, mockPerformanceData, mockTeamData } from "../data/mockManagers";

interface ManagerMonitoringDashboardProps {
  managers?: any[];
  selectedManager?: string | null;
}

const ManagerMonitoringDashboard: React.FC<ManagerMonitoringDashboardProps> = ({
  managers = mockManagersData,
  selectedManager,
}) => {
  const [timeRange, setTimeRange] = useState("7d");

  // Calculate aggregated metrics
  const metrics = useMemo(() => {
    const totalManagers = managers.length;
    const totalAgents = managers.reduce((acc, m) => acc + (m.agentsCount || 0), 0);
    const totalTickets = managers.reduce((acc, m) => acc + (m.ticketsHandled || 0), 0);
    const avgPerformance = Math.round(
      managers.reduce((acc, m) => acc + (m.performanceRating || 0), 0) / totalManagers
    );
    const activeManagers = managers.filter((m) => m.status === "active").length;
    const escalations = managers.reduce((acc, m) => acc + (m.escalations || 0), 0);
    const avgResponseTime = "2.4h";

    return {
      totalManagers,
      totalAgents,
      totalTickets,
      avgPerformance,
      activeManagers,
      escalations,
      avgResponseTime,
    };
  }, [managers]);

  const metricCards = [
    {
      label: "Total Managers",
      value: metrics.totalManagers,
      icon: Users,
      color: "from-blue-50 to-blue-100/50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      trend: "+5%",
      positive: true,
    },
    {
      label: "Managed Agents",
      value: metrics.totalAgents,
      icon: Activity,
      color: "from-green-50 to-green-100/50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      trend: "+12%",
      positive: true,
    },
    {
      label: "Tickets Handled",
      value: `${metrics.totalTickets.toLocaleString()}`,
      icon: CheckCircle2,
      color: "from-purple-50 to-purple-100/50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      trend: "+8%",
      positive: true,
    },
    {
      label: "Avg Performance",
      value: `${metrics.avgPerformance}%`,
      icon: TrendingUp,
      color: "from-amber-50 to-amber-100/50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      trend: "+2%",
      positive: true,
    },
    {
      label: "Active Managers",
      value: metrics.activeManagers,
      icon: Users,
      color: "from-emerald-50 to-emerald-100/50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      trend: "—",
      positive: true,
    },
    {
      label: "Open Escalations",
      value: metrics.escalations,
      icon: AlertTriangle,
      color: "from-red-50 to-red-100/50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
      trend: "-3%",
      positive: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0 }}
      >
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className={`p-2 lg:p-3 rounded-lg bg-white/70 backdrop-blur-sm`}>
                  <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${card.textColor}`} />
                </div>
                <span
                  className={`text-xs lg:text-sm font-semibold px-2 py-1 rounded-full ${
                    card.positive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {card.trend}
                </span>
              </div>
              <p className="text-xs lg:text-sm text-gray-600 mb-1 lg:mb-2">
                {card.label}
              </p>
              <p className={`text-2xl lg:text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Performance Trend */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Performance Trend
            </h3>
            <p className="text-sm text-gray-600">Last 7 days performance</p>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#7c43df"
                  strokeWidth={2}
                  dot={{ fill: "#7c43df" }}
                  name="Avg Performance"
                />
                <Line
                  type="monotone"
                  dataKey="resolution"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                  name="Resolution Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Ticket Distribution
            </h3>
            <p className="text-sm text-gray-600">Tickets by status</p>
          </div>
          <div className="h-64 -mx-2 lg:-mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTeamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="manager" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                <Bar dataKey="escalated" fill="#ef4444" name="Escalated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Top Managers Table */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Top Managers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Manager
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Team Size
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Tickets Handled
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Performance
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {managers.slice(0, 5).map((manager, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={manager.avatar}
                        alt={manager.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {manager.name}
                        </p>
                        <p className="text-xs text-gray-600">{manager.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                      {manager.agentsCount} agents
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 font-semibold text-gray-900">
                    {manager.ticketsHandled.toLocaleString()}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${manager.performanceRating}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900 text-xs">
                        {manager.performanceRating}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        manager.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {manager.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManagerMonitoringDashboard;
