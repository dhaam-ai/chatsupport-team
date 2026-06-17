// TicketAssignmentMonitor.tsx
import React, { useState, useMemo } from "react";
import {
  Users,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCw,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockManagersData, mockAssignmentData } from "../data/mockManagers";

interface TicketAssignmentMonitorProps {
  managers?: any[];
  selectedManager?: string | null;
}

const TicketAssignmentMonitor: React.FC<TicketAssignmentMonitorProps> = ({
  managers = mockManagersData,
  selectedManager,
}) => {
  const [sortBy, setSortBy] = useState("tickets");
  const [filterStatus, setFilterStatus] = useState("all");

  const sortedManagers = useMemo(() => {
    let sorted = [...managers];
    if (sortBy === "tickets") {
      sorted.sort((a, b) => b.ticketsHandled - a.ticketsHandled);
    } else if (sortBy === "performance") {
      sorted.sort((a, b) => b.performanceRating - a.performanceRating);
    } else if (sortBy === "queue") {
      sorted.sort((a, b) => (b.queueLength || 0) - (a.queueLength || 0));
    }
    return sorted;
  }, [managers, sortBy]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Ticket Assignment Status
            </h3>
            <p className="text-sm text-gray-600">
              Monitor ticket distribution and workload across managers
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400"
            >
              <option value="tickets">Sort by Tickets</option>
              <option value="performance">Sort by Performance</option>
              <option value="queue">Sort by Queue Length</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer hover:border-gray-400"
            >
              <option value="all">All Statuses</option>
              <option value="high">High Load</option>
              <option value="medium">Medium Load</option>
              <option value="low">Low Load</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Assignment Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {sortedManagers.map((manager, idx) => {
          const assignmentRate = Math.min(100, (manager.ticketsHandled / 100) * 10);
          const getLoadStatus = () => {
            if (assignmentRate > 70) return { label: "High Load", color: "text-red-600", bgColor: "bg-red-50" };
            if (assignmentRate > 40) return { label: "Medium Load", color: "text-amber-600", bgColor: "bg-amber-50" };
            return { label: "Optimal", color: "text-green-600", bgColor: "bg-green-50" };
          };
          const loadStatus = getLoadStatus();

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:p-6 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={manager.avatar}
                    alt={manager.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {manager.name}
                    </p>
                    <p className="text-xs text-gray-600">{manager.agentsCount} agents</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap ${
                    loadStatus.bgColor
                  } ${loadStatus.color}`}
                >
                  {loadStatus.label}
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Queue</span>
                  <span className="font-bold text-gray-900">{manager.queueLength || 0} tickets</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      assignmentRate > 70
                        ? "bg-red-500"
                        : assignmentRate > 40
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${assignmentRate}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 text-right">{assignmentRate.toFixed(0)}% capacity</div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Assigned Today</p>
                  <p className="text-sm font-bold text-gray-900">{manager.assignedToday || 12}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Avg Time</p>
                  <p className="text-sm font-bold text-gray-900">{manager.avgAssignmentTime || "2.3h"}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Detailed Assignment Table */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Assignment Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Manager
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Queue Length
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Capacity
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Assigned Today
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Avg Response
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedManagers.map((manager, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4">
                    <p className="font-semibold text-gray-900">{manager.name}</p>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                      {manager.queueLength || 0}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (manager.ticketsHandled / 100) * 10)}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 font-semibold text-gray-900">
                    {manager.assignedToday || 12}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-gray-600">
                    {manager.avgResponseTime || "2.4h"}
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

export default TicketAssignmentMonitor;
