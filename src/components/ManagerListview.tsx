// ManagerListView.tsx
import React from "react";
import ManagerCard from "./ManagerCard";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  tickets: number;
  avgResponse: string;
}

interface Manager {
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
}

interface ManagerListViewProps {
  managers: Manager[];
  loading?: boolean;
  onEdit?: (manager: Manager) => void;
  onDelete?: (manager: Manager) => void;
  onBlock?: (managerId: string) => void;
  onManagerClick?: (managerId: string) => void;
  onAgentClick?: (agentId: string) => void;
}

const ManagerListView: React.FC<ManagerListViewProps> = ({
  managers,
  loading = false,
  onEdit,
  onDelete,
  onBlock,
  onManagerClick,
  onAgentClick,
}) => {
  if (loading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (managers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Managers Found
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-sm">
          There are no managers in the system yet. Add a new manager to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
      {managers.map((manager) => (
        <ManagerCard
          key={manager.id}
          manager={manager}
          onEdit={onEdit}
          onDelete={onDelete}
          onBlock={onBlock}
          onManagerClick={onManagerClick}
          onAgentClick={onAgentClick}
        />
      ))}
    </div>
  );
};

export default ManagerListView;