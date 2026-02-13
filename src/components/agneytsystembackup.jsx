// AgentSystem.tsx

import React, {
  useState,
  lazy,
  Suspense,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Grid,
  List,
  Check,
  UserPlus,
  Download,
  ArrowLeft,
  XCircle,
  Copy,
  Edit,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  FilterIcon,
  DensityIcon,
  ColumnIcon,
  GridViewIcon,
  ListViewIcon,
  Editbutton,
  BlockIcon,
  DeleteIcon,
} from "../../public/assets/svg";

import useAgents, { Agent } from "../hooks/useAgents";
import { AppDispatch, RootState } from "../store/store";
import {
  updateAgentStatus,
  deleteAgent,
  updateAgent,
  fetchDepartments,
} from "../store/agentSlice";
import AgentQuickView from "./AgentQuickView";
import AgentDetail from "./AgentDetail";
import CreateAgentModal from "./CreateAgentModal";
import { ReusableTable } from "chatsupport-ui";
import type { TableColumn } from "chatsupport-ui";
import ResponsiveCardTable from "chatsupport-ui/src/components/ResponsiveAgentTable";
import FilterDropdown from "../../../chatsupport-ui/src/components/FilterDropdown";
import AgentCardView from "./AgentCardView";
import CustomDropdown from "./CustomDropDown";

import { apiClient } from "../services/apiClient";
import { fetchAgents } from "../store/agentSlice";
import EditAgentModal from "./EditAgentModal";
import { motion, AnimatePresence } from "framer-motion";
import { address } from "framer-motion/client";

const AgentSystem = () => {
  const dispatch = useDispatch<AppDispatch>();
  const deleteLoading = useSelector((state: RootState) => state.agents.loading);
  const {
    agents,
    loading,
    error,
    load,
    page,
    limit,
    total,
    search,
    setSearch,
  } = useAgents();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add new state at the top
  const [agentToEdit, setAgentToEdit] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

  // Define columns f
  // or the reusable table to match AgentTableView
  // Full Agent Columns Configuration for AgentSystem.tsx

  const agentColumns: TableColumn[] = [
    {
      key: "agent",
      label: "Agent",
      width: "16%",
      render: (value: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: "#2b2b2b" }}>
            #{row.agentId}
          </div>
          <div className="relative">
            <img
              src={row.avatar}
              className="w-10 h-10 rounded-full shadow-md object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
              alt={`${row.name}'s avatar`}
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div
              className="font-semibold transition-colors"
              style={{ color: "#2b2b2b" }}
            >
              {row.name}
            </div>

          </div>
        </div>
      ),
    },

    {
      key: "email",
      label: "Email",
      width: "13%",
      render: (value: any, row: any) => (
        <div
          className="flex text-[14px] font-medium items-center gap-1"
          style={{ color: "#2b2b2b" }}
          title={row.email?.length > 10 ? row.email : undefined}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">
            {row.email?.length > 15
              ? `${row.email.slice(0, 15)}...`
              : row.email}
          </span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      width: "11%",
      render: (value: any, row: any) => (
        <div
          className="flex text-[13px] font-medium items-center gap-1"
          style={{ color: "#2b2b2b" }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {row.phone}
        </div>
      ),
    },
    {
      key: "address",
      label: "Address",
      width: "14%",
      render: (value: any, row: any) => (
        <span
          className="text-sm font-medium"
          style={{ color: "#2b2b2b" }}
          title={row.address?.length > 15 ? row.address : undefined}
        >
          {row.address?.length > 15
            ? `${row.address.slice(0, 15)}...`
            : row.address}
        </span>
      ),
    },
    {
      key: "account_status",
      label: "Account Status",
      width: "11%",
      render: (value: any, row: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[14px] font-bold tracking-wider shadow-sm ${row.statusColor}`}
        >
          {row.account_status}
        </span>
      ),
    },
    {
      key: "tickets",
      label: "Tickets",
      width: "8%",
      render: (value: any, row: any) => (
        <div style={{ color: "#2b2b2b" }}>
          <span className="font-bold">{row.ticketsClosed}</span>
        
        </div>
      ),
    },
    {
      key: "avgResponseTime",
      label: "Avg. Response",
      width: "10%",
      render: (value: any, row: any) => (
        <span className="text-sm font-medium" style={{ color: "#2b2b2b" }}>
          {row.avgResponseTime}
        </span>
      ),
    },
    {
      key: "active",
      label: "Active",
      width: "5%",
      render: (value: any, row: any) => (
        <label
          className="relative inline-flex items-center cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={agentActiveState[row.id] || false}
            disabled={pendingUpdates.has(row.id)}
            onChange={(e) => {
              e.stopPropagation();
              handleToggleActive(row.id, !agentActiveState[row.id]);
            }}
            className="sr-only peer"
          />
          <div
            className={`w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${pendingUpdates.has(row.id) ? "opacity-50 cursor-not-allowed" : ""
              }`}
          ></div>
        </label>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "9%",
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAgentToEdit(row);
              setIsEditModalOpen(true);
            }}
            className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            style={{ color: "#2b2b2b" }}
            title="Edit"
          >
            <Editbutton></Editbutton>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBlockAgent(row.id);
            }}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            style={{ color: "#2b2b2b" }}
            title="Block"
          >
            <BlockIcon></BlockIcon>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalOpen(true);
              setAgentToDelete(row);
            }}
            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            style={{ color: "#2b2b2b" }}
            title="Delete"
          >
            <DeleteIcon></DeleteIcon>
          </button>
        </div>
      ),
    },
  ];

  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [displayMode, setDisplayMode] = useState<"agents" | "managers">("agents"); // Toggle between agents and managers
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isDepartmentHierarchyEnabled, setIsDepartmentHierarchyEnabled] = useState(false); // Toggle for department hierarchy
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const densityOptions = ["Comfortable", "Standard", "Compact"] as const;
  type Density = (typeof densityOptions)[number];

  // Department and Filter state
  const departments = useSelector((state: RootState) => state.agents.departments);
  const departmentsLoading = useSelector(
    (state: RootState) => state.agents.departmentsLoading
  );
  const [appliedFilters, setAppliedFilters] = useState<{
    status: string[];
    priority: string[];
    category: number[];
  } | null>(null);
  const [density, setDensity] = useState<Density>("Standard");
  const [isDensityDropdownOpen, setIsDensityDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [agentActiveState, setAgentActiveState] = useState<
    Record<string, boolean>
  >({});
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<any>(null);

  const densityClasses = useMemo(() => {
    switch (density) {
      case "Compact":
        return "py-1 text-sm";
      case "Standard":
        return "py-2.5 text-sm";
      case "Comfortable":
        return "py-4 text-sm";
      default:
        return "py-2.5 text-sm";
    }
  }, [density]);

  // Fetch departments on component mount
  useEffect(() => {
    dispatch(fetchDepartments("12345"));
  }, [dispatch]);

  const tabData = [
    { id: "all", label: "All", count: (agents || []).length },
    {
      id: "active",
      label: "Active",
      count: (agents || []).filter(
        (a) => (a.account_status || "").toLowerCase() === "active"
      ).length,
    },
    {
      id: "inactive",
      label: "Inactive",
      count: (agents || []).filter(
        (a) => (a.account_status || "").toLowerCase() === "inactive"
      ).length,
    },
    {
      id: "block",
      label: "Block",
      count: (agents || []).filter(
        (a) =>
          (a.account_status || "").toLowerCase() === "block" ||
          (a.account_status || "").toLowerCase() === "blocked"
      ).length,
    },
  ];

  useEffect(() => {
    if (!tabData.some((tab) => tab.id === activeTab)) {
      setActiveTab("active");
    }
  }, [activeTab, tabData]);

  // Initialize toggle state based on agent account_status
  useEffect(() => {
    const newState: Record<string, boolean> = {};
    agents?.forEach((agent) => {
      const agentId = agent.agent_id?.toString() || agent.id || "";
      newState[agentId] =
        (agent.account_status || "").toLowerCase() === "active";
    });
    setAgentActiveState(newState);
  }, [agents]);

  // Handle click outside for density dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const densityButton = document.querySelector('[data-density-button]');
      const densityMenu = document.querySelector('[data-density-menu]');
      
      if (densityButton && densityMenu && 
          !densityButton.contains(target) && 
          !densityMenu.contains(target)) {
        setIsDensityDropdownOpen(false);
      }
    };

    if (isDensityDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDensityDropdownOpen]);

  const filteredAgents = (agents || []).filter((agent) => {
    // Since server-side filtering is now handling most filters,
    // we only need to ensure activeTab filter is consistent
    // The server should already return filtered results
    if (activeTab === "all") return true;
    const status = (agent.account_status || "").toLowerCase();
    if (activeTab === "block") {
      return status === "block" || status === "blocked";
    }
    return status === activeTab.toLowerCase();
  });

  // Transform status options for FilterDropdown
  const statusOptions = useMemo(() => {
    return [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "block", label: "Block" },
      { value: "blocked", label: "Blocked" },
    ];
  }, []);

  // Transform department options for FilterDropdown
  const departmentOptions = useMemo(() => {
    return (departments || []).map((dept: any) => ({
      value: dept.id,
      label: dept.department_name || `Department ${dept.id}`,
    }));
  }, [departments]);

  // Helper function to organize agents by department
  const agentsByDepartment = useMemo(() => {
    const grouped: Record<string, { manager: any; agents: any[] }> = {};
    
    (agents || []).forEach((agent: any) => {
      const deptId = agent.department_id || agent.team || "unassigned";
      if (!grouped[deptId]) {
        grouped[deptId] = { manager: null, agents: [] };
      }
      
      // Check if this agent is a manager
      const isManager = (agent.role || "").toLowerCase().includes("manager") || 
                       (agent.role || "").toLowerCase().includes("lead");
      
      if (isManager) {
        grouped[deptId].manager = agent;
      } else {
        grouped[deptId].agents.push(agent);
      }
    });
    
    return grouped;
  }, [agents]);

  // Dummy manager data (static for now - will be replaced with API data later)
  const dummyManagers = useMemo(() => [
    {
      id: "mgr-001",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@company.com",
      phone: "945-234-8891",
      role: "Manager",
      team: "Customer Support",
      department: "Customer Support",
      avatar: "https://i.pravatar.cc/150?img=1",
      status: "active",
      agentsCount: 12,
      agents: [
        { id: "a1", avatar: "https://i.pravatar.cc/150?img=12", name: "Agent 1" },
        { id: "a2", avatar: "https://i.pravatar.cc/150?img=13", name: "Agent 2" },
        { id: "a3", avatar: "https://i.pravatar.cc/150?img=14", name: "Agent 3" },
        { id: "a4", avatar: "https://i.pravatar.cc/150?img=15", name: "Agent 4" },
        { id: "a5", avatar: "https://i.pravatar.cc/150?img=16", name: "Agent 5" },
        { id: "a6", avatar: "https://i.pravatar.cc/150?img=17", name: "Agent 6" },
        { id: "a7", avatar: "https://i.pravatar.cc/150?img=18", name: "Agent 7" },
        { id: "a8", avatar: "https://i.pravatar.cc/150?img=19", name: "Agent 8" },
        { id: "a9", avatar: "https://i.pravatar.cc/150?img=20", name: "Agent 9" },
        { id: "a10", avatar: "https://i.pravatar.cc/150?img=21", name: "Agent 10" },
        { id: "a11", avatar: "https://i.pravatar.cc/150?img=22", name: "Agent 11" },
        { id: "a12", avatar: "https://i.pravatar.cc/150?img=23", name: "Agent 12" },
      ],
      ticketsHandled: 324,
      avgResponseTime: "2.5 min",
      performanceRating: 98,
    },
    {
      id: "mgr-002",
      name: "David Chen",
      email: "david.chen@company.com",
      phone: "212-555-0199",
      role: "Manager",
      team: "Sales",
      department: "Sales",
      avatar: "https://i.pravatar.cc/150?img=2",
      status: "active",
      agentsCount: 24,
      agents: [
        { id: "b1", avatar: "https://i.pravatar.cc/150?img=24", name: "Agent 1" },
        { id: "b2", avatar: "https://i.pravatar.cc/150?img=25", name: "Agent 2" },
        { id: "b3", avatar: "https://i.pravatar.cc/150?img=26", name: "Agent 3" },
        { id: "b4", avatar: "https://i.pravatar.cc/150?img=27", name: "Agent 4" },
        { id: "b5", avatar: "https://i.pravatar.cc/150?img=28", name: "Agent 5" },
        { id: "b6", avatar: "https://i.pravatar.cc/150?img=29", name: "Agent 6" },
        { id: "b7", avatar: "https://i.pravatar.cc/150?img=30", name: "Agent 7" },
        { id: "b8", avatar: "https://i.pravatar.cc/150?img=31", name: "Agent 8" },
        { id: "b9", avatar: "https://i.pravatar.cc/150?img=32", name: "Agent 9" },
        { id: "b10", avatar: "https://i.pravatar.cc/150?img=33", name: "Agent 10" },
        { id: "b11", avatar: "https://i.pravatar.cc/150?img=34", name: "Agent 11" },
        { id: "b12", avatar: "https://i.pravatar.cc/150?img=35", name: "Agent 12" },
        { id: "b13", avatar: "https://i.pravatar.cc/150?img=36", name: "Agent 13" },
        { id: "b14", avatar: "https://i.pravatar.cc/150?img=37", name: "Agent 14" },
        { id: "b15", avatar: "https://i.pravatar.cc/150?img=38", name: "Agent 15" },
        { id: "b16", avatar: "https://i.pravatar.cc/150?img=39", name: "Agent 16" },
        { id: "b17", avatar: "https://i.pravatar.cc/150?img=40", name: "Agent 17" },
        { id: "b18", avatar: "https://i.pravatar.cc/150?img=41", name: "Agent 18" },
        { id: "b19", avatar: "https://i.pravatar.cc/150?img=42", name: "Agent 19" },
        { id: "b20", avatar: "https://i.pravatar.cc/150?img=43", name: "Agent 20" },
        { id: "b21", avatar: "https://i.pravatar.cc/150?img=44", name: "Agent 21" },
        { id: "b22", avatar: "https://i.pravatar.cc/150?img=45", name: "Agent 22" },
        { id: "b23", avatar: "https://i.pravatar.cc/150?img=46", name: "Agent 23" },
        { id: "b24", avatar: "https://i.pravatar.cc/150?img=47", name: "Agent 24" },
      ],
      ticketsHandled: 289,
      avgResponseTime: "3.2 min",
      performanceRating: 94,
    },
    {
      id: "mgr-003",
      name: "Amara Okafor",
      email: "amara.okafor@company.com",
      phone: "567-890-1234",
      role: "Manager",
      team: "Technical Support",
      department: "Technical Support",
      avatar: "https://i.pravatar.cc/150?img=3",
      status: "active",
      agentsCount: 8,
      agents: [
        { id: "c1", avatar: "https://i.pravatar.cc/150?img=48", name: "Agent 1" },
        { id: "c2", avatar: "https://i.pravatar.cc/150?img=49", name: "Agent 2" },
        { id: "c3", avatar: "https://i.pravatar.cc/150?img=50", name: "Agent 3" },
        { id: "c4", avatar: "https://i.pravatar.cc/150?img=51", name: "Agent 4" },
        { id: "c5", avatar: "https://i.pravatar.cc/150?img=52", name: "Agent 5" },
        { id: "c6", avatar: "https://i.pravatar.cc/150?img=53", name: "Agent 6" },
        { id: "c7", avatar: "https://i.pravatar.cc/150?img=54", name: "Agent 7" },
        { id: "c8", avatar: "https://i.pravatar.cc/150?img=55", name: "Agent 8" },
      ],
      ticketsHandled: 412,
      avgResponseTime: "1.8 min",
      performanceRating: 97,
    },
    {
      id: "mgr-004",
      name: "Marcus Williams",
      email: "marcus.williams@company.com",
      phone: "678-901-2345",
      role: "Lead Manager",
      team: "Operations",
      department: "Operations",
      avatar: "https://i.pravatar.cc/150?img=4",
      status: "active",
      agentsCount: 6,
      agents: [
        { id: "d1", avatar: "https://i.pravatar.cc/150?img=56", name: "Agent 1" },
        { id: "d2", avatar: "https://i.pravatar.cc/150?img=57", name: "Agent 2" },
        { id: "d3", avatar: "https://i.pravatar.cc/150?img=58", name: "Agent 3" },
        { id: "d4", avatar: "https://i.pravatar.cc/150?img=59", name: "Agent 4" },
        { id: "d5", avatar: "https://i.pravatar.cc/150?img=60", name: "Agent 5" },
        { id: "d6", avatar: "https://i.pravatar.cc/150?img=61", name: "Agent 6" },
      ],
      ticketsHandled: 567,
      avgResponseTime: "2.1 min",
      performanceRating: 96,
    },
  ], []);

  // Handle filter application
  const handleApplyFilters = useCallback(
    (filters: { status: string[]; priority: string[]; category: number[] }) => {
      setAppliedFilters(filters);
      console.log("[AgentSystem] Applied filters:", filters);
      // Fetch agents with the applied filters combined with activeTab
      const statusFilters: string[] = [];
      if (activeTab === "active") {
        statusFilters.push("active");
      } else if (activeTab === "inactive") {
        statusFilters.push("inactive");
      } else if (activeTab === "block") {
        statusFilters.push("block", "blocked");
      }
      
      // If user has selected specific statuses in filter, use those instead
      const finalStatuses = filters.status.length > 0 ? filters.status : statusFilters;
      
      dispatch(
        fetchAgents({
          page: 1,
          limit,
          search,
          account_status: finalStatuses,
          priority: filters.priority.length > 0 ? filters.priority : [],
          category: filters.category.length > 0 ? filters.category : [],
        })
      );
    },
    [dispatch, limit, search, activeTab]
  );

  // Handle filter clearing
  const handleClearFilters = useCallback(() => {
    setAppliedFilters(null);
    console.log("[AgentSystem] Filters cleared");
    // Fetch agents without filters
    dispatch(
      fetchAgents({
        page: 1,
        limit,
        search,
        account_status: [],
      })
    );
  }, [dispatch, limit, search]);

  // Helper function to build filters based on activeTab and appliedFilters
  const buildFilterParams = useCallback(
    (tabId: string = activeTab, filters?: typeof appliedFilters) => {
      const currentFilters = filters || appliedFilters;
      const statusFilters: string[] = [];

      // Add status filters from activeTab
      if (tabId === "active") {
        statusFilters.push("active");
      } else if (tabId === "inactive") {
        statusFilters.push("inactive");
      } else if (tabId === "block") {
        statusFilters.push("block", "blocked");
      }
      // "all" tab doesn't add any status filters from itself

      // Merge with applied filters if they have status filters
      const appliedStatuses = currentFilters?.status || [];
      const finalStatuses = appliedStatuses.length > 0 ? appliedStatuses : statusFilters;

      return {
        status: finalStatuses,
        priority: currentFilters?.priority || [],
        category: currentFilters?.category || [],
      };
    },
    [activeTab, appliedFilters]
  );

  const getStatusColor = (account_status: string) => {
    const normalizedStatus = (account_status || "").toLowerCase();
    const colors: Record<string, string> = {
      active: "bg-green-50 text-green-800 border border-green-200",
      block: "bg-red-50 text-red-800 border border-red-200",
      blocked: "bg-red-50 text-red-800 border border-red-200",
      inactive: "bg-blue-50 text-blue-800 border border-blue-200",
      manager: "bg-purple-50 text-purple-800 border border-purple-200",
      training: "bg-blue-50 text-blue-800 border border-blue-200",
      new: "bg-blue-50 text-blue-800 border border-blue-200",
    };
    return (
      colors[normalizedStatus] ||
      "bg-gray-50 text-gray-800 border border-gray-200"
    );
  };

  const toggleAgentSelection = (id: string) => {
    const newSelection = new Set(selectedAgents);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAgents(newSelection);
  };

  const toggleAllAgents = () => {
    if (
      selectedAgents.size === filteredAgents.length &&
      filteredAgents.length > 0
    ) {
      setSelectedAgents(new Set());
    } else {
      setSelectedAgents(
        new Set(
          filteredAgents
            .map((a) => a.agent_id?.toString() || a.id || "")
            .filter((id) => id)
        )
      );
    }
  };

  useEffect(() => {
    console.log("agnet columns ", agentColumns);
  }, [agentColumns]);

  const handleToggleActive = async (
    agentId: string,
    isActive: boolean
  ): Promise<boolean> => {
    try {
      const newStatus = isActive ? "active" : "inactive";

      setPendingUpdates((prev) => new Set(prev).add(agentId));

      const result = await dispatch(
        updateAgentStatus({
          agentId,
          account_status: newStatus,
        })
      );

      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });

      if (result.type.endsWith("/fulfilled")) {
        setAgentActiveState((prev) => ({
          ...prev,
          [agentId]: isActive,
        }));
        toast.success(`Agent account_status updated to ${newStatus}!`);
        return true;
      }

      setAgentActiveState((prev) => ({
        ...prev,
        [agentId]: !isActive,
      }));
      toast.error("Failed to update agent account_status");
      return false;
    } catch (error) {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });
      toast.error("Failed to update agent account_status");
      return false;
    }
  };

  const handleDeleteAgent = async (agentId: string): Promise<boolean> => {
    try {
      const result = await dispatch(
        deleteAgent({
          agentId,
        })
      );

      if (result.type.endsWith("/fulfilled")) {
        setDeleteModalOpen(false);
        setAgentToDelete(null);
        toast.success("Agent deleted successfully!");
        return true;
      }
      toast.error("Failed to delete agent");
      return false;
    } catch (error) {
      toast.error("Failed to delete agent");
      return false;
    }
  };

  const handleBlockAgent = async (agentId: string) => {
    try {
      const agent = agents?.find(
        (a) => (a.agent_id?.toString() || a.id) === agentId
      );
      const currentStatus = (agent?.account_status || "").toLowerCase();
      const newStatus = currentStatus === "block" ? "inactive" : "block";

      setPendingUpdates((prev) => new Set(prev).add(agentId));

      const result = await dispatch(
        updateAgentStatus({
          agentId: agentId,
          account_status: newStatus,
        })
      );

      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });

      if (result.type.endsWith("/fulfilled")) {
        toast.success(
          `Agent ${newStatus === "block" ? "blocked" : "unblocked"
          } successfully!`
        );
      } else {
        toast.error("Failed to update agent account_status");
      }
    } catch (error) {
      setPendingUpdates((prev) => {
        const next = new Set(prev);
        next.delete(agentId);
        return next;
      });
      toast.error("Failed to update agent account_status");
    }
  };

  useEffect(() => {
    console.log("Create modal open state changed:", isCreateModalOpen);
  }, [isCreateModalOpen]);

  const selectedAgent = (agents || []).find(
    (a) => (a.agent_id?.toString() || a.id) === selectedAgentId
  );

  const handleMouseEnter = (agentId: string) => {
    const agent = agents?.find(
      (a) => (a.agent_id?.toString() || a.id) === agentId
    );
    if (agent) {
      setHoveredAgent(agentId);
      const rowElement = document.getElementById(`row-${agentId}`);
      if (rowElement) {
        const { top, left, height } = rowElement.getBoundingClientRect();
        setPopoverPosition({ top: top + height + window.scrollY, left });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredAgent(null);
  };

  if (selectedAgent) {
    return (
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedAgentId(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedAgent.name}
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {selectedAgent.role} • {selectedAgent.team}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-full font-semibold text-sm ${selectedAgent.account_status === "Active"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                  }`}
              >
                {selectedAgent.account_status || "Inactive"}
              </span>
              <button className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200">
                <XCircle className="w-3.5 h-3.5" /> Deactivate User
              </button>
              <button className="flex items-center gap-2 text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm hover:bg-white transition-all">
                <Copy className="w-3.5 h-3.5 text-gray-400" /> Reset Password
              </button>
              <button className="flex items-center gap-2 bg-[#7c43df] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#6a36c4] transition-all">
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <AgentDetail />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between gap-2 lg:gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">Agent Management</h1>
            
            {/* Display Mode Toggle - Agents vs Managers */}
            <div className="flex p-1 bg-gray-100 rounded-lg ml-auto gap-0">
              <button
                onClick={() => setDisplayMode("agents")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  displayMode === "agents"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Agents
              </button>
              <button
                onClick={() => setDisplayMode("managers")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  displayMode === "managers"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Managers
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <button className="hidden sm:flex px-3 lg:px-4 py-1.5 lg:py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-xs lg:text-sm font-medium hover:bg-gray-50 transition-colors items-center gap-2">
              More Actions
              <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4" />
            </button>
            <button
              className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg text-xs lg:text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-1 lg:gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {displayMode === "agents" ? "Add Agent" : "Add Manager"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-hidden pb-2 p-0 md:p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 px-4 scrollbar-hide overflow-x-auto">
              {tabData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Build filters combining activeTab and applied filters
                    const filters = buildFilterParams(tab.id, appliedFilters);
                    dispatch(
                      fetchAgents({
                        page: 1,
                        limit,
                        search,
                        account_status: filters.status,
                        priority: filters.priority,
                        category: filters.category,
                      })
                    );
                  }}
                  className={`px-4 py-3 text-sm font-medium transition-all relative ${activeTab === tab.id
                      ? "font-bold border-b-2 border-purple-600 text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                        ? "bg-gray-100 text-gray-900 font-extrabold"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

 {/* Reduced padding from p-4 to py-2 px-4 to bring content closer vertically */}
<div className="py-2 px-4 border-b border-gray-100 bg-white">
  {/* Reduced gap from gap-4 to gap-2 */}
  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
    
    {/* Left Group: Action Buttons */}
    {/* Reduced gap between buttons from gap-2 to gap-1.5 */}
    {/* Added 'hidden lg:flex' to hide this entire section on mobile and show it on desktop */}
<div className="hidden lg:flex items-center gap-1.5 overflow-visible pb-1 lg:pb-0 relative z-40">
  <div className="relative z-50">
    <FilterDropdown 
      onApplyFilters={handleApplyFilters}
      onClearFilters={handleClearFilters}
      statuses={statusOptions.map(s => s.value)}
      priorities={[]}
      categories={departmentOptions}
      activeTab={activeTab}
    />
  </div>
  
  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 whitespace-nowrap">
    <ColumnIcon />
    <span>Columns</span>
    <ChevronDown className="w-4 h-4" />
  </button>

  <div className="relative z-50">
    <button
      data-density-button
      onClick={() => setIsDensityDropdownOpen(!isDensityDropdownOpen)}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 whitespace-nowrap ${
        isDensityDropdownOpen ? "ring-2 ring-purple-100" : ""
      }`}
    >
      <DensityIcon />
      <span>Density</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${isDensityDropdownOpen ? "rotate-180" : ""}`} />
    </button>

    {/* Density Dropdown Menu */}
    {isDensityDropdownOpen && (
      <div data-density-menu className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
        {densityOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
              setDensity(option);
              setIsDensityDropdownOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 text-sm transition-all first:rounded-t-lg last:rounded-b-lg ${
              density === option
                ? "bg-purple-50 text-purple-700 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
</div>

    {/* Right Group: Search and View Toggles */}
    <div className="flex items-center gap-3 w-full lg:w-auto">
      {/* Department Hierarchy Toggle */}
      {!isDepartmentHierarchyEnabled && (
        <button
          onClick={() => setIsDepartmentHierarchyEnabled(true)}
          className="px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          title="Enable Department Hierarchy"
        >
          Enable Departments
        </button>
      )}
      
      {isDepartmentHierarchyEnabled && (
        <button
          onClick={() => setIsDepartmentHierarchyEnabled(false)}
          className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          title="Disable Department Hierarchy"
        >
          Disable Departments
        </button>
      )}

      {/* Agents/Managers Toggle - Only show if hierarchy is enabled */}
      {isDepartmentHierarchyEnabled && (
        <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 rounded-lg p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
          {["agents", "managers"].map((mode: string) => (
            <button
              key={mode}
              onClick={() => setDisplayMode(mode as "agents" | "managers")}
              className={`relative px-3 py-1.5 rounded-md transition-colors duration-200 z-10 text-sm font-medium ${
                displayMode === mode ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {/* The Sliding Background */}
              {displayMode === mode && (
                <motion.div
                  layoutId="displayModeTab"
                  className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {mode === "agents" ? "Agents" : "Managers"}
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 lg:flex-none">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search agents..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setSearch(e.target.value);
          }}
          className="pl-10 pr-4 py-2 w-full lg:w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm transition-all"
        />
      </div>



      <div className="flex items-center gap-1 border border-gray-200 bg-gray-50 rounded-lg p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
  {["list", "grid"].map((mode: string) => (
    <button
      key={mode}
      onClick={() => setViewMode(mode as "grid" | "list")}
      className={`relative p-1.5 rounded-md transition-colors duration-200 z-10 ${
        viewMode === mode ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {/* The Sliding Background */}
      {viewMode === mode && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white rounded-md shadow-sm -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      {mode === "list" ? (
        <ListViewIcon className="w-5 h-5" />
      ) : (
        <GridViewIcon className="w-5 h-5" />
      )}
    </button>
  ))}
</div>

            {/* Desktop Table View - Hidden on mobile */}
            {displayMode === "agents" || !isDepartmentHierarchyEnabled ? (
              <div className="hidden lg:block">
                {viewMode === "list" ? (
                <ReusableTable
                  columns={agentColumns}
                  rows={filteredAgents.map((agent) => {
                    const agentId = agent.agent_id?.toString() || agent.id || "";
                    const rowData = {
                      id: agentId,
                      agentId: agentId,
                      name: agent.name || "Unknown",
                      role: agent.role || "-",
                      email: agent.email || "",
                      phone: agent.phone || "",
                      team: agent.team || "-",
                      address: agent.address,
                      account_status: agent.account_status || "inactive",
                      statusColor: getStatusColor(
                        agent.account_status || "inactive"
                      ),
                      ticketsClosed:
                        agent.tickets_count || agent.ticketsClosed || 0,
                      avgResponseTime: agent.avgResponseTime || "-",
                      avatar: agent.avatar || "https://i.pravatar.cc/150?img=1",
                    };
                    return rowData;
                  })}
                  loading={loading}
                  limit={limit}
                  densityClasses={densityClasses}
                  selectedRows={selectedAgents}
                  onSelectRow={toggleAgentSelection}
                  onSelectAll={toggleAllAgents}
                  onRowClick={setSelectedAgentId}
                  keyField="id"
                />
              ) : (
                <AgentCardView
                  agents={agents as any}
                  loading={loading}
                  limit={limit}
                  filteredAgents={filteredAgents as any}
                  getStatusColor={getStatusColor}
                  setSelectedAgentId={setSelectedAgentId}
                  onEdit={(agent) => {
                    setAgentToEdit(agent as any);
                    setIsEditModalOpen(true);
                  }}
                  onBlock={handleBlockAgent}
                  onDelete={(agent) => {
                    setDeleteModalOpen(true);
                    setAgentToDelete(agent as any);
                  }}
                />
              )}
            </div>
            ) : isDepartmentHierarchyEnabled && displayMode === "managers" ? (
              /* MANAGERS VIEW */
              <div className="hidden lg:block">
                {viewMode === "list" ? (
                <ReusableTable
                  columns={[
                    {
                      key: "manager",
                      label: "Manager",
                      width: "16%",
                      render: (value: any, row: any) => (
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: "#2b2b2b" }}>
                            #{row.id}
                          </div>
                          <div className="relative">
                            <img
                              src={row.avatar}
                              className="w-10 h-10 rounded-full shadow-md object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                              alt={`${row.name}'s avatar`}
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <div
                              className="font-semibold transition-colors"
                              style={{ color: "#2b2b2b" }}
                            >
                              {row.name}
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "email",
                      label: "Email",
                      width: "13%",
                      render: (value: any, row: any) => (
                        <div
                          className="flex text-[14px] font-medium items-center gap-1"
                          style={{ color: "#2b2b2b" }}
                          title={row.email?.length > 10 ? row.email : undefined}
                        >
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="truncate">
                            {row.email?.length > 15
                              ? `${row.email.slice(0, 15)}...`
                              : row.email}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "phone",
                      label: "Phone",
                      width: "11%",
                      render: (value: any, row: any) => (
                        <div
                          className="flex text-[13px] font-medium items-center gap-1"
                          style={{ color: "#2b2b2b" }}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {row.phone}
                        </div>
                      ),
                    },
                    {
                      key: "team",
                      label: "Team",
                      width: "12%",
                      render: (value: any, row: any) => (
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#2b2b2b" }}
                          title={row.team?.length > 15 ? row.team : undefined}
                        >
                          {row.team?.length > 15
                            ? `${row.team.slice(0, 15)}...`
                            : row.team}
                        </span>
                      ),
                    },
                    {
                      key: "agentsCount",
                      label: "Assigned Agents",
                      width: "18%",
                      render: (value: any, row: any) => {
                        const displayAgents = (row.agents || []).slice(0, 3);
                        const remainingCount = Math.max(0, (row.agents || []).length - 3);
                        
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center -space-x-2">
                              {displayAgents.map((agent: any, index: number) => (
                                <img
                                  key={agent.id}
                                  src={agent.avatar}
                                  alt={agent.name}
                                  className="w-8 h-8 rounded-full border-2 border-white shadow-md object-cover"
                                  title={agent.name}
                                />
                              ))}
                              {remainingCount > 0 && (
                                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700 shadow-md">
                                  +{remainingCount}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {row.agentsCount} Agents
                            </span>
                          </div>
                        );
                      },
                    },
                    {
                      key: "ticketsHandled",
                      label: "Tickets",
                      width: "9%",
                      render: (value: any, row: any) => (
                        <span className="text-sm font-medium" style={{ color: "#2b2b2b" }}>
                          {row.ticketsHandled}
                        </span>
                      ),
                    },
                    {
                      key: "performanceRating",
                      label: "Rating",
                      width: "8%",
                      render: (value: any, row: any) => (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: "#7c43df" }}>
                            {row.performanceRating}%
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      label: "Status",
                      width: "10%",
                      render: (value: any, row: any) => (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[14px] font-bold tracking-wider shadow-sm ${row.statusColor}`}
                        >
                          {row.status}
                        </span>
                      ),
                    },
                    {
                      key: "actions",
                      label: "Actions",
                      width: "13%",
                      render: (value: any, row: any) => (
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            style={{ color: "#2b2b2b" }}
                            title="Edit"
                          >
                            <Editbutton></Editbutton>
                          </button>
                          <button
                            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            style={{ color: "#2b2b2b" }}
                            title="View Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            style={{ color: "#2b2b2b" }}
                            title="Delete"
                          >
                            <DeleteIcon></DeleteIcon>
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  rows={dummyManagers.map((manager) => {
                    return {
                      id: manager.id,
                      name: manager.name,
                      role: manager.role,
                      email: manager.email,
                      phone: manager.phone,
                      team: manager.team,
                      avatar: manager.avatar,
                      agentsCount: manager.agentsCount,
                      ticketsHandled: manager.ticketsHandled,
                      avgResponseTime: manager.avgResponseTime,
                      performanceRating: manager.performanceRating,
                      status: manager.status === "active" ? "Active" : "Inactive",
                      statusColor: manager.status === "active" 
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200",
                    };
                  })}
                  loading={false}
                  limit={10}
                  densityClasses={densityClasses}
                  selectedRows={new Set()}
                  onSelectRow={() => {}}
                  onSelectAll={() => {}}
                  onRowClick={() => {}}
                  keyField="id"
                />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
                  {dummyManagers.map((manager) => (
                    <div
                      key={manager.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Manager Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <img
                            src={manager.avatar}
                            alt={manager.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {manager.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {manager.role}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                              {manager.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Manager Details */}
                      <div className="px-4 py-4 space-y-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{manager.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">{manager.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Team</p>
                            <p className="text-sm font-medium text-gray-900">{manager.team}</p>
                          </div>
                        </div>
                      </div>

                      {/* Manager Stats */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 grid grid-cols-4 gap-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Agents</p>
                          <p className="text-lg font-bold text-gray-900">{manager.agentsCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Tickets</p>
                          <p className="text-lg font-bold text-gray-900">{manager.ticketsHandled}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Response</p>
                          <p className="text-lg font-bold text-gray-900">{manager.avgResponseTime}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Rating</p>
                          <p className="text-lg font-bold text-purple-600">{manager.performanceRating}%</p>
                        </div>
                      </div>

                      {/* Manager Actions */}
                      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                        <button
                          className="flex-1 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button
                          className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            ) : isDepartmentHierarchyEnabled && displayMode === "managers" ? (
              /* MANAGERS VIEW */
              <div className="hidden lg:block">
                {viewMode === "list" ? (
                <ReusableTable
                  columns={[
                    {
                      key: "manager",
                      label: "Manager",
                      width: "16%",
                      render: (value: any, row: any) => (
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: "#2b2b2b" }}>
                            #{row.id}
                          </div>
                          <div className="relative">
                            <img
                              src={row.avatar}
                              className="w-10 h-10 rounded-full shadow-md object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                              alt={`${row.name}'s avatar`}
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <div
                              className="font-semibold transition-colors"
                              style={{ color: "#2b2b2b" }}
                            >
                              {row.name}
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "email",
                      label: "Email",
                      width: "13%",
                      render: (value: any, row: any) => (
                        <div
                          className="flex text-[14px] font-medium items-center gap-1"
                          style={{ color: "#2b2b2b" }}
                          title={row.email?.length > 10 ? row.email : undefined}
                        >
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="truncate">
                            {row.email?.length > 15
                              ? `${row.email.slice(0, 15)}...`
                              : row.email}
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "phone",
                      label: "Phone",
                      width: "11%",
                      render: (value: any, row: any) => (
                        <div
                          className="flex text-[13px] font-medium items-center gap-1"
                          style={{ color: "#2b2b2b" }}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {row.phone}
                        </div>
                      ),
                    },
                    {
                      key: "team",
                      label: "Team",
                      width: "12%",
                      render: (value: any, row: any) => (
                        <span
                          className="text-sm font-medium"
                          style={{ color: "#2b2b2b" }}
                          title={row.team?.length > 15 ? row.team : undefined}
                        >
                          {row.team?.length > 15
                            ? `${row.team.slice(0, 15)}...`
                            : row.team}
                        </span>
                      ),
                    },
                    {
                      key: "agentsCount",
                      label: "Assigned Agents",
                      width: "18%",
                      render: (value: any, row: any) => {
                        const displayAgents = (row.agents || []).slice(0, 3);
                        const remainingCount = Math.max(0, (row.agents || []).length - 3);
                        
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center -space-x-2">
                              {displayAgents.map((agent: any, index: number) => (
                                <img
                                  key={agent.id}
                                  src={agent.avatar}
                                  alt={agent.name}
                                  className="w-8 h-8 rounded-full border-2 border-white shadow-md object-cover"
                                  title={agent.name}
                                />
                              ))}
                              {remainingCount > 0 && (
                                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700 shadow-md">
                                  +{remainingCount}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {row.agentsCount} Agents
                            </span>
                          </div>
                        );
                      },
                    },
                    {
                      key: "ticketsHandled",
                      label: "Tickets",
                      width: "9%",
                      render: (value: any, row: any) => (
                        <span className="text-sm font-medium" style={{ color: "#2b2b2b" }}>
                          {row.ticketsHandled}
                        </span>
                      ),
                    },
                    {
                      key: "performanceRating",
                      label: "Rating",
                      width: "8%",
                      render: (value: any, row: any) => (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: "#7c43df" }}>
                            {row.performanceRating}%
                          </span>
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      label: "Status",
                      width: "10%",
                      render: (value: any, row: any) => (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[14px] font-bold tracking-wider shadow-sm ${row.statusColor}`}
                        >
                          {row.status}
                        </span>
                      ),
                    },
                    {
                      key: "actions",
                      label: "Actions",
                      width: "13%",
                      render: (value: any, row: any) => (
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            style={{ color: "#2b2b2b" }}
                            title="Edit"
                          >
                            <Editbutton></Editbutton>
                          </button>
                          <button
                            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            style={{ color: "#2b2b2b" }}
                            title="View Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            style={{ color: "#2b2b2b" }}
                            title="Delete"
                          >
                            <DeleteIcon></DeleteIcon>
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  rows={dummyManagers.map((manager) => {
                    return {
                      id: manager.id,
                      name: manager.name,
                      role: manager.role,
                      email: manager.email,
                      phone: manager.phone,
                      team: manager.team,
                      avatar: manager.avatar,
                      agents: manager.agents,
                      agentsCount: manager.agentsCount,
                      ticketsHandled: manager.ticketsHandled,
                      avgResponseTime: manager.avgResponseTime,
                      performanceRating: manager.performanceRating,
                      status: manager.status === "active" ? "Active" : "Inactive",
                      statusColor: manager.status === "active" 
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200",
                    };
                  })}
                  loading={false}
                  limit={10}
                  densityClasses={densityClasses}
                  selectedRows={new Set()}
                  onSelectRow={() => {}}
                  onSelectAll={() => {}}
                  onRowClick={() => {}}
                  keyField="id"
                />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-4">
                  {dummyManagers.map((manager) => (
                    <div
                      key={manager.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Manager Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <img
                            src={manager.avatar}
                            alt={manager.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {manager.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {manager.role}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                              {manager.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Manager Details */}
                      <div className="px-4 py-4 space-y-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{manager.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">{manager.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Team</p>
                            <p className="text-sm font-medium text-gray-900">{manager.team}</p>
                          </div>
                        </div>
                      </div>

                      {/* Manager Stats */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 grid grid-cols-4 gap-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Agents</p>
                          <p className="text-lg font-bold text-gray-900">{manager.agentsCount}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Tickets</p>
                          <p className="text-lg font-bold text-gray-900">{manager.ticketsHandled}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Response</p>
                          <p className="text-lg font-bold text-gray-900">{manager.avgResponseTime}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Rating</p>
                          <p className="text-lg font-bold text-purple-600">{manager.performanceRating}%</p>
                        </div>
                      </div>

                      {/* Manager Actions */}
                      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
                        <button
                          className="flex-1 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 inline mr-1" /> Edit
                        </button>
                        <button
                          className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            ) : isDepartmentHierarchyEnabled && displayMode === "managers" ? (
              /* MOBILE MANAGERS VIEW */
              <div className="lg:hidden overflow-y-auto">
                <div className="space-y-3 p-3">
                  {dummyManagers.map((manager) => (
                    <div
                      key={manager.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      {/* Manager Card */}
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={manager.avatar}
                            alt={manager.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900">
                              {manager.name}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {manager.role}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                            Active
                          </span>
                        </div>

                        {/* Manager Contact Info */}
                        <div className="space-y-2 mb-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate text-xs">{manager.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-xs">{manager.phone}</span>
                          </div>
                        </div>

                        {/* Manager Stats */}
                        <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600">Agents</p>
                            <p className="font-bold text-gray-900">{manager.agentsCount}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600">Tickets</p>
                            <p className="font-bold text-gray-900">{manager.ticketsHandled}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600">Resp.</p>
                            <p className="text-xs font-bold text-gray-900">{manager.avgResponseTime}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600">Rating</p>
                            <p className="font-bold text-purple-600">{manager.performanceRating}%</p>
                          </div>
                        </div>

                        {/* Manager Actions */}
                        <div className="flex items-center gap-2">
                          <button className="flex-1 px-2 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                            Edit
                          </button>
                          <button className="flex-1 px-2 py-2 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
        </div>

        {/* Pagination Footer - Only for agents view */}
        {displayMode === "agents" && (
        <div className="bg-white rounded-b-lg lg:rounded-b-xl border border-gray-200 px-3 lg:px-4 py-2 lg:py-3 flex items-center justify-between gap-2 mt-0 flex-wrap">
          <div className="text-xs lg:text-sm text-gray-600 order-3 lg:order-1 basis-full lg:basis-auto text-center lg:text-left">
            {(() => {
              const current = agents?.length ?? 0;
              const start = total > 0 ? (page - 1) * limit + 1 : 0;
              const end = total > 0 ? start + current - 1 : 0;
              return `${start}–${end} of ${total}`;
            })()}
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => load({ page: 1, limit })}
              disabled={page <= 1}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              «
            </button>
            <button
              onClick={() => load({ page: Math.max(1, page - 1), limit })}
              disabled={page <= 1}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              ‹
            </button>

            <div className="px-3 py-1 rounded-lg font-bold text-sm bg-white/70 backdrop-blur-md border-2 border-purple-400 text-purple-700 shadow-sm">
              {page}
            </div>

            <button
              onClick={() =>
                load({
                  page: Math.min(
                    Math.max(1, Math.ceil((total || 1) / limit)),
                    page + 1
                  ),
                  limit,
                })
              }
              disabled={page >= Math.ceil((total || 0) / limit)}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page >= Math.ceil((total || 0) / limit)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              ›
            </button>
            <button
              onClick={() =>
                load({
                  page: Math.max(1, Math.ceil((total || 1) / limit)),
                  limit,
                })
              }
              disabled={page >= Math.ceil((total || 0) / limit)}
              className={`px-2 py-1 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-md border border-gray-200 text-gray-700 hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none ${page >= Math.ceil((total || 0) / limit)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }`}
            >
              »
            </button>

            <select
              value={limit}
              onChange={(e) => load({ page: 1, limit: Number(e.target.value) })}
              className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        )}

        {showCreateModal && (
          <CreateAgentModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              toast.success("Agent created successfully!");
              // Refresh agents list
              dispatch(fetchAgents({ app_id: "12345" }));
            }}
            apiClient={apiClient}
            CustomDropdown={CustomDropdown}
          />
        )}

        <EditAgentModal
          agent={agentToEdit}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setAgentToEdit(null);
          }}
          onSave={async (updatedAgent) => {
            try {
              await dispatch(updateAgent(updatedAgent as any)).unwrap();
              toast.success("Agent updated successfully!");
              dispatch(fetchAgents({ app_id: "12345" })); // Refresh list
            } catch (error) {
              toast.error("Failed to update agent");
            }
          }}
          appId="12345"
        />

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h2 className="text-lg font-semibold mb-2">Delete Agent</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{agentToDelete?.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setAgentToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (agentToDelete) {
                      handleDeleteAgent(agentToDelete.id);
                    }
                  }}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default AgentSystem;
