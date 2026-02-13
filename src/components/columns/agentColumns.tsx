// agentColumns.tsx
import React from "react";
import { Editbutton, BlockIcon, DeleteIcon } from "../../../public/assets/svg";

export const createAgentColumns = (
  agentActiveState: Record<string, boolean>,
  pendingUpdates: Set<string>,
  handleToggleActive: (id: string, active: boolean) => void,
  setAgentToEdit: (agent: any) => void,
  setIsEditModalOpen: (open: boolean) => void,
  handleBlockAgent: (id: string) => void,
  setDeleteModalOpen: (open: boolean) => void,
  setAgentToDelete: (agent: any) => void
) => [
  {
    key: "agent",
    label: "Agent",
    width: "16%",
    render: (value: any, row: any) => (
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold cursor-pointer hover:underline" style={{ color: "#2b2b2b" }}>
          #{row.agentId}
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
    key: "address",
    label: "Address",
    width: "14%",
    render: (value: any, row: any) => (
      <span
        className="text-sm font-medium"
        style={{ color: "#2b2b2b" }}
        title={row.address?.length > 15 ? row.address : undefined}
      >
        {row.address?.length > 15
          ? `${row.address.slice(0, 15)}...`
          : row.address}
      </span>
    ),
  },
  {
    key: "account_status",
    label: "Account Status",
    width: "11%",
    render: (value: any, row: any) => (
      <span
        className={`px-2 py-0.5 rounded-full text-[14px] font-bold tracking-wider shadow-sm ${row.statusColor}`}
      >
        {row.account_status}
      </span>
    ),
  },
  {
    key: "tickets",
    label: "Tickets",
    width: "8%",
    render: (value: any, row: any) => (
      <div style={{ color: "#2b2b2b" }}>
        <span className="font-bold">{row.ticketsClosed}</span>
      </div>
    ),
  },
  {
    key: "avgResponseTime",
    label: "Avg. Response",
    width: "10%",
    render: (value: any, row: any) => (
      <span className="text-sm font-medium" style={{ color: "#2b2b2b" }}>
        {row.avgResponseTime}
      </span>
    ),
  },
  {
    key: "active",
    label: "Active",
    width: "5%",
    render: (value: any, row: any) => (
      <label
        className="relative inline-flex items-center cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={agentActiveState[row.id] || false}
          disabled={pendingUpdates.has(row.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleActive(row.id, !agentActiveState[row.id]);
          }}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${
            pendingUpdates.has(row.id) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        ></div>
      </label>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    width: "9%",
    render: (value: any, row: any) => (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAgentToEdit(row);
            setIsEditModalOpen(true);
          }}
          className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          style={{ color: "#2b2b2b" }}
          title="Edit"
        >
          <Editbutton></Editbutton>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBlockAgent(row.id);
          }}
          className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          style={{ color: "#2b2b2b" }}
          title="Block"
        >
          <BlockIcon></BlockIcon>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteModalOpen(true);
            setAgentToDelete(row);
          }}
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