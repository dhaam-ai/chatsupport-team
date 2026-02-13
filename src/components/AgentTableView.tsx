import React from "react";
import {
  Edit,
  Trash2,
  MessageSquare,
  Phone,
  Mail,
  X,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updateAgentStatus, deleteAgent } from '../store/agentSlice';
import { Agent } from '../hooks/useAgents';
import { ShimmerTableRows } from './Shimmer';
import { Editbutton,BlockIcon,DeleteIcon } from '../../public/assets/svg';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AnimatedTooltip from "../utils/AnimatedTooltip";


interface AgentTableViewProps {
  agents: Agent[];
  loading: boolean;
  limit: number;
  densityClasses: string;
  selectedAgents: Set<string>;
  agentActiveState: Record<string, boolean>;
  filteredAgents: Agent[];
  getStatusColor: (account_status: string) => string;
  toggleAgentSelection: (id: string) => void;
  toggleAllAgents: () => void;
  setSelectedAgentId: (id: string | null) => void;
  setAgentActiveState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const AgentTableView: React.FC<AgentTableViewProps> = ({
  agents,
  loading,
  limit,
  densityClasses,
  selectedAgents,
  agentActiveState,
  filteredAgents,
  getStatusColor,
  toggleAgentSelection,
  toggleAllAgents,
  setSelectedAgentId,
  setAgentActiveState,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const deleteLoading = useSelector((state: RootState) => state.agents.loading);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [agentToDelete, setAgentToDelete] = React.useState<Agent | null>(null);
  
  // Track pending API calls per agent
  const [pendingUpdates, setPendingUpdates] = React.useState<Set<string>>(new Set());

  // Initialize toggle state based on agent account_status if not already set
  React.useEffect(() => {
    filteredAgents.forEach((agent) => {
      if (!(agent.id in agentActiveState)) {
        setAgentActiveState(prev => ({
          ...prev,
          [agent.id || '']: (agent.account_status || '').toLowerCase() === 'active'
        }));
      }
    });
  }, [filteredAgents]);
  if (loading) {
    return (
      <div className="overflow-x-auto max-h-[calc(100vh-400px)]  overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm border-b border-purple-200/50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedAgents.size === filteredAgents.length && filteredAgents.length > 0}
                  onChange={toggleAllAgents}
                  className="w-4 h-4 rounded border-gray-400 text-[#7c43df] accent-[#7c43df] cursor-pointer transition-colors"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Agent</th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Team</th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">account_status</th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Tickets</th>
              <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Avg. Response</th>
              <th style={{paddingLeft:"43px"}} className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Active</th>
              <th  style={{paddingLeft:"43px"}} className="px-4  py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <ShimmerTableRows count={limit} />
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar" style={{ overflowX: 'hidden' }}>
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm border-b border-purple-200/50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left w-12">
              <input
                type="checkbox"
                style={{ accentColor: "#7c43df" }}
                checked={selectedAgents.size === filteredAgents.length && filteredAgents.length > 0}
                onChange={toggleAllAgents}
                className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Agent</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Role</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Team</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">account_status</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Tickets</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Avg. Response</th>
            <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Active</th>
            <th style={{paddingLeft:"43px"}}  className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-50 divide-y divide-gray-200">
          {filteredAgents.map((a) => (
            <tr
              key={a.id}
              className={`border-b border-gray-200 hover:bg-white hover:border-t-[1px] cursor-pointer hover:border-gray-200 hover:shadow-[0_-5px_7px_-1px_rgba(0,0,0,0.1),0_5px_7px_-1px_rgba(0,0,0,0.1)] hover:z-10 relative transition-all duration-200 ease-in-out`}
              onClick={() => setSelectedAgentId(a.id ?? null)}
              id={`agent-row-${a.id}`}
              style={{ transformOrigin: 'center' }}
            >
              <td className={`px-4 ${densityClasses}`} onClick={(e) => e.stopPropagation()}>
                <div className="transition-transform  duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.008]">
                  <input
                    type="checkbox"
                    checked={selectedAgents.has(a.id ?? '')}
                    onChange={() => toggleAgentSelection(a.id ?? '')}
                    className="w-4 h-4  rounded  border-gray-400 accent-[#7c43df] cursor-pointer transition-colors"
                  />
                </div>
              </td>
              <td className={`px-4 ${densityClasses}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={a.avatar}
                      className="w-10 h-10 rounded-full shadow-md object-cover ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                      alt={`${a.name}'s avatar`}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="font-semibold transition-colors" style={{ color: '#2b2b2b' }}>{a.name}</div>
                    <div className="text-xs" style={{ color: '#2b2b2b' }}>{a.id}</div>
                  </div>
                </div>
              </td>
              <td className={`px-4 ${densityClasses} text-sm font-medium pb-[2px] hover:underline`} style={{ color: '#2b2b2b' }}>{a.role}</td>
              <td className={`px-4 ${densityClasses} text-xs font-medium`} style={{ color: '#2b2b2b' }}>
                <div className="flex text-[14px] font-medium items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />{a.email}
                </div>
              </td>
              <td className={`px-4 ${densityClasses} text-xs font-medium`} style={{ color: '#2b2b2b' }}>
                <div className="flex text-[13px] font-medium items-center gap-1">
                  <Phone className="w-3.5 h-3.5 " />{a.phone}
                </div>
              </td>
              <td className={`px-4 ${densityClasses} text-sm font-medium`} style={{ color: '#2b2b2b' }}>{a.team}</td>
              <td className={`px-4 ${densityClasses}`}>
                <span className={`px-2 py-0.5 rounded-full text-[14px] font-bold tracking-wider shadow-sm ${getStatusColor(a.account_status)}`}>{a.account_status}</span>
              </td>
              <td className={`px-4 ${densityClasses}`}>
                <span className="font-bold" style={{ color: '#2b2b2b' }}>{a.ticketsClosed}</span>
                <div className="text-xs" style={{ color: '#2b2b2b' }}>Tickets</div>
              </td>
              <td className={`px-4 ${densityClasses} text-sm font-medium`} style={{ color: '#2b2b2b' }}>{a.avgResponseTime}</td>
              
              {/* Toggle Column */}
              <td className={`px-4 ${densityClasses}`} onClick={(e) => e.stopPropagation()}>
                <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={agentActiveState[a.id || ''] || false}
                    disabled={pendingUpdates.has(a.id || '')}
                    onChange={(e) => {
                      e.stopPropagation();
                      const agentId = a.id || a.agent_id || '';
                      const newStatus = !agentActiveState[a.id || ''] ? 'active' : 'inactive';
                      
                      // Add to pending updates
                      setPendingUpdates(prev => new Set(prev).add(agentId));
                      
                      // Call API to update account_status and wait for response
                      dispatch(updateAgentStatus({
                        agentId: agentId,
                        account_status: newStatus,
                      })).then((result) => {
                        // Remove from pending updates
                        setPendingUpdates(prev => {
                          const next = new Set(prev);
                          next.delete(agentId);
                          return next;
                        });
                        
                        // Show toast based on result
                        if (result.type.endsWith('/fulfilled')) {
                          setAgentActiveState(prev => ({
                            ...prev,
                            [agentId]: newStatus === 'active'
                          }));
                          toast.success(`Agent account_status updated to ${newStatus}!`);
                        } else {
                          // Revert state on error
                          setAgentActiveState(prev => ({
                            ...prev,
                            [agentId]: !newStatus === 'active'
                          }));
                          toast.error('Failed to update agent account_status');
                        }
                      }).catch(() => {
                        // Revert state on error
                        setPendingUpdates(prev => {
                          const next = new Set(prev);
                          next.delete(agentId);
                          return next;
                        });
                        setAgentActiveState(prev => ({
                          ...prev,
                          [agentId]: (a.account_status || '').toLowerCase() === 'active'
                        }));
                        toast.error('Failed to update agent account_status');
                      });
                    }}
                    className="sr-only peer" 
                  />
                  <div className={`w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${pendingUpdates.has(a.id || '') ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                </label>
              </td>

              {/* Actions Column */}
              <td className={`px-4 ${densityClasses}`}>
                <div className="flex items-center gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit agent:', a.id);
                    }}
                    className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    style={{ color: '#2b2b2b' }}
                    title="Edit"
                  >
                    <Editbutton />
                  </button>

                 
                  {/* Block Button - Toggle between block and inactive */}
                  <AnimatedTooltip content="Block/Unblock" direction="bottom">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const agentId = a.id || a.agent_id || '';
                      const currentStatus = (a.account_status || '').toLowerCase();
                      const newStatus = currentStatus === 'block' ? 'inactive' : 'block';
                      
                      // Add to pending updates
                      setPendingUpdates(prev => new Set(prev).add(agentId));
                      
                      // Call API to update account_status
                      dispatch(updateAgentStatus({
                        agentId: agentId,
                        account_status: newStatus,
                      })).then((result) => {
                        // Remove from pending updates
                        setPendingUpdates(prev => {
                          const next = new Set(prev);
                          next.delete(agentId);
                          return next;
                        });
                        
                        // Show toast
                        if (result.type.endsWith('/fulfilled')) {
                          toast.success(`Agent ${newStatus === 'block' ? 'blocked' : 'unblocked'} successfully!`);
                        } else {
                          toast.error('Failed to update agent account_status');
                        }
                      }).catch(() => {
                        setPendingUpdates(prev => {
                          const next = new Set(prev);
                          next.delete(agentId);
                          return next;
                        });
                        toast.error('Failed to update agent account_status');
                      });
                    }}
                    className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    style={{ color: '#2b2b2b' }}
                   
                  >
                    <BlockIcon className="w-4 h-4" />
                  </button>
                  </AnimatedTooltip>


                   {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAgentToDelete(a);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    style={{ color: '#2b2b2b' }}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </button>


                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        agentName={agentToDelete?.name || ''}
        isLoading={deleteLoading}
        onConfirm={() => {
          if (agentToDelete) {
            dispatch(deleteAgent({
              agentId: agentToDelete.id || agentToDelete.agent_id || '',
            })).then((result) => {
              if (result.type.endsWith('/fulfilled')) {
                setDeleteModalOpen(false);
                setAgentToDelete(null);
                toast.success(`Agent "${agentToDelete.name}" deleted successfully!`);
              } else {
                toast.error('Failed to delete agent');
              }
            }).catch(() => {
              toast.error('Failed to delete agent');
            });
          }
        }}
        onCancel={() => {
          setDeleteModalOpen(false);
          setAgentToDelete(null);
        }}
      />
    </div>
  );
};

export default AgentTableView;
