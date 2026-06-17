// SLAMonitor.tsx
import React, { useState, useMemo } from "react";
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockSLAData, mockManagersData } from "../data/mockManagers";

interface SLAMonitorProps {
  managers?: any[];
  selectedManager?: string | null;
}

const SLAMonitor: React.FC<SLAMonitorProps> = ({
  managers = mockManagersData,
  selectedManager,
}) => {
  const [filterStatus, setFilterStatus] = useState("all");

  const slaMetrics = useMemo(() => {
    const onTime = mockSLAData.filter((s) => s.status === "compliant").length;
    const breached = mockSLAData.filter((s) => s.status === "breached").length;
    const atrisk = mockSLAData.filter((s) => s.status === "at-risk").length;
    const complianceRate = ((onTime / mockSLAData.length) * 100).toFixed(1);

    return { onTime, breached, atrisk, complianceRate, total: mockSLAData.length };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-700 border-green-300";
      case "breached":
        return "bg-red-100 text-red-700 border-red-300";
      case "at-risk":
        return "bg-amber-100 text-amber-700 border-amber-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "breached":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "at-risk":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* SLA Overview Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 lg:p-6 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Compliant</span>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{slaMetrics.onTime}</p>
          <p className="text-xs text-gray-600 mt-1">Out of {slaMetrics.total} SLAs</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-5 lg:p-6 border border-amber-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">At Risk</span>
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-700">{slaMetrics.atrisk}</p>
          <p className="text-xs text-gray-600 mt-1">Require attention</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-5 lg:p-6 border border-red-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Breached</span>
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700">{slaMetrics.breached}</p>
          <p className="text-xs text-gray-600 mt-1">SLA violations</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 lg:p-6 border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Compliance</span>
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-700">{slaMetrics.complianceRate}%</p>
          <p className="text-xs text-gray-600 mt-1">Overall rate</p>
        </motion.div>
      </motion.div>

      {/* Filter */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full lg:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer"
        >
          <option value="all">All SLAs</option>
          <option value="compliant">Compliant</option>
          <option value="at-risk">At Risk</option>
          <option value="breached">Breached</option>
        </select>
      </motion.div>

      {/* SLA Details Table */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">SLA Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Ticket ID
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Manager
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Response Time
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Resolution Time
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  SLA Target
                </th>
                <th className="px-4 lg:px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockSLAData.map((sla, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 font-semibold text-gray-900">
                    {sla.ticketId}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-gray-600">
                    {sla.manager}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {sla.responseTime > sla.responseTarget ? (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-gray-900">{sla.responseTime}h</span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {sla.resolutionTime > sla.resolutionTarget ? (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-gray-900">{sla.resolutionTime}h</span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-gray-600">
                    {sla.responseTarget}h / {sla.resolutionTarget}h
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(sla.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          sla.status
                        )}`}
                      >
                        {sla.status === "at-risk" ? "At Risk" : sla.status}
                      </span>
                    </div>
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

export default SLAMonitor;
