// ManagerCard.tsx
import React, { useState } from "react";
import { Edit, Trash2, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // 1. Import Framer Motion
import { Editbutton, DeleteIcon, BlockIcon } from "../../public/assets/svg";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  tickets: number;
  avgResponse: string;
  statusColor?: string;
}

interface ManagerCardProps {
  manager: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    avatar: string;
    team: string;
    agentsCount: number;
    agents: Agent[];
    ticketsHandled: number;
    performanceRating: number;
    status: string;
    departmentBadge?: string;
  };
  onEdit?: (manager: any) => void;
  onDelete?: (manager: any) => void;
  onBlock?: (managerId: string) => void;
  onManagerClick?: (managerId: string) => void;
  onAgentClick?: (agentId: string) => void;
}

const ManagerCard: React.FC<ManagerCardProps> = ({
  manager,
  onEdit,
  onDelete,
  onBlock,
  onManagerClick,
  onAgentClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      onClick={() => onManagerClick?.(manager.id)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Manager Header */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 border-b border-gray-100 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Manager Avatar */}
            <div className="relative">
              <img
                src={manager.avatar}
                alt={manager.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg ring-2 ring-purple-200"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Manager Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {manager.name}
                </h3>
                {manager.departmentBadge && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    {manager.departmentBadge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{manager.role}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[180px]">{manager.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{manager.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              manager.status === "active"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            {manager.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Manager Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Team Size</p>
            <p className="text-lg font-bold text-gray-900">{manager.agentsCount}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Tickets</p>
            <p className="text-lg font-bold text-gray-900">{manager.ticketsHandled}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Team</p>
            <p className="text-sm font-bold text-gray-900 truncate">{manager.team}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Rating</p>
            <p className="text-lg font-bold text-purple-600">{manager.performanceRating}%</p>
          </div>
        </div>
      </div>

      {/* Agents Reporting Section */}
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              AGENTS REPORTING TO {manager.name.toUpperCase().split(" ")[0]}
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
              {manager.agentsCount}
            </span>
          </div>
          {/* Animated Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
             <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </motion.div>
        </button>

        {/* Animated Agents Table Dropdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tickets
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Avg. Response
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Active
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {manager.agents.map((agent) => (
                      <tr
                        key={agent.id}
                        className="hover:bg-purple-50/30 transition-colors cursor-pointer"
                        onClick={() => onAgentClick?.(agent.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={agent.avatar}
                              alt={agent.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-100"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {agent.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[150px]">{agent.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{agent.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              agent.status.toLowerCase() === "active"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : agent.status.toLowerCase() === "inactive"
                                ? "bg-gray-50 text-gray-700 border border-gray-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-gray-900">
                            {agent.tickets}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{agent.avgResponse}</span>
                        </td>
                        <td className="px-4 py-3">
                          <label
                            className="relative inline-flex items-center cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={agent.status.toLowerCase() === "active"}
                              className="sr-only peer"
                              onChange={() => {}}
                            />
                            <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Block"
                            >
                              <BlockIcon />
                            </button>
                            <button
                              className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manager Actions Footer */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={() => onEdit?.(manager)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Manager
        </button>
        <button
          onClick={() => onBlock?.(manager.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <BlockIcon />
        </button>
        <button
          onClick={() => onDelete?.(manager)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default ManagerCard;