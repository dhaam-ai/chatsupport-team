import React, { useState, useMemo } from "react";
import {
  Users,
  Ticket,
  Search,
  Filter,
  ChevronDown,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
  Send,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockManagersData } from "../data/mockManagers";

interface ITicket {
  id: string;
  ticketId: string;
  customer: string;
  subject: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "pending" | "in-progress" | "resolved";
  assignedTo: string | null;
  createdAt: string;
  dueDate: string;
  description: string;
}

interface TicketAssignmentManagerProps {
  managers?: any[];
  selectedManager?: string | null;
}

// Mock tickets data
const mockTickets: ITicket[] = [
  {
    id: "T-001",
    ticketId: "#TK001",
    customer: "Acme Corp",
    subject: "Login issues on mobile app",
    priority: "critical",
    status: "open",
    assignedTo: null,
    createdAt: "2026-05-31 09:00",
    dueDate: "2026-05-31 13:00",
    description: "Users unable to login through mobile app, getting 500 error",
  },
  {
    id: "T-002",
    ticketId: "#TK002",
    customer: "TechStart Inc",
    subject: "API rate limiting issue",
    priority: "high",
    status: "open",
    assignedTo: null,
    createdAt: "2026-05-31 08:30",
    dueDate: "2026-05-31 16:30",
    description: "API calls being throttled unexpectedly",
  },
  {
    id: "T-003",
    ticketId: "#TK003",
    customer: "Global Solutions",
    subject: "Dashboard display glitch",
    priority: "medium",
    status: "open",
    assignedTo: null,
    createdAt: "2026-05-31 10:00",
    dueDate: "2026-06-01 10:00",
    description: "Charts not rendering correctly on dashboard",
  },
  {
    id: "T-004",
    ticketId: "#TK004",
    customer: "Digital Ventures",
    subject: "Account upgrade needed",
    priority: "medium",
    status: "pending",
    assignedTo: "agent-1",
    createdAt: "2026-05-30 14:00",
    dueDate: "2026-06-02 14:00",
    description: "Customer wants to upgrade to enterprise plan",
  },
  {
    id: "T-005",
    ticketId: "#TK005",
    customer: "CloudBase Ltd",
    subject: "Billing discrepancy",
    priority: "high",
    status: "open",
    assignedTo: null,
    createdAt: "2026-05-31 11:30",
    dueDate: "2026-05-31 17:30",
    description: "Invoice amount does not match usage",
  },
  {
    id: "T-006",
    ticketId: "#TK006",
    customer: "TechFlow Systems",
    subject: "Feature request - Dark mode",
    priority: "low",
    status: "open",
    assignedTo: null,
    createdAt: "2026-05-29 16:00",
    dueDate: "2026-06-05 16:00",
    description: "Customer requesting dark mode feature implementation",
  },
];

const TicketAssignmentManager: React.FC<TicketAssignmentManagerProps> = ({
  managers = mockManagersData,
  selectedManager,
}) => {
  const [tickets, setTickets] = useState<ITicket[]>(mockTickets);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [reassigningFrom, setReassigningFrom] = useState<string | null>(null);
  const [showReassignModal, setShowReassignModal] = useState(false);

  // Get all agents from selected manager
  const agentsForAssignment = useMemo(() => {
    if (selectedManager) {
      const manager = managers.find((m) => m.id === selectedManager);
      return manager?.agents || [];
    }
    // Get all agents from all managers
    const allAgents: any[] = [];
    managers.forEach((m) => {
      if (m.agents) {
        allAgents.push(...m.agents);
      }
    });
    return allAgents;
  }, [selectedManager, managers]);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchSearch =
        ticket.ticketId.toLowerCase().includes(search.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(search.toLowerCase());

      const matchPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchStatus =
        statusFilter === "all" || ticket.status === statusFilter;

      return matchSearch && matchPriority && matchStatus;
    });
  }, [tickets, search, priorityFilter, statusFilter]);

  // Handle ticket assignment
  const handleAssignTicket = (agentId: string) => {
    if (!selectedTicket) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              assignedTo: agentId,
              status: "in-progress" as const,
            }
          : t
      )
    );

    setSelectedTicket(null);
    setShowAssignModal(false);
  };

  // Handle ticket reassignment
  const handleReassignTicket = (agentId: string) => {
    if (!selectedTicket) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              assignedTo: agentId,
            }
          : t
      )
    );

    setSelectedTicket(null);
    setShowReassignModal(false);
    setReassigningFrom(null);
  };

  const getAssignedAgent = (agentId: string | null) => {
    if (!agentId) return null;
    return agentsForAssignment.find((a) => a.id === agentId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "in-progress":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Ticket className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Ticket Assignment</h2>
        </div>
        <p className="text-purple-100 text-sm">
          Manage and assign tickets to your team members
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ticket ID, subject, or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Tickets",
            value: filteredTickets.length,
            icon: Ticket,
            color: "from-blue-600 to-blue-400",
          },
          {
            label: "Unassigned",
            value: filteredTickets.filter((t) => !t.assignedTo).length,
            icon: AlertTriangle,
            color: "from-red-600 to-red-400",
          },
          {
            label: "In Progress",
            value: filteredTickets.filter((t) => t.status === "in-progress")
              .length,
            icon: RefreshCw,
            color: "from-purple-600 to-purple-400",
          },
          {
            label: "Critical",
            value: filteredTickets.filter((t) => t.priority === "critical")
              .length,
            icon: AlertTriangle,
            color: "from-orange-600 to-orange-400",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-4 shadow-lg`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-20" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tickets Table */}
      <motion.div
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-purple-200">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket, idx) => {
                    const assignedAgent = getAssignedAgent(ticket.assignedTo);
                    return (
                      <motion.tr
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-purple-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-purple-600">
                            {ticket.ticketId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {ticket.customer}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900 font-medium truncate">
                              {ticket.subject}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority.charAt(0).toUpperCase() +
                              ticket.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status.charAt(0).toUpperCase() +
                              ticket.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {assignedAgent ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={assignedAgent.avatar}
                                alt={assignedAgent.name}
                                className="w-6 h-6 rounded-full object-cover border border-gray-200"
                              />
                              <span className="text-sm text-gray-900">
                                {assignedAgent.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {!ticket.assignedTo ? (
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowAssignModal(true);
                                }}
                                className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold transition-colors border border-green-200"
                              >
                                Assign
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setReassigningFrom(ticket.assignedTo);
                                  setShowReassignModal(true);
                                }}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors border border-blue-200"
                              >
                                Reassign
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedTicket(ticket)}
                              className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-semibold transition-colors border border-gray-200"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <p className="text-gray-500">No tickets found</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Ticket Details Sidebar */}
      <AnimatePresence>
        {selectedTicket && !showAssignModal && !showReassignModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              className="bg-white w-full md:w-96 rounded-t-3xl md:rounded-2xl shadow-2xl p-6 md:p-8"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Ticket Details
                </h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    Ticket ID
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {selectedTicket.ticketId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    Customer
                  </p>
                  <p className="text-sm text-gray-900">{selectedTicket.customer}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    Subject
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {selectedTicket.subject}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Priority
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(
                        selectedTicket.priority
                      )}`}
                    >
                      {selectedTicket.priority.charAt(0).toUpperCase() +
                        selectedTicket.priority.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        selectedTicket.status
                      )}`}
                    >
                      {selectedTicket.status.charAt(0).toUpperCase() +
                        selectedTicket.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    Created
                  </p>
                  <p className="text-sm text-gray-900">{selectedTicket.createdAt}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                    Due Date
                  </p>
                  <p className="text-sm text-gray-900">{selectedTicket.dueDate}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-3">
                    Currently Assigned To
                  </p>
                  {selectedTicket.assignedTo ? (
                    <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <img
                        src={getAssignedAgent(selectedTicket.assignedTo)?.avatar}
                        alt="Assigned agent"
                        className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getAssignedAgent(selectedTicket.assignedTo)?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {getAssignedAgent(selectedTicket.assignedTo)?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Not assigned</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {!selectedTicket.assignedTo ? (
                    <button
                      onClick={() => {
                        setShowAssignModal(true);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Assign Ticket
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setReassigningFrom(selectedTicket.assignedTo);
                        setShowReassignModal(true);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reassign Ticket
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && selectedTicket && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Assign Ticket {selectedTicket.ticketId}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">{selectedTicket.subject}</span>
              </p>

              <p className="text-xs text-gray-600 font-semibold uppercase mb-4">
                Select Team Member
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                {agentsForAssignment.length > 0 ? (
                  agentsForAssignment.map((agent) => (
                    <motion.button
                      key={agent.id}
                      onClick={() => handleAssignTicket(agent.id)}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {agent.name}
                        </p>
                        <p className="text-xs text-gray-600">{agent.email}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {agent.tickets || 0} tickets
                      </span>
                    </motion.button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No agents available
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reassign Modal */}
      <AnimatePresence>
        {showReassignModal && selectedTicket && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReassignModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reassign Ticket {selectedTicket.ticketId}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">{selectedTicket.subject}</span>
              </p>

              <p className="text-xs text-gray-500 mb-4">
                Currently assigned to:{" "}
                <span className="font-semibold">
                  {getAssignedAgent(reassigningFrom)?.name}
                </span>
              </p>

              <p className="text-xs text-gray-600 font-semibold uppercase mb-4">
                Select New Team Member
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
                {agentsForAssignment.length > 0 ? (
                  agentsForAssignment.map((agent) => (
                    <motion.button
                      key={agent.id}
                      onClick={() => handleReassignTicket(agent.id)}
                      disabled={agent.id === reassigningFrom}
                      className={`w-full flex items-center gap-3 p-3 border rounded-lg transition-colors text-left ${
                        agent.id === reassigningFrom
                          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      whileHover={agent.id !== reassigningFrom ? { x: 4 } : {}}
                    >
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {agent.name}
                        </p>
                        <p className="text-xs text-gray-600">{agent.email}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {agent.tickets || 0} tickets
                      </span>
                    </motion.button>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No agents available
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowReassignModal(false)}
                className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicketAssignmentManager;
