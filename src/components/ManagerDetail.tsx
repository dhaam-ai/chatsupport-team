import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  Users,
  TrendingUp,
  Clock,
  Star,
  MoreHorizontal,
  Calendar,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  MessageSquare,
  BarChart3,
  Activity,
  Award,
  MapPin,
} from 'lucide-react';

// Mock data for demonstration
const mockManager = {
  id: "M-001",
  name: "Jessica Martinez",
  email: "jessica.martinez@company.com",
  phone: "+1 (555) 987-6543",
  location: "San Francisco, CA",
  role: "Team Manager",
  team: "Customer Success",
  status: "active",
  avatar: "https://i.pravatar.cc/150?img=47",
  agentsCount: 12,
  ticketsHandled: 3847,
  avgResponseTime: "1.8h",
  performanceRating: 96,
  managerRating: 4.9,
};

const mockAgents = [
  {
    id: "A-001",
    name: "Sarah Anderson",
    email: "sarah.anderson@company.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "active",
    ticketsClosed: 1247,
    rating: 4.8,
    responseTime: "2.3h"
  },
  {
    id: "A-002",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "active",
    ticketsClosed: 892,
    rating: 4.6,
    responseTime: "2.8h"
  },
  {
    id: "A-003",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    avatar: "https://i.pravatar.cc/150?img=32",
    status: "active",
    ticketsClosed: 1103,
    rating: 4.7,
    responseTime: "2.1h"
  },
  {
    id: "A-004",
    name: "David Johnson",
    email: "david.johnson@company.com",
    avatar: "https://i.pravatar.cc/150?img=15",
    status: "inactive",
    ticketsClosed: 756,
    rating: 4.5,
    responseTime: "3.2h"
  },
  {
    id: "A-005",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    avatar: "https://i.pravatar.cc/150?img=25",
    status: "active",
    ticketsClosed: 1421,
    rating: 4.9,
    responseTime: "1.9h"
  },
];

const ManagerDetail = () => {
  const manager = mockManager;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [agentsPerPage] = useState(5);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Team performance data for chart
  const teamPerformanceData = [
    { day: 'Mon', resolved: 85 },
    { day: 'Tue', resolved: 92 },
    { day: 'Wed', resolved: 78 },
    { day: 'Thu', resolved: 96 },
    { day: 'Fri', resolved: 88 },
    { day: 'Sat', resolved: 71 },
    { day: 'Sun', resolved: 83 },
  ];

  const activityLog = [
    { type: 'meeting', text: 'Conducted team performance review', time: '1 hour ago' },
    { type: 'note', text: 'Approved vacation request for 2 team members', time: '3 hours ago' },
    { type: 'training', text: 'Led training session on new CRM features', time: '1 day ago' },
    { type: 'escalation', text: 'Resolved escalated customer complaint', time: '2 days ago' },
    { type: 'report', text: 'Submitted quarterly performance report', time: '3 days ago' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const agents = mockAgents;
  const totalAgents = mockAgents.length;
  const totalPages = Math.max(1, Math.ceil(totalAgents / agentsPerPage));
  const startIndex = (currentPage - 1) * agentsPerPage;
  const endIndex = Math.min(startIndex + agentsPerPage, totalAgents);
  const paginatedAgents = agents.slice(startIndex, endIndex);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 md:p-6">
        {/* Header Card - Mobile Optimized */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-purple-100 p-4 sm:p-6 md:p-8 mb-4 md:mb-6 shadow-sm">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex items-start gap-3 mb-4">
              <img 
                src={manager.avatar}
                alt={manager.name}
                className="w-16 h-16 rounded-xl ring-4 ring-purple-50"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">{manager.name}</h1>
                <p className="text-sm text-gray-600 mb-2">{manager.role}</p>
                <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold border ${
                  manager.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {manager.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{manager.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{manager.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{manager.location}</span>
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
                src={manager.avatar}
                alt={manager.name}
                className="w-24 h-24 rounded-2xl ring-4 ring-purple-50"
              />

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{manager.name}</h1>
                  
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    manager.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {manager.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{manager.role}</p>

                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {manager.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {manager.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {manager.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Joined Mar 10, 2023
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
              <div className="text-xl md:text-2xl font-bold text-purple-600">{manager.agentsCount}</div>
              <div className="text-xs text-gray-600 mt-1">Team Members</div>
            </div>

            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg md:rounded-xl flex-1 min-w-[100px]">
              <div className="text-xl md:text-2xl font-bold text-blue-600">{manager.ticketsHandled}</div>
              <div className="text-xs text-gray-600 mt-1">Tickets Handled</div>
            </div>

            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg md:rounded-xl flex-1 min-w-[100px]">
              <div className="text-xl md:text-2xl font-bold text-amber-600">{manager.managerRating}</div>
              <div className="text-xs text-gray-600 mt-1">Rating</div>
            </div>

            <div className="text-center p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg md:rounded-xl flex-1 min-w-[100px]">
              <div className="text-xl md:text-2xl font-bold text-green-600">{manager.performanceRating}%</div>
              <div className="text-xs text-gray-600 mt-1">Performance</div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Team Members and Charts */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Team Members Table */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Team Members</h2>
                    <p className="text-gray-500 text-sm mt-1">{totalAgents} agents in team</p>
                  </div>
                  
                  {/* Desktop Search */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search agents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden">
                {paginatedAgents.map((agent, i) => (
                  <div key={i} className="border-b border-gray-200 p-4 hover:bg-purple-50/30 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <img 
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm mb-1">{agent.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{agent.email}</div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.status)}`}>
                          {agent.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-sm font-bold text-purple-600">{agent.ticketsClosed}</div>
                        <div className="text-xs text-gray-500">Tickets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-amber-600">{agent.rating}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">{agent.responseTime}</div>
                        <div className="text-xs text-gray-500">Response</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm border-b border-purple-200/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Agent</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tickets</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Response</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAgents.map((agent, i) => (
                      <tr key={i} className="hover:bg-purple-50/30 transition-colors cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              src={agent.avatar}
                              alt={agent.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{agent.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{agent.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.status)}`}>
                            {agent.status === "active" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {agent.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-purple-600">{agent.ticketsClosed}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">{agent.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-900">{agent.responseTime}</span>
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
                    <span>Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalAgents}</span></span>
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

            {/* Team Performance Chart */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Team Performance Overview</h3>
                  <p className="text-sm text-gray-500">Team tickets resolved over the last week</p>
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
                  <AreaChart data={teamPerformanceData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorTeamResolved" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#colorTeamResolved)"
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
                  <span className="text-xs text-gray-600">Team Tickets Resolved</span>
                </div>
              </div>
            </div>

            {/* Team Achievements */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg font-bold text-gray-900">Team Achievements</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-3 md:p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm mb-1">Top Performer</div>
                      <p className="text-xs text-gray-700">Highest team satisfaction rating this quarter</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-3 md:p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm mb-1">Growth Leader</div>
                      <p className="text-xs text-gray-700">20% improvement in response time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Skills */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Management Skills</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-medium">Team Leadership</span>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-medium">Performance Management</span>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-medium">Strategic Planning</span>
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs md:text-sm font-medium">Conflict Resolution</span>
                <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs md:text-sm font-medium">Training & Development</span>
                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs md:text-sm font-medium">Resource Allocation</span>
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
                        activity.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'note' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'training' ? 'bg-green-100 text-green-600' :
                        activity.type === 'escalation' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.type === 'meeting' && <Users className="w-3 h-3 md:w-4 md:h-4" />}
                        {activity.type === 'note' && <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />}
                        {activity.type === 'training' && <Award className="w-3 h-3 md:w-4 md:h-4" />}
                        {activity.type === 'escalation' && <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />}
                        {activity.type === 'report' && <FileText className="w-3 h-3 md:w-4 md:h-4" />}
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-blue-800 mb-1">Leadership Update</div>
                  <div className="text-xs text-gray-700 mb-2 break-words">
                    Successfully implemented new team workflow process. Team efficiency up by 15%.
                  </div>
                  <div className="text-xs text-gray-500">Added by Director • 1d ago</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-green-800 mb-1">Excellent Performance</div>
                  <div className="text-xs text-gray-700 mb-2 break-words">
                    Outstanding quarterly results. Team exceeded all KPIs and customer satisfaction targets.
                  </div>
                  <div className="text-xs text-gray-500">Added by VP Operations • 1w ago</div>
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
                    <span className="text-gray-600">Team Productivity</span>
                    <span className="font-semibold text-gray-900">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-1000" style={{ width: animateProgress ? "94%" : "0%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Team Satisfaction</span>
                    <span className="font-semibold text-gray-900">91%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-1000" style={{ width: animateProgress ? "91%" : "0%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Goal Achievement</span>
                    <span className="font-semibold text-gray-900">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: animateProgress ? "98%" : "0%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Team Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">{manager.team}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Reports To</span>
                  <span className="text-sm font-semibold text-gray-900">VP Operations</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Team Size</span>
                  <span className="text-sm font-semibold text-gray-900">{manager.agentsCount} members</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Office Location</span>
                  <span className="text-sm font-semibold text-gray-900 text-right">{manager.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-purple-100 p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Active Agents</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{mockAgents.filter(a => a.status === 'active').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Avg Team Rating</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">4.7</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Monthly Growth</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetail;