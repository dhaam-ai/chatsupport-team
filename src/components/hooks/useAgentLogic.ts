import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  updateAgent,
  fetchDepartments,
  fetchAgents,
} from "../../store/agentSlice";
import useAgents from "../../hooks/useAgents";
import toast from "react-hot-toast";
import {
  createAgentActionHandlers,
} from "../utils/agentActions";
import {
  createTabData,
  buildFilterParams,
  groupAgentsByDepartment,
} from "../utils/filterUtils";
import { getStatusColor } from "../utils/statusColors";

export const useAgentLogic = () => {
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

  // UI State
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [displayMode, setDisplayMode] = useState<"agents" | "managers">(
    "agents"
  );
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(
    new Set()
  );
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  // Density options
  const densityOptions = ["Comfortable", "Standard", "Compact"] as const;
  type Density = typeof densityOptions[number];
  const [density, setDensity] = useState<Density>("Standard");
  const [isDensityDropdownOpen, setIsDensityDropdownOpen] = useState(false);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<any>(null);
  const [agentToDelete, setAgentToDelete] = useState<any>(null);

  // Agent State
  const [agentActiveState, setAgentActiveState] = useState<
    Record<string, boolean>
  >({});
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(
    new Set()
  );

  // Expanded departments
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set()
  );

  // Filter State
  const [appliedFilters, setAppliedFilters] = useState<{
    status: string[];
    priority: string[];
    category: number[];
  } | null>(null);

  // Redux State
  const departments = useSelector(
    (state: RootState) => state.agents.departments
  );
  const departmentsLoading = useSelector(
    (state: RootState) => state.agents.departmentsLoading
  );

  // Create action handlers
  const { handleToggleActive, handleDeleteAgent, handleBlockAgent } =
    createAgentActionHandlers(
      dispatch,
      agentActiveState,
      setAgentActiveState,
      pendingUpdates,
      setPendingUpdates,
      agents || []
    );

  // Memoized density classes
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

  // Fetch departments on mount
  useEffect(() => {
    dispatch(fetchDepartments("12345"));
  }, [dispatch]);

  // Tab data
  const tabData = useMemo(() => createTabData(agents || []), [agents]);

  // Validate active tab
  useEffect(() => {
    if (!tabData.some((tab) => tab.id === activeTab)) {
      setActiveTab("active");
    }
  }, [activeTab, tabData]);

  // Initialize agent active state
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
      const densityButton = document.querySelector("[data-density-button]");
      const densityMenu = document.querySelector("[data-density-menu]");

      if (
        densityButton &&
        densityMenu &&
        !densityButton.contains(target) &&
        !densityMenu.contains(target)
      ) {
        setIsDensityDropdownOpen(false);
      }
    };

    if (isDensityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDensityDropdownOpen]);

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return (agents || []).filter((agent) => {
      if (activeTab === "all") return true;
      const status = (agent.account_status || "").toLowerCase();
      if (activeTab === "block") {
        return status === "block" || status === "blocked";
      }
      return status === activeTab.toLowerCase();
    });
  }, [agents, activeTab]);

  // Status options
  const statusOptions = useMemo(() => {
    return [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "block", label: "Block" },
      { value: "blocked", label: "Blocked" },
    ];
  }, []);

  // Department options
  const departmentOptions = useMemo(() => {
    return (departments || []).map((dept: any) => ({
      value: dept.id,
      label: dept.department_name || `Department ${dept.id}`,
    }));
  }, [departments]);

  // Agents by department
  const agentsByDepartment = useMemo(
    () => groupAgentsByDepartment(agents || []),
    [agents]
  );

  // Handle apply filters
  const handleApplyFilters = useCallback(
    (filters: {
      status: string[];
      priority: string[];
      category: number[];
    }) => {
      setAppliedFilters(filters);
      console.log("[AgentSystem] Applied filters:", filters);

      const statusFilters: string[] = [];
      if (activeTab === "active") {
        statusFilters.push("active");
      } else if (activeTab === "inactive") {
        statusFilters.push("inactive");
      } else if (activeTab === "block") {
        statusFilters.push("block", "blocked");
      }

      const finalStatuses =
        filters.status.length > 0 ? filters.status : statusFilters;

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

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setAppliedFilters(null);
    console.log("[AgentSystem] Filters cleared");
    dispatch(
      fetchAgents({
        page: 1,
        limit,
        search,
        account_status: [],
      })
    );
  }, [dispatch, limit, search]);

  // Toggle agent selection
  const toggleAgentSelection = useCallback((id: string) => {
    setSelectedAgents((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  }, []);

  // Toggle all agents
  const toggleAllAgents = useCallback(() => {
    setSelectedAgents((prev) => {
      if (
        prev.size === filteredAgents.length &&
        filteredAgents.length > 0
      ) {
        return new Set();
      } else {
        return new Set(
          filteredAgents
            .map((a) => a.agent_id?.toString() || a.id || "")
            .filter((id) => id)
        );
      }
    });
  }, [filteredAgents]);

  // Mouse handlers for hover
  const handleMouseEnter = useCallback(
    (agentId: string) => {
      const agent = agents?.find(
        (a) => (a.agent_id?.toString() || a.id) === agentId
      );
      if (agent) {
        setHoveredAgent(agentId);
        const rowElement = document.getElementById(`row-${agentId}`);
        if (rowElement) {
          const { top, left, height } = rowElement.getBoundingClientRect();
          setPopoverPosition({
            top: top + height + window.scrollY,
            left,
          });
        }
      }
    },
    [agents]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredAgent(null);
  }, []);

  // Selected agent
  const selectedAgent = useMemo(() => {
    return (agents || []).find(
      (a) => (a.agent_id?.toString() || a.id) === selectedAgentId
    );
  }, [agents, selectedAgentId]);

  // Handle edit agent save
  const handleEditAgentSave = useCallback(
    async (updatedAgent: any) => {
      try {
        await dispatch(updateAgent(updatedAgent as any)).unwrap();
        toast.success("Agent updated successfully!");
        dispatch(fetchAgents({ app_id: "12345" })); // Refresh list
      } catch (error) {
        toast.error("Failed to update agent");
      }
    },
    [dispatch]
  );

  return {
    // UI State
    inputValue,
    setInputValue,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    displayMode,
    setDisplayMode,
    selectedAgentId,
    setSelectedAgentId,
    selectedAgents,
    setSelectedAgents,
    hoveredAgent,
    setHoveredAgent,
    popoverPosition,
    setPopoverPosition,

    // Density
    density,
    setDensity,
    densityOptions,
    isDensityDropdownOpen,
    setIsDensityDropdownOpen,
    densityClasses,

    // Modals
    showCreateModal,
    setShowCreateModal,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    agentToEdit,
    setAgentToEdit,
    agentToDelete,
    setAgentToDelete,

    // Agent State
    agentActiveState,
    setAgentActiveState,
    pendingUpdates,
    setPendingUpdates,
    expandedDepartments,
    setExpandedDepartments,

    // Filters
    appliedFilters,
    setAppliedFilters,

    // Data
    agents,
    loading,
    error,
    page,
    limit,
    total,
    search,
    setSearch,
    load,
    deleteLoading,
    departments,
    departmentsLoading,

    // Memoized Data
    tabData,
    filteredAgents,
    statusOptions,
    departmentOptions,
    agentsByDepartment,
    selectedAgent,

    // Handlers
    handleToggleActive,
    handleDeleteAgent,
    handleBlockAgent,
    handleApplyFilters,
    handleClearFilters,
    toggleAgentSelection,
    toggleAllAgents,
    handleMouseEnter,
    handleMouseLeave,
    handleEditAgentSave,

    // Utility
    getStatusColor,
  };
};
