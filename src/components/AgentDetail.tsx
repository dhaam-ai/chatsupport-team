import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Star,
  Users,
  Activity,
  BarChart3,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { AppDispatch, RootState } from "../store/store";
import { fetchAgentDetail, fetchAgentTickets } from "../store/agentSlice";

const AgentDetail = ({ selectedAgent = null, setSelectedManagerId }: { selectedAgent?: any; setSelectedManagerId?: (id: string) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { agentId } = useParams<{ agentId: string }>(); // Keep for future URL-based routing
  
  const {
    agentDetail,
    agentDetailLoading,
    agentDetailError,
    agentTickets,
    agentTicketsTotal,
    agentTicketsLoading,
    agentTicketsError
  } = useSelector((state: RootState) => state.agents);
  
  // Use selectedAgent prop if available, otherwise use Redux state
  const agent = selectedAgent || agentDetail;
  const tickets = agentTickets;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch agent details and tickets when component mounts or agentId changes
  useEffect(() => {
    // If selectedAgent is passed as prop, use its data directly
    if (selectedAgent) {
      const numericAgentId = selectedAgent.agent_id || selectedAgent.id;
      const appId = '12775';
      
      if (numericAgentId) {
        // Fetch agent tickets for the selected agent
        dispatch(fetchAgentTickets({
          agent_id: parseInt(numericAgentId.toString(), 10),
          app_id: appId,
          page: currentPage,
          limit: ticketsPerPage,
          search: searchQuery,
          account_status: statusFilter === 'All' ? [] : [statusFilter]
        }));
      }
    } else if (agentId) {
      // Fallback to URL-based routing (for future use)
      const numericAgentId = parseInt(agentId, 10);
      const appId = '12775';
      
      // Fetch agent details
      dispatch(fetchAgentDetail({ agent_id: numericAgentId, app_id: appId }));
      
      // Fetch agent tickets
      dispatch(fetchAgentTickets({
        agent_id: numericAgentId,
        app_id: appId,
        page: currentPage,
        limit: ticketsPerPage,
        search: searchQuery,
        account_status: statusFilter === 'All' ? [] : [statusFilter]
      }));
    }
  }, [dispatch, selectedAgent, agentId, currentPage, ticketsPerPage, searchQuery, statusFilter]);

  const activityLog = [
    { type: 'ticket', text: 'Resolved ticket #5421 - Login issue', time: '2 hours ago' },
    { type: 'email', text: 'Sent follow-up email to customer', time: '4 hours ago' },
    { type: 'call', text: 'Phone call with VIP client - 25 minutes', time: '1 day ago' },
    { type: 'note', text: 'Added internal note about billing process', time: '2 days ago' },
    { type: 'ticket', text: 'Created escalation ticket #5398', time: '3 days ago' },
  ];


   const data = [
  { day: 'Mon', resolved: 40 },
  { day: 'Tue', resolved: 55 },
  { day: 'Wed', resolved: 80 },
  { day: 'Thu', resolved: 65 },
  { day: 'Fri', resolved: 75 },
  { day: 'Sat', resolved: 50 },
  { day: 'Sun', resolved: 60 },
];

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalTickets = agentTicketsTotal || 0;
  const totalPages = Math.max(1, Math.ceil(totalTickets / ticketsPerPage));
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = Math.min(startIndex + ticketsPerPage, totalTickets);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Match colors exactly from ticket module
  const getTicketStatusColor = (status) => {
    const normalizedStatus = (status || "").toLowerCase().replace(/ /g, "_");
    const colors = {
      open: "bg-red-50 text-red-800 border border-red-200",
      in_progress: "bg-purple-50 text-purple-800 border border-purple-200",
      pending: "bg-yellow-50 text-yellow-800 border border-yellow-200",
      reopen: "bg-red-50 text-red-800 border border-red-200",
      resolved: "bg-green-50 text-green-800 border border-green-200",
      closed: "bg-gray-50 text-gray-800 border border-gray-200",
    };
    return colors[normalizedStatus] || "bg-gray-50 text-gray-800 border border-gray-200";
  };

  const getPriorityColor = (priority) => {
    const normalizedPriority = (priority || "").toLowerCase();
    const colors = {
      critical: "bg-red-50 text-red-800 border border-red-200",
      high: "bg-red-50 text-red-800 border border-red-200",
      medium: "bg-blue-50 text-blue-800 border border-blue-200",
      normal: "bg-blue-50 text-blue-800 border border-blue-200",
      low: "bg-green-50 text-green-800 border border-green-200",
      urgent: "bg-red-50 text-red-800 border border-red-200", // Add urgent mapping
    };
    return colors[normalizedPriority] || "bg-gray-50 text-gray-800 border border-gray-200";
  };
  
  // Generate dummy avatar for customer based on name
  const getDummyAvatar = (name) => {
    if (!name) return "https://i.pravatar.cc/150?img=1";
    const charCode = name.charCodeAt(0) || 1;
    const avatarIndex = (charCode % 70) + 1; // Use avatars 1-70
    return `https://i.pravatar.cc/150?img=${avatarIndex}`;
  };

  // Show loading state (only if we're waiting for API data and don't have selectedAgent)
  if (!selectedAgent && agentDetailLoading) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent details...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (!selectedAgent && agentDetailError) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <XCircle className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">Error loading agent details: {agentDetailError}</p>
          <button 
            onClick={() => agentId && dispatch(fetchAgentDetail({ agent_id: parseInt(agentId), app_id: '12775' }))}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Show message if no agent found
  if (!agent) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No agent found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 md:p-6">
        {/* Header Card - Mobile Optimized */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-purple-100 p-4 sm:p-6 md:p-8 mb-4 md:mb-6 shadow-sm">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex items-start gap-3 mb-4">
              <img 
                src={agent.avatar}
                alt={agent.name}
                className="w-16 h-16 rounded-xl ring-4 ring-purple-50"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">{agent.name}</h1>
                <p className="text-sm text-gray-600 mb-2">{agent.role}</p>
                <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold border ${
                  agent.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                  agent.status === 'On Leave' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {agent.status}
                </span>
              </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{agent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{agent.location}</span>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit className="w-4 h-4 inline mr-1" /> Edit
              </button>
              <button className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4 inline mr-1" /> Delete
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <img 
                src={agent.avatar}
                alt={agent.name}
                className="w-24 h-24 rounded-2xl ring-4 ring-purple-50"
              />

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
                  
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    agent.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                    agent.status === 'On Leave' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{agent.role}</p>

                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {agent.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {agent.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {agent.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined Jan 15, 2024
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
                <Edit className="w-4 h-4 inline mr-2" /> Edit
              </button>
              <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-all">
                <Trash2 className="w-4 h-4 inline mr-2" /> Delete
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats - Responsive Grid */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 pt-4 md:pt-6 border-t border-purple-100">
            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg md:rounded-xl flex-1 min-w-[100px]">
              <div className="text-xl md:text-2xl font-bold text-purple-600">{agent.ticketsClosed}</div>
              <div className="text-xs text-gray-600 mt-1">Tickets Closed</div>
            </div>

            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg md:rounded-xl flex-1 min-w-[100px]">
              <div className="text-xl md:text-2xl font-bold text-blue-600">{agent.avgResponseTime}</div>
              <div className="text-xs text-gray-600 mt-1">Avg Response</div>
            </div>

            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg md:rounded-xl flex-1 min-w-[100px]">
              <div className="text-xl md:text-2xl font-bold text-amber-600">{Number(agent?.agent_rating || 0).toFixed(1)}</div>
              <div className="text-xs text-gray-600 mt-1">Rating</div>
            </div>

            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg md:rounded-xl flex-1 min-w-[100px]">
              <div className="text-xl md:text-2xl font-bold text-green-600">{agent.performanceScore}%</div>
              <div className="text-xs text-gray-600 mt-1">Performance</div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Tickets and Charts */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Agent Tickets Table */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Agent Tickets</h2>
                    <p className="text-gray-500 text-sm mt-1">{totalTickets} tickets found</p>
                  </div>
                  
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="md:hidden w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  {/* Desktop Filters */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="All">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Mobile Filters */}
                {showMobileFilters && (
                  <div className="md:hidden mt-4 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      <option value="All">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden">
                {agentTicketsLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading tickets...</p>
                  </div>
                ) : agentTicketsError ? (
                  <div className="p-4 text-center">
                    <XCircle className="w-6 h-6 text-red-300 mx-auto mb-2" />
                    <p className="text-red-500 text-sm">{agentTicketsError}</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="p-4 text-center">
                    <FileText className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No tickets found</p>
                  </div>
                ) : tickets.map((ticket, i) => (
                  <div key={i} className="border-b border-gray-200 p-4 hover:bg-purple-50/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-semibold text-purple-600">{ticket.ticket_id || ticket.id || '#N/A'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-medium text-gray-900 mb-1">{ticket.subject || ticket.title || 'No subject'}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <img 
                          src={getDummyAvatar(ticket.customer_name || ticket.customer || 'Unknown')}
                          alt={ticket.customer_name || ticket.customer || 'Customer'}
                          className="w-6 h-6 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://i.pravatar.cc/150?img=1";
                          }}
                        />
                        <span>{ticket.customer_name || ticket.customer || 'Unknown Customer'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getTicketStatusColor(ticket.status)}`}>
                        {ticket.status === "Open" && <AlertCircle className="w-3 h-3" />}
                        {ticket.status === "In Progress" && <Clock className="w-3 h-3" />}
                        {ticket.status === "Resolved" && <CheckCircle className="w-3 h-3" />}
                        {ticket.status === "Closed" && <XCircle className="w-3 h-3" />}
                        {ticket.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto" style={{ maxHeight: "500px", overflowY: "auto" }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm border-b border-purple-200/50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agentTicketsLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            <p className="text-gray-500 text-sm">Loading tickets...</p>
                          </div>
                        </td>
                      </tr>
                    ) : agentTicketsError ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <XCircle className="w-8 h-8 text-red-300" />
                            <p className="text-red-500 text-sm">{agentTicketsError}</p>
                          </div>
                        </td>
                      </tr>
                    ) : tickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-8 h-8 text-gray-300" />
                            <p className="text-gray-500 text-sm">No tickets found</p>
                          </div>
                        </td>
                      </tr>
                    ) : tickets.map((ticket, i) => (
                      <tr key={i} className="hover:bg-purple-50/30 transition-colors cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-purple-600">{ticket.ticket_id || ticket.id || '#N/A'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img 
                              src={getDummyAvatar(ticket.customer_name || ticket.customer || 'Unknown')}
                              alt={ticket.customer_name || ticket.customer || 'Customer'}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.src = "https://i.pravatar.cc/150?img=1";
                              }}
                            />
                            <span className="text-sm text-gray-900">{ticket.customer_name || ticket.customer || 'Unknown Customer'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{ticket.subject || ticket.title || 'No subject'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getTicketStatusColor(ticket.status)}`}>
                            {ticket.status === "Open" && <AlertCircle className="w-3 h-3" />}
                            {ticket.status === "In Progress" && <Clock className="w-3 h-3" />}
                            {ticket.status === "Resolved" && <CheckCircle className="w-3 h-3" />}
                            {ticket.status === "Closed" && <XCircle className="w-3 h-3" />}
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-center sm:justify-start">
                    <span>Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalTickets}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-medium">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

           <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
          <p className="text-sm text-gray-500">Tickets resolved over the last week</p>
        </div>
        
        {/* Modern Toggle Switch */}
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
          {['7D', '30D', '90D'].map((range) => (
            <button
              key={range}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === '7D' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              dy={5}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
              cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorResolved)"
              dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Tickets Resolved</span>
        </div>
      </div>
    </div>

            {/* Recent Conversations - Mobile Optimized */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Conversations</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-3 md:p-4">
                  <div className="flex items-start gap-2 md:gap-3">
                    <img src="https://i.pravatar.cc/150?img=8" className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" alt="John Doe" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm truncate">John Doe</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">2h ago</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        "Sarah was incredibly helpful and resolved my payment issue quickly. Excellent service!"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-3 md:p-4">
                  <div className="flex items-start gap-2 md:gap-3">
                    <img src="https://i.pravatar.cc/150?img=9" className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" alt="Emma Wilson" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm truncate">Emma Wilson</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">5h ago</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-3 h-3 text-gray-300" />
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        "Very professional and knowledgeable. Helped me set up my account step by step."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-3 md:p-4">
                  <div className="flex items-start gap-2 md:gap-3">
                    <img src="https://i.pravatar.cc/150?img=10" className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" alt="Michael Brown" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm truncate">Michael Brown</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">Yesterday</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        "Outstanding support! Sarah went above and beyond to solve my technical issue."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-medium">Technical Support</span>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-medium">Customer Service</span>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-medium">Problem Solving</span>
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs md:text-sm font-medium">Product Knowledge</span>
                <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs md:text-sm font-medium">Communication</span>
                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs md:text-sm font-medium">Billing Support</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Activity Log */}
            <div className="bg-white rounded-xl md:rounded-2xl border border-purple-100 p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 md:mb-6">Activity Log</h3>

              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div key={index} className="flex gap-3 md:gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'ticket' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'email' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'call' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'ticket' && <FileText className="w-3 h-3 md:w-4 md:h-4" />}
                        {activity.type === 'email' && <Mail className="w-3 h-3 md:w-4 md:h-4" />}
                        {activity.type === 'call' && <Phone className="w-3 h-3 md:w-4 md:h-4" />}
                        {activity.type === 'note' && <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />}
                      </div>

                      {index !== activityLog.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    <div className="flex-1 pb-6 min-w-0">
                      <p className="text-sm font-medium text-gray-900 break-words">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Notes Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Internal Notes</h3>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">+ Add</button>
              </div>
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-yellow-800 mb-1">Attention Required</div>
                  <div className="text-xs text-gray-700 mb-2 break-words">
                    Needs training on the new Billing Module v2.0. Update scheduled for next week.
                  </div>
                  <div className="text-xs text-gray-500">Added by Alex Admin • 2d ago</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-green-800 mb-1">Excellent Feedback</div>
                  <div className="text-xs text-gray-700 mb-2 break-words">
                    Excellent handling of the VIP client issue on Monday. Escalated to billing.
                  </div>
                  <div className="text-xs text-gray-500">Added by Team Lead • 5d ago</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Tickets Resolved</span>
                    <span className="font-semibold text-gray-900">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-1000" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-1000" style={{ width: "88%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold text-gray-900">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: animateProgress ? "96%" : "0%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Team Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">{agent.team}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Manager</span>
                  <button 
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer hover:underline"
                    onClick={() => setSelectedManagerId && setSelectedManagerId('mgr-1')} // Using mgr-1 which is Robert Fox from mockManagers
                  >
                    Robert Fox
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Team Members</span>
                  <span className="text-sm font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Work Schedule</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">9 AM - 5 PM</span>
                </div>
              </div>
            </div>

            {/* System Status Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Windows 11 Pro</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Desktop App v4.2.1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;