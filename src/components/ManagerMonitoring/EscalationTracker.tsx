// EscalationTracker.tsx
import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  Phone,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockEscalations } from "../data/mockManagers";

interface EscalationTrackerProps {
  managers?: any[];
  selectedManager?: string | null;
}

const EscalationTracker: React.FC<EscalationTrackerProps> = ({
  managers = [],
  selectedManager,
}) => {
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const escalations = useMemo(() => {
    return mockEscalations.filter((e) => {
      if (filterPriority !== "all" && e.priority !== filterPriority) return false;
      if (filterStatus !== "all" && e.status !== filterStatus) return false;
      return true;
    });
  }, [filterPriority, filterStatus]);

  const stats = useMemo(() => {
    const total = mockEscalations.length;
    const critical = mockEscalations.filter((e) => e.priority === "critical").length;
    const resolved = mockEscalations.filter((e) => e.status === "resolved").length;
    const pending = mockEscalations.filter((e) => e.status === "pending").length;

    return { total, critical, resolved, pending };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          { label: "Total Escalations", value: stats.total, icon: AlertTriangle, color: "from-red-50 to-red-100/50" },
          { label: "Critical", value: stats.critical, icon: Zap, color: "from-orange-50 to-orange-100/50" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "from-green-50 to-green-100/50" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "from-blue-50 to-blue-100/50" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 lg:p-6 border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-gray-400" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Escalations List */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, staggerChildren: 0.05 }}
      >
        {escalations.map((escalation, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6 hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(escalation.priority)}`}>
                    {escalation.priority.toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-gray-900 truncate">
                    {escalation.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{escalation.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {escalation.manager}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {escalation.timeOpen}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {escalation.ticketId}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(escalation.status)}`}>
                  {escalation.status === "in-progress" ? "In Progress" : escalation.status}
                </span>
                <button className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors">
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {escalations.length === 0 && (
        <motion.div
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No escalations found with current filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default EscalationTracker;
