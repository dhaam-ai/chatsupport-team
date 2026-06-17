// ManagerSection.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  Zap,
  Users,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Activity,
  Ticket,
} from "lucide-react";
import { motion } from "framer-motion";
import ManagerMonitoringDashboard from "./ManagerMonitoring/ManagerMonitoringDashboard";
import TicketAssignmentMonitor from "./ManagerMonitoring/TicketAssignmentMonitor";
import TicketAssignmentManager from "./ManagerMonitoring/TicketAssignmentManager";
import EscalationTracker from "./ManagerMonitoring/EscalationTracker";
import PerformanceAnalytics from "./ManagerMonitoring/PerformanceAnalytics";
import SLAMonitor from "./ManagerMonitoring/SLAMonitor";
import QueueBalancer from "./ManagerMonitoring/QueueBalancer";

interface ManagerSectionProps {
  managers?: any[];
  onManagerSelect?: (managerId: string) => void;
}

type MonitoringTab = "overview" | "assignments" | "ticket-assignment" | "escalations" | "performance" | "sla" | "queue";

const ManagerSection: React.FC<ManagerSectionProps> = ({
  managers = [],
  onManagerSelect,
}) => {
  const [activeTab, setActiveTab] = useState<MonitoringTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Tab configuration with icons and labels
  const tabs: Array<{ id: MonitoringTab; label: string; icon: React.ReactNode; description: string }> = [
    { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" />, description: "Manager performance dashboard" },
    { id: "assignments", label: "Assignments", icon: <Users className="w-4 h-4" />, description: "Ticket assignment monitoring" },
    { id: "ticket-assignment", label: "Assign Tickets", icon: <Ticket className="w-4 h-4" />, description: "Assign and reassign tickets" },
    { id: "escalations", label: "Escalations", icon: <AlertTriangle className="w-4 h-4" />, description: "Escalation tracking" },
    { id: "performance", label: "Performance", icon: <BarChart3 className="w-4 h-4" />, description: "Analytics & insights" },
    { id: "sla", label: "SLA Monitoring", icon: <Target className="w-4 h-4" />, description: "SLA compliance tracking" },
    { id: "queue", label: "Queue", icon: <Zap className="w-4 h-4" />, description: "Queue balancing" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ManagerMonitoringDashboard managers={managers} selectedManager={selectedManager} />;
      case "assignments":
        return <TicketAssignmentMonitor managers={managers} selectedManager={selectedManager} />;
      case "ticket-assignment":
        return <TicketAssignmentManager managers={managers} selectedManager={selectedManager} />;
      case "escalations":
        return <EscalationTracker managers={managers} selectedManager={selectedManager} />;
      case "performance":
        return <PerformanceAnalytics managers={managers} selectedManager={selectedManager} />;
      case "sla":
        return <SLAMonitor managers={managers} selectedManager={selectedManager} />;
      case "queue":
        return <QueueBalancer managers={managers} selectedManager={selectedManager} />;
      default:
        return <ManagerMonitoringDashboard managers={managers} selectedManager={selectedManager} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-2 lg:gap-3">
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
              Manager Monitoring
            </h1>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">
              Monitor agents, track assignments, and manage escalations
            </p>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <button className="hidden sm:flex items-center py-1.5 px-3 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-gray-50">
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden md:inline">Export</span>
            </button>
            <button className="py-1.5 px-3 lg:px-4 bg-gradient-to-r from-[rgb(124,67,223)] to-purple-500 text-white rounded-lg text-sm font-semibold cursor-pointer transition-shadow flex items-center gap-1 hover:shadow-lg hover:shadow-purple-500/30">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 px-4 lg:px-6">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
              className={`py-3 px-4 text-sm font-medium transition-all relative border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[rgb(124,67,223)] text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              title={tab.description}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex justify-between items-center gap-2 lg:gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search managers or teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full lg:w-64 border border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 py-2 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg cursor-pointer transition-colors whitespace-nowrap hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto px-4 lg:px-6 py-4 bg-gray-50">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerSection;
