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
import { useRef } from "react";

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
  fetchDepartmentHierarchy,
} from "../store/agentSlice";
import AgentQuickView from "./AgentQuickView";
import AgentDetail from "./AgentDetail";
import ManagerDetail from "./ManagerDetail";
import CreateAgentModal from "./CreateAgentModal";
import { ReusableTable, ResponsiveAgentTable as ResponsiveCardTable, FilterDropdown } from "chatsupport-ui";
import type { TableColumn } from "chatsupport-ui";
// import { ReusableTable } from "chatsupport-ui";
// import type { TableColumn } from "chatsupport-ui";
// import ResponsiveCardTable from "chatsupport-ui/src/components/ResponsiveAgentTable.tsx";
// import FilterDropdown from "chatsupport-ui/src/components/FilterDropdown.tsx";
// import ResponsiveCardTable from "chatsupport-ui/src/components/ResponsiveAgentTable";
// import FilterDropdown from "../../../chatsupport-ui/src/components/FilterDropdown";
import AgentCardView from "./AgentCardView";
import CustomDropdown from "./CustomDropDown";

import { apiClient } from "../services/apiClient";
import { fetchAgents } from "../store/agentSlice";
import EditAgentModal from "./EditAgentModal";
import { motion, AnimatePresence } from "framer-motion";
import { dummyManagers } from "./data/mockManagers";
import { createAgentActionHandlers } from "./utils/agentActions";
import { createTabData, buildFilterParams, groupAgentsByDepartment } from "./utils/filterUtils";
import { getStatusColor } from "./utils/statusColors";

// Tailwind-based style constants (replacing CSS modules)
const tw = {
  // Header - removed sticky, using flex-shrink-0 like TicketSystem
  "agent-system-header": "flex-shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4",
  "agent-system-header-content": "flex items-center justify-between gap-2 lg:gap-3",
  "agent-system-title": "text-lg lg:text-2xl font-bold text-gray-900 truncate",
  "agent-system-actions": "flex items-center gap-2 lg:gap-3 flex-shrink-0",
  
  // Buttons
  "more-actions-btn": "hidden sm:flex items-center py-1.5 px-3 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-gray-50",
  "add-agent-btn": "py-1.5 px-3 lg:px-4 bg-gradient-to-r from-[rgb(124,67,223)] to-purple-500 text-white rounded-lg text-sm font-semibold cursor-pointer transition-shadow flex items-center gap-1 hover:shadow-lg hover:shadow-purple-500/30",
  "add-agent-text": "hidden sm:inline",
  
  // Content - matching TicketSystem structure exactly
  "agent-system-content": "flex-1 min-h-0 overflow-hidden flex flex-col px-4 lg:px-6 py-4",
  "agent-system-container": "bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col min-h-0 overflow-hidden flex-1",
  
  // Tabs
  "agent-tabs-wrapper": "flex border-b border-gray-200 overflow-x-auto scroll-smooth flex-shrink-0",
  "agent-tabs-container": "flex gap-1 px-4",
  "agent-tab": "py-3 px-4 text-sm font-medium transition-all relative border-none bg-transparent cursor-pointer text-gray-600 whitespace-nowrap hover:text-gray-900",
  "agent-tab-active": "font-bold border-b-2 border-[rgb(124,67,223)] text-gray-900",
  "agent-tab-count": "ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100",
  "agent-tab-count-active": "text-gray-900 font-black",
  
  // Toolbar - simplified like TicketSystem
  "agent-toolbar": "p-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0",
  "agent-toolbar-content": "flex justify-between items-center w-full gap-2",
  "agent-toolbar-right": "flex items-center gap-3",
  
  // Toolbar button
  "toolbar-button": "flex items-center gap-2 py-2 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg cursor-pointer transition-colors whitespace-nowrap hover:bg-gray-50",
  "density-active": "ring-2 ring-gray-200",
  
  // Density dropdown
  "density-dropdown-menu": "absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] animate-[slideDown_0.2s_ease-out]",
  "density-menu-item": "block w-full text-left py-2 px-4 text-sm transition-all border-none bg-transparent cursor-pointer text-gray-700 first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50",
  "density-menu-item-active": "bg-purple-50 text-[rgb(124,67,223)] font-semibold",
  
  // Search
  "agent-search-container": "relative flex-1 lg:flex-none",
  "agent-search-icon": "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400",
  "agent-search-input": "pl-10 pr-4 py-2 w-full lg:w-64 border border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
  
  // View toggle
  "agent-view-toggle": "flex items-center gap-1 border border-gray-200 bg-gray-50 rounded-lg p-1 shadow-inner",
  "view-toggle-btn": "p-1.5 rounded-md transition-colors z-10 relative bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700",
  "view-toggle-btn-active": "text-purple-500",
  "view-toggle-active-bg": "absolute inset-0 bg-white rounded-md shadow-sm -z-10",
  "view-toggle-icon": "w-5 h-5",
  
  // Sections (responsive) - Using CSS classes for reliable switching
  "agent-managers-section": "flex-1 min-h-0 overflow-auto flex flex-col",
  "agent-desktop-view": "flex-1 min-h-0 overflow-auto flex flex-col",
  "agent-mobile-section": "flex-1 min-h-0 overflow-auto flex flex-col",
  "mobile-view-content": "overflow-y-auto flex-1",
  "mobile-cards-container": "flex flex-col gap-3 p-3 bg-[rgb(245,247,249)] min-h-0",
  "mobile-card": "bg-white rounded-lg border border-gray-200 shadow-sm",
  
  // Toolbar left - using CSS class desktopToolbar for reliable responsive behavior
  "agent-toolbar-left": "desktopToolbar items-center gap-2",
  
  // Pagination - flex-shrink-0 to prevent being squished
  "agent-pagination-wrapper": "flex-shrink-0 bg-white border-t border-gray-200 p-3 lg:px-4 flex items-center justify-between gap-2",
  "pagination-info": "text-sm text-gray-600",
  "pagination-controls": "flex items-center gap-1",
  "pagination-btn": "py-1 px-2 text-sm font-semibold rounded-lg transition-all bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-700 cursor-pointer hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
  "pagination-current": "py-1 px-3 rounded-lg font-bold text-sm bg-white/70 backdrop-blur-sm border-2 border-purple-500 text-[rgb(124,67,223)] shadow-sm",
  "pagination-select": "ml-4 py-1 px-2 border border-gray-300 rounded text-sm outline-none transition-all bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-green-500",
};

// Import column definitions
import { createAgentColumns } from "./columns/agentColumns";
import { createManagerColumns } from "./columns/managerColumns";
import ManagerListView from "./ManagerListview";
import { useLocation } from "react-router-dom";

const AgentSystem = () => {
  const dispatch = useDispatch<AppDispatch>();
  const containerRef = useRef<HTMLDivElement>(null);
  const deleteLoading = useSelector((state: RootState) => state.agents.loading);
  const departmentHierarchyEnabled = useSelector(
    (state: RootState) => state.agents.departmentHierarchyEnabled
  );
  
  const location = useLocation();
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

  // Responsive state - detect mobile/desktop like TicketSystem
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check on mount in case the value changed during navigation
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);

  // Add new state
  const [agentToEdit, setAgentToEdit] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  
  // Use Redux state for department hierarchy instead of hard-coded
  const [departmentHierarchy, setDepartmentHierarchy] = useState(departmentHierarchyEnabled);

  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [displayMode, setDisplayMode] = useState<"agents" | "managers">("agents");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
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

  // Create agent action handlers
  const { handleToggleActive, handleDeleteAgent, handleBlockAgent } = 
    createAgentActionHandlers(
      dispatch,
      agentActiveState,
      setAgentActiveState,
      pendingUpdates,
      setPendingUpdates,
      agents || []
    );

  // Create agent columns with handlers
  const agentColumns = useMemo(
    () =>
      createAgentColumns(
        agentActiveState,
        pendingUpdates,
        handleToggleActive,
        setAgentToEdit,
        setIsEditModalOpen,
        handleBlockAgent,
        setDeleteModalOpen,
        setAgentToDelete
      ),
    [
      agentActiveState,
      pendingUpdates,
      handleToggleActive,
      handleBlockAgent,
    ]
  );

  // Create manager columns
  const managerColumns = useMemo(() => createManagerColumns(), []);

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

  // Fetch departments and department hierarchy on component mount only
  useEffect(() => {
    // Initial fetch when component mounts
    dispatch(fetchDepartments("12345"));
    dispatch(fetchDepartmentHierarchy("12345"));
  }, [dispatch]);


  // Listen for department hierarchy changes from other micro-frontends
  useEffect(() => {
    // Custom event listener for cross-microfrontend communication
    const handleHierarchyChanged = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[Team] Department hierarchy changed event received:', customEvent.detail);
      
      // Clear API cache and refresh only when we get a hierarchy change event
      const { apiClient } = await import('../services/apiClient');
      apiClient.clearCache('department-hierarchy');
      console.log('[Team] API cache cleared for department-hierarchy');
      
      // Immediately update local state from event detail if available
      if (customEvent.detail && typeof customEvent.detail.enabled === 'boolean') {
        console.log('[Team] Setting local state from event:', customEvent.detail.enabled);
        setDepartmentHierarchy(customEvent.detail.enabled);
      }
      
      // Refetch from API for consistency
      dispatch(fetchDepartmentHierarchy("12345"));
    };

    // Storage event listener for localStorage changes (works across tabs)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'departmentHierarchyUpdated' || event.key === 'departmentHierarchyState') {
        console.log('[Team] Department hierarchy localStorage update detected');
        
        // Only sync with localStorage state, don't make API call on every storage change
        const storedState = localStorage.getItem('departmentHierarchyState');
        if (storedState !== null) {
          const newState = storedState === 'true';
          console.log('[Team] Syncing with localStorage state:', newState);
          setDepartmentHierarchy(newState);
        }
      }
    };

    // Check localStorage on mount for initial sync (no polling)
    const storedState = localStorage.getItem('departmentHierarchyState');
    if (storedState !== null) {
      const newState = storedState === 'true';
      console.log('[Team] Initial localStorage sync:', newState);
      setDepartmentHierarchy(newState);
    }

    // Listen on document as well for custom events
    window.addEventListener('departmentHierarchyChanged', handleHierarchyChanged);
    document.addEventListener('departmentHierarchyChanged', handleHierarchyChanged);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('departmentHierarchyChanged', handleHierarchyChanged);
      document.removeEventListener('departmentHierarchyChanged', handleHierarchyChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  // Sync local departmentHierarchy state with Redux state
  useEffect(() => {
    console.log('🔄 [Team] Redux departmentHierarchyEnabled changed to:', departmentHierarchyEnabled);
    setDepartmentHierarchy(departmentHierarchyEnabled);
  }, [departmentHierarchyEnabled]);

  // Refetch department hierarchy when route/location changes (navigating to team section)
  useEffect(() => {
    console.log('[Team] Route changed to:', location.pathname, '- clearing cache and refetching department hierarchy');
    
    const handleRouteChange = async () => {
      // Clear API cache to ensure fresh data when navigating
      const { apiClient } = await import('../services/apiClient');
      apiClient.clearCache('department-hierarchy');
      console.log('[Team] API cache cleared for department-hierarchy on route change');
      
      dispatch(fetchDepartmentHierarchy("12345"));
    };
    
    handleRouteChange();
  }, [location.pathname, dispatch]);

  // Listen for popstate events (browser back/forward) - only for navigation to team
  useEffect(() => {
    // Only run initial fetch when component mounts, don't constantly poll
    const initializeTeamRoute = async () => {
      if (window.location.href.includes('/team')) {
        console.log('[Team] Component initialized on team route, clearing cache and fetching hierarchy');
        
        // Clear API cache to ensure fresh data
        const { apiClient } = await import('../services/apiClient');
        apiClient.clearCache('department-hierarchy');
        console.log('[Team] API cache cleared for department-hierarchy on component init');
        
        dispatch(fetchDepartmentHierarchy("12345"));
      }
    };
    
    initializeTeamRoute();

    // Listen for popstate (back/forward button) - only trigger on navigation
    const handlePopState = async () => {
      console.log('[Team] Popstate event detected');
      if (window.location.href.includes('/team')) {
        console.log('[Team] Navigated to team via back/forward, clearing cache and fetching');
        const { apiClient } = await import('../services/apiClient');
        apiClient.clearCache('department-hierarchy');
        dispatch(fetchDepartmentHierarchy("12345"));
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [dispatch]);

  const tabData = useMemo(() => createTabData(agents || []), [agents]);

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
  const agentsByDepartment = useMemo(
    () => groupAgentsByDepartment(agents || []),
    [agents]
  );

  // Handle filter application
  const handleApplyFilters = useCallback(
    (filters: { status: string[]; priority: string[]; category: number[] }) => {
      setAppliedFilters(filters);
      // console.log("[AgentSystem] Applied filters:", filters);
      
      const statusFilters: string[] = [];
      if (activeTab === "active") {
        statusFilters.push("active");
      } else if (activeTab === "inactive") {
        statusFilters.push("inactive");
      } else if (activeTab === "block") {
        statusFilters.push("block", "blocked");
      }
      
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
    // console.log("[AgentSystem] Filters cleared");
    dispatch(
      fetchAgents({
        page: 1,
        limit,
        search,
        account_status: [],
      })
    );
  }, [dispatch, limit, search]);

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
    // console.log("Create modal open state changed:", isCreateModalOpen);
  }, [isCreateModalOpen]);

  const selectedAgent = (agents || []).find(
    (a) => (a.agent_id?.toString() || a.id) === selectedAgentId
  );

  const selectedManager = dummyManagers.find(
    (m) => m.id === selectedManagerId
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

  if (selectedManager) {
    return (
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedManagerId(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedManager.name}
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {selectedManager.role} • {selectedManager.team}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full font-semibold text-sm ${
                selectedManager.status === "active"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {selectedManager.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ManagerDetail
            manager={selectedManager}
            onBack={() => setSelectedManagerId(null)}
            onEdit={(manager) => {
              console.log("Edit manager:", manager);
              // Handle edit manager
            }}
            onDelete={(manager) => {
              console.log("Delete manager:", manager);
              // Handle delete manager
            }}
            onBlock={(managerId) => {
              console.log("Block manager:", managerId);
              // Handle block manager
            }}
            onAgentClick={(agentId) => {
              setSelectedManagerId(null);
              setSelectedAgentId(agentId);
            }}
          />
        </div>
      </div>
    );
  }

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
            <span
              className={`px-3 py-1.5 rounded-full font-semibold text-sm ${selectedAgent.account_status === "Active"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
                }`}
            >
              {selectedAgent.account_status || "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <AgentDetail selectedAgent={selectedAgent} setSelectedManagerId={setSelectedManagerId} />
          </Suspense>
        </div>
      </div>
      
    );
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <div className={tw["agent-system-header"]}>
        <div className={tw["agent-system-header-content"]}>
          <div className="flex items-center gap-3 flex-1">
            <h1 className={tw["agent-system-title"]}>{departmentHierarchy?"Team Management":"Agent Management"}</h1>
            
            {/* CONDITIONAL: Only show toggle if departmentHierarchy is true */}
            {departmentHierarchy && (
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
            )}
          </div>

          <div className={tw["agent-system-actions"]}>
            {/* Toggle for Department Hierarchy */}
          
            
            <button className={`${tw["more-actions-btn"]} bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors items-center gap-2`}>
              More Actions
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              className={`${tw["add-agent-btn"]}`}
              onClick={() => setShowCreateModal(true)}
            >
              <UserPlus className="w-4 h-4" />
              <span className={tw["add-agent-text"]}>
                {departmentHierarchy && displayMode === "managers" ? "Add Manager" : "Add Agent"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className={tw["agent-system-content"]}>
        <div className={tw["agent-system-container"]}>
          <div className={tw["agent-tabs-wrapper"]}>
            <div className={tw["agent-tabs-container"]}>
              {tabData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
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
                  className={`${tw["agent-tab"]} ${activeTab === tab.id ? tw["agent-tab-active"] : ""}`}
                >
                  {tab.label}
                  <span className={`${tw["agent-tab-count"]} ${activeTab === tab.id ? tw["agent-tab-count-active"] : "text-gray-500"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={tw["agent-toolbar"]}>
              <div className={tw["agent-toolbar-left"]}>
                <FilterDropdown 
                  onApplyFilters={handleApplyFilters}
                  onClearFilters={handleClearFilters}
                  statuses={statusOptions.map(s => s.value)}
                  priorities={[]}
                  categories={departmentOptions}
                  activeTab={activeTab}
                />
                
                <button className={tw["toolbar-button"]}>
                  <ColumnIcon />
                  <span>Columns</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="relative">
                  <button
                    data-density-button
                    onClick={() => setIsDensityDropdownOpen(!isDensityDropdownOpen)}
                    className={`${tw["toolbar-button"]} ${isDensityDropdownOpen ? tw["density-active"] : ""}`}
                  >
                    <DensityIcon />
                    <span>Density</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDensityDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDensityDropdownOpen && (
                    <div data-density-menu className={tw["density-dropdown-menu"]}>
                      {densityOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setDensity(option);
                            setIsDensityDropdownOpen(false);
                          }}
                          className={`${tw["density-menu-item"]} ${density === option ? tw["density-menu-item-active"] : ""}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={tw["agent-toolbar-right"]}>
                <div className={tw["agent-search-container"]}>
                  <Search className={tw["agent-search-icon"]} />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setSearch(e.target.value);
                    }}
                    className={tw["agent-search-input"]}
                  />
                </div>

                <div className={tw["agent-view-toggle"]}>
                  {["list", "grid"].map((mode: string) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as "grid" | "list")}
                      className={`${tw["view-toggle-btn"]} ${viewMode === mode ? tw["view-toggle-btn-active"] : ""}`}
                    >
                      {viewMode === mode && (
                        <motion.div
                          layoutId="activeTab"
                          className={tw["view-toggle-active-bg"]}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {mode === "list" ? (
                        <ListViewIcon className={tw["view-toggle-icon"]} />
                      ) : (
                        <GridViewIcon className={tw["view-toggle-icon"]} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
          </div>

          {/* DESKTOP VIEW - Uses CSS class to show/hide (prevents navigation layout issues) */}
          <div className="desktopOnly flex-1 min-h-0 overflow-hidden">
              {departmentHierarchy && displayMode === "managers" ? (
                /* MANAGERS VIEW WITH BOTH TABLE AND CARD LISTING */
                <div className={tw["agent-managers-section"]}>
                  {viewMode === "list" ? (
                    /* Manager Table List View */
                    <ReusableTable
                      columns={managerColumns}
                      rows={dummyManagers.map((manager) => ({
                        id: manager.id,
                        name: manager.name,
                        role: manager.role,
                        email: manager.email,
                        phone: manager.phone,
                        team: manager.team,
                        avatar: manager.avatar,
                        agentsCount: manager.agentsCount,
                        agents: manager.agents,
                        ticketsHandled: manager.ticketsHandled,
                        avgResponseTime: manager.avgResponseTime,
                        performanceRating: manager.performanceRating,
                        status: manager.status === "active" ? "Active" : "Inactive",
                        statusColor: manager.status === "active" 
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200",
                      }))}
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
                    /* Manager Card Grid View */
                    <ManagerListView
                      managers={dummyManagers}
                      loading={false}
                      onEdit={(manager) => {
                        console.log("Edit manager:", manager);
                      }}
                      onDelete={(manager) => {
                        console.log("Delete manager:", manager);
                      }}
                      onBlock={(managerId) => {
                        console.log("Block manager:", managerId);
                      }}
                      onManagerClick={(managerId) => {
                        setSelectedManagerId(managerId);
                      }}
                      onAgentClick={(agentId) => {
                        setSelectedAgentId(agentId);
                      }}
                    />
                  )}
                </div>
              ) : (
                /* AGENTS VIEW - Desktop Table/Grid */
                <div className={tw["agent-desktop-view"]}>
                  {viewMode === "list" ? (
                    <ReusableTable
                      columns={agentColumns}
                      rows={filteredAgents.map((agent) => {
                        const agentId = agent.agent_id?.toString() || agent.id || "";
                        return {
                          id: agentId,
                          agentId: agentId,
                          name: agent.name || "Unknown",
                          role: agent.role || "-",
                          email: agent.email || "",
                          phone: agent.phone || "",
                          team: agent.team || "-",
                          address: agent.address,
                          account_status: agent.account_status || "inactive",
                          statusColor: getStatusColor(agent.account_status || "inactive"),
                          ticketsClosed: agent.tickets_count || agent.ticketsClosed || 0,
                          avgResponseTime: agent.avgResponseTime || "-",
                          avatar: agent.avatar || "https://i.pravatar.cc/150?img=1",
                        };
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
              )}
          </div>

          {/* MOBILE VIEW - Uses CSS class to show/hide (prevents navigation layout issues) */}
          <div className="mobileOnly flex-1 min-h-0 overflow-hidden">
              {departmentHierarchy && displayMode === "managers" ? (
                /* Mobile Manager Cards */
              <div className={tw["mobile-view-content"]}>
                <div className={tw["mobile-cards-container"]}>
                  {dummyManagers.map((manager) => (
                    <div
                      key={manager.id}
                      className={tw["mobile-card"]}
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
            ) : (
              /* Mobile Agent View */
              viewMode === "list" ? (
                <ResponsiveCardTable
                  items={filteredAgents}
                  loading={loading}
                  selectedRows={selectedAgents}
                  onSelectRow={(agentId: string) => {
                    toggleAgentSelection(agentId);
                  }}
                  onSelectAll={() => {
                    toggleAllAgents();
                  }}
                  onRowClick={(agentId: string) => {
                    setSelectedAgentId(agentId);
                  }}
                  onEdit={(agent: any) => {
                    setAgentToEdit(agent);
                    setIsEditModalOpen(true);
                  }}
                  onBlock={(agentId: string) => {
                    handleBlockAgent(agentId);
                  }}
                  onDelete={(agent: any) => {
                    setDeleteModalOpen(true);
                    setAgentToDelete(agent);
                  }}
                  itemActiveState={{}}
                  pendingUpdates={new Set()}
                  onToggleActive={(agentId: string, isActive: boolean) => {
                    handleToggleActive(agentId, isActive);
                  }}
                  getStatusColor={getStatusColor}
                  fields={[
                    { label: 'Email', key: 'email' },
                    { label: 'Phone', key: 'phone' },
                    { label: 'Address', key: 'address' },
                  ]}
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
              )
            )}
          </div>

          {/* Pagination - Inside container like TicketSystem */}
          <div className={tw["agent-pagination-wrapper"]}>
            <div className={tw["pagination-info"]}>
              {(() => {
                const current = agents?.length ?? 0;
                const start = total > 0 ? (page - 1) * limit + 1 : 0;
                const end = total > 0 ? start + current - 1 : 0;
              return `${start}–${end} of ${total}`;
            })()}
          </div>
          <div className={tw["pagination-controls"]}>
            <button
              onClick={() => load({ page: 1, limit })}
              disabled={page <= 1}
              className={`${tw["pagination-btn"]} ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              «
            </button>
            <button
              onClick={() => load({ page: Math.max(1, page - 1), limit })}
              disabled={page <= 1}
              className={`${tw["pagination-btn"]} ${page <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              ‹
            </button>

            <div className={tw["pagination-current"]}>
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
              className={`${tw["pagination-btn"]} ${page >= Math.ceil((total || 0) / limit) ? "opacity-50 cursor-not-allowed" : ""}`}
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
              className={`${tw["pagination-btn"]} ${page >= Math.ceil((total || 0) / limit) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              »
            </button>

            <select
              value={limit}
              onChange={(e) => load({ page: 1, limit: Number(e.target.value) })}
              className={tw["pagination-select"]}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        {/* End of agent-system-container */}
      </div>
      {/* End of agent-system-content */}

      {showCreateModal && (
          <CreateAgentModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              toast.success("Agent created successfully!");
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
              dispatch(fetchAgents({ app_id: "12345" }));
            } catch (error) {
              toast.error("Failed to update agent");
            }
          }}
          appId="12345"
        />

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
                      handleDeleteAgent(agentToDelete.id).then((success) => {
                        if (success) {
                          setDeleteModalOpen(false);
                          setAgentToDelete(null);
                        }
                      });
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
  );
};

export default AgentSystem;
