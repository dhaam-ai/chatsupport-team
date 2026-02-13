import React from 'react';
import { Edit, Trash2, Lock, Unlock } from 'lucide-react';
import { Editbutton, BlockIcon, DeleteIcon } from '../../public/assets/svg';
import { Agent } from "../store/agentSlice";

interface ResponsiveAgentTableProps {
  agents: Agent[];
  loading: boolean;
  selectedRows: Set<string>;
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onRowClick: (id: string) => void;
  onEdit: (agent: Agent) => void;
  onBlock: (agentId: string) => void;
  onDelete: (agent: Agent) => void;
  agentActiveState: Record<string, boolean>;
  pendingUpdates: Set<string>;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const ResponsiveAgentTable: React.FC<ResponsiveAgentTableProps> = ({
  agents,
  loading,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onRowClick,
  onEdit,
  onBlock,
  onDelete,
  agentActiveState,
  pendingUpdates,
  onToggleActive,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'blocked':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  if (loading && agents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  // Mobile Card View Only
  return (
    <div className="space-y-3 px-0">
        {agents.map((agent) => {
          const agentId = agent.agent_id?.toString() || agent.id || "";
          const isActive = agent.account_status === 'active';
          return (
          <div
            key={agentId}
            onClick={() => onRowClick(agentId)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
          >
            {/* Header with Avatar and Name */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedRows.has(agentId)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectRow(agentId);
                  }}
                  className="rounded mt-1"
                />
                <img
                  src={agent.avatar || agent.profile_picture || "https://i.pravatar.cc/150?img=1"}
                  alt={agent.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{agent.name}</h3>
                  <p className="text-xs text-gray-500">ID: #{agentId}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 flex-shrink-0 ${getStatusColor(agent.account_status)}`}>
                {agent.account_status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-start justify-between">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-900 text-right truncate ml-2">{agent.email}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-600 font-medium">Phone:</span>
                <span className="text-gray-900">{agent.phone || agent.contact_number || "-"}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-600 font-medium">Address:</span>
                <span className="text-gray-900 text-right truncate ml-2">{agent.address || agent.location || "-"}</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-gray-100">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Tickets</div>
                <div className="text-lg font-bold text-gray-900">{agent.tickets_count || agent.ticketsClosed || 0}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Avg Response</div>
                <div className="text-sm font-semibold text-gray-900">{agent.avgResponseTime || "-"}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <label className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    disabled={pendingUpdates.has(agentId)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleActive(agentId, !isActive);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-5 bg-gray-300 peer-checked:bg-purple-600 rounded-full peer-checked:after:translate-x-3 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative"></div>
                </label>
              </div>
            </div>


          

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(agent);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock(agentId);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors"
              >
                <Lock size={14} />
                Block
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(agent);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
          );
        })}
    </div>
  );
};

export default ResponsiveAgentTable;
