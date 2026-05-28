// hooks/useAgents.ts
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgents, setSearch, setPage, setLimit } from '../store/agentSlice';
import type { RootState, AppDispatch } from '../store/store';

// Define the Agent type for better typing (mapped from API response)
export interface Agent {
  id: string; // Maps from user_id
  avatar: string; // Maps from profile_picture
  name: string;
  role: string; // No role in API, use fallback
  team: string; // No team in API, use fallback
  email: string;
  phone: string; // Maps from contact_no
  location: string; // Maps from address
  account_status: string; // Maps from account_status
  ticketsClosed: number; // Maps from tickets_count
  avgResponseTime: string;
  performanceScore: number; // Maps from performance_score
  specialties: string[];
  rate: number;
  availability: any;
  lastActive?: string; // Maps from last_active
  ticketsData?: any[]; // Raw tickets from API
}

// useAgents hook that uses Redux
const useAgents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    agents: reduxAgents,
    loading,
    error,
    page,
    limit,
    total,
    search,
    filters: { account_status: statusFilter },
  } = useSelector((state: RootState) => state.agents);

  // Load agents on mount or when pagination/filters change
  useEffect(() => {
    dispatch(fetchAgents({ page, limit, search, account_status: statusFilter }));
  }, [dispatch, page, limit, search, statusFilter]);

  // Handle search input
  const handleSearch = useCallback((searchTerm: string) => {
    dispatch(setSearch(searchTerm));
    dispatch(setPage(1)); // Reset to first page on search
  }, [dispatch]);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    dispatch(setPage(newPage));
  }, [dispatch]);

  // Handle limit change
  const handleLimitChange = useCallback((newLimit: number) => {
    dispatch(setLimit(newLimit));
    dispatch(setPage(1)); // Reset to first page on limit change
  }, [dispatch]);

  // Mock add agent function (for now)
  const addAgent = useCallback((agent: Agent) => {
    // This would need to call an API in the future
    console.log('Add agent:', agent);
  }, []);

  // Mock load function for backward compatibility
  const load = useCallback(({ page: newPage = page, limit: newLimit = limit }: { page?: number; limit?: number } = {}) => {
    if (newPage !== page) {
      dispatch(setPage(newPage));
    }
    if (newLimit !== limit) {
      dispatch(setLimit(newLimit));
    }
  }, [dispatch, page, limit]);

  return {
    agents: reduxAgents,
    loading,
    error,
    load,
    page,
    limit,
    total,
    search,
    setSearch: handleSearch,
    addAgent,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
  };
};

export default useAgents;