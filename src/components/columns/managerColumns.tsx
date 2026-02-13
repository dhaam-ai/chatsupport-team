// managerColumns.tsx
import React from "react";
import { Edit } from "lucide-react";
import { Editbutton, DeleteIcon } from "../../../public/assets/svg";

export const createManagerColumns = () => [
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
];