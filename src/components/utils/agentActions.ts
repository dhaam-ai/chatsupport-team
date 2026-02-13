import toast from "react-hot-toast";
import { AppDispatch } from "../../store/store";
import {
  updateAgentStatus,
  deleteAgent,
} from "../../store/agentSlice";

export interface AgentActionHandlers {
  handleToggleActive: (agentId: string, isActive: boolean) => Promise<boolean>;
  handleDeleteAgent: (agentId: string) => Promise<boolean>;
  handleBlockAgent: (agentId: string) => Promise<void>;
}

/**
 * Create agent action handlers with Redux dispatch
 */
export const createAgentActionHandlers = (
  dispatch: AppDispatch,
  agentActiveState: Record<string, boolean>,
  setAgentActiveState: (state: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void,
  pendingUpdates: Set<string>,
  setPendingUpdates: (updates: Set<string> | ((prev: Set<string>) => Set<string>)) => void,
  agents: any[]
): AgentActionHandlers => {
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

  return {
    handleToggleActive,
    handleDeleteAgent,
    handleBlockAgent,
  };
};
