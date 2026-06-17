// QueueBalancer.tsx
import React, { useState, useMemo } from "react";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  ArrowRight,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockManagersData, mockQueueData } from "../data/mockManagers";

interface QueueBalancerProps {
  managers?: any[];
  selectedManager?: string | null;
}

const QueueBalancer: React.FC<QueueBalancerProps> = ({
  managers = mockManagersData,
  selectedManager,
}) => {
  const [sortBy, setSortBy] = useState("queue");

  const sortedManagers = useMemo(() => {
    let sorted = [...managers];
    if (sortBy === "queue") {
      sorted.sort((a, b) => (b.queueLength || 0) - (a.queueLength || 0));
    } else if (sortBy === "capacity") {
      sorted.sort((a, b) => {
        const capacityA = ((a.queueLength || 0) / (a.maxCapacity || 100)) * 100;
        const capacityB = ((b.queueLength || 0) / (b.maxCapacity || 100)) * 100;
        return capacityB - capacityA;
      });
    }
    return sorted;
  }, [managers, sortBy]);

  // Calculate redistribution suggestions
  const calculateRedistribution = () => {
    const overloaded = sortedManagers.filter(
      (m) => ((m.queueLength || 0) / (m.maxCapacity || 100)) * 100 > 70
    );
    const underutilized = sortedManagers.filter(
      (m) => ((m.queueLength || 0) / (m.maxCapacity || 100)) * 100 < 40
    );
    return { overloaded, underutilized };
  };

  const { overloaded, underutilized } = calculateRedistribution();

  const avgQueueLength = Math.round(
    managers.reduce((acc, m) => acc + (m.queueLength || 0), 0) / managers.length
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 lg:p-6 border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Avg Queue</span>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-700">{avgQueueLength}</p>
          <p className="text-xs text-gray-600 mt-1">Tickets in queue</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-5 lg:p-6 border border-red-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Overloaded</span>
            <TrendingUp className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700">{overloaded.length}</p>
          <p className="text-xs text-gray-600 mt-1">Need redistribution</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 lg:p-6 border border-green-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Underutilized</span>
            <TrendingDown className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{underutilized.length}</p>
          <p className="text-xs text-gray-600 mt-1">Can take more load</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 lg:p-6 border border-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Balanced</span>
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-700">
            {managers.length - overloaded.length - underutilized.length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Optimal capacity</p>
        </motion.div>
      </motion.div>

      {/* Sort Controls */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sort By
        </label>
        <div className="flex flex-wrap gap-2">
          {["queue", "capacity"].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                sortBy === option
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option === "queue"
                ? "Queue Length"
                : "Capacity"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Queue Balance Visualization */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, staggerChildren: 0.05 }}
      >
        {sortedManagers.map((manager, idx) => {
          const maxCapacity = manager.maxCapacity || 100;
          const capacity = ((manager.queueLength || 0) / maxCapacity) * 100;
          const isOverloaded = capacity > 70;
          const isUnderutilized = capacity < 40;
          const isOptimal = !isOverloaded && !isUnderutilized;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={manager.avatar}
                    alt={manager.name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {manager.name}
                    </p>
                    <p className="text-xs text-gray-600">{manager.agentsCount} agents</p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold text-gray-900">
                    {manager.queueLength || 0} / {maxCapacity}
                  </p>
                  <p className="text-xs text-gray-600">{capacity.toFixed(0)}%</p>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className={`h-3 rounded-full transition-all ${
                      isOverloaded
                        ? "bg-gradient-to-r from-red-400 to-red-600"
                        : isUnderutilized
                        ? "bg-gradient-to-r from-blue-400 to-blue-600"
                        : "bg-gradient-to-r from-green-400 to-green-600"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(capacity, 100)}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  ></motion.div>
                </div>
              </div>

              {/* Status and Recommendation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOverloaded ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-semibold text-red-600">
                        Overloaded - Redistribute needed
                      </span>
                    </>
                  ) : isUnderutilized ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">
                        Can handle more tickets
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-600">
                        Optimal load
                      </span>
                    </>
                  )}
                </div>
                {isOverloaded && underutilized.length > 0 && (
                  <button className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors flex items-center gap-1">
                    Redistribute
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default QueueBalancer;
