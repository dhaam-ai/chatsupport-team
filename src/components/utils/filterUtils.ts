export interface TabData {
  id: string;
  label: string;
  count: number;
}

export const createTabData = (agents: any[] = []): TabData[] => [
  { id: "all", label: "All", count: agents.length },
  {
    id: "active",
    label: "Active",
    count: agents.filter(
      (a) => (a.account_status || "").toLowerCase() === "active"
    ).length,
  },
  {
    id: "inactive",
    label: "Inactive",
    count: agents.filter(
      (a) => (a.account_status || "").toLowerCase() === "inactive"
    ).length,
  },
  {
    id: "block",
    label: "Block",
    count: agents.filter(
      (a) =>
        (a.account_status || "").toLowerCase() === "block" ||
        (a.account_status || "").toLowerCase() === "blocked"
    ).length,
  },
];

export const buildFilterParams = (
  tabId: string = "all",
  appliedFilters: { status: string[]; priority: string[]; category: number[] } | null
) => {
  const statusFilters: string[] = [];

  if (tabId === "active") {
    statusFilters.push("active");
  } else if (tabId === "inactive") {
    statusFilters.push("inactive");
  } else if (tabId === "block") {
    statusFilters.push("block", "blocked");
  }

  const appliedStatuses = appliedFilters?.status || [];
  const finalStatuses = appliedStatuses.length > 0 ? appliedStatuses : statusFilters;

  return {
    status: finalStatuses,
    priority: appliedFilters?.priority || [],
    category: appliedFilters?.category || [],
  };
};

/**
 * Group agents by department
 */
export const groupAgentsByDepartment = (agents: any[] = []) => {
  const grouped: Record<string, { manager: any; agents: any[] }> = {};

  agents.forEach((agent: any) => {
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
};
