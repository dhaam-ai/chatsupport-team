import React from "react";
import {
  Edit,
  Trash2,
  Lock,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
} from "lucide-react";

function defaultGetStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "inactive":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    case "blocked":
      return "bg-red-100 text-red-700 border border-red-200";
    case "open":
      return "bg-blue-100 text-blue-700 border border-blue-200";
    case "closed":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}

export interface ResponsiveItem {
  id?: string | number;
  agent_id?: number | string;
  ticket_id?: number | string;
  customer_id?: number | string;
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  contact_number?: string;
  address?: string;
  location?: string;
  account_status?: string;
  status?: string;
  avatar?: string;
  profile_picture?: string;
  tickets_count?: number;
  ticketsClosed?: number;
  avgResponseTime?: string;
  [key: string]: any;
}

export interface ResponsiveCardTableProps {
  items: ResponsiveItem[];
  loading: boolean;
  selectedRows: Set<string>;
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onRowClick: (id: string) => void;
  onEdit: (item: ResponsiveItem) => void;
  onBlock?: (itemId: string) => void;
  onDelete: (item: ResponsiveItem) => void;
  itemActiveState?: Record<string, boolean>;
  pendingUpdates?: Set<string>;
  onToggleActive?: (id: string, isActive: boolean) => void;
  renderCustomField?: (
    fieldName: string,
    value: any,
    item: ResponsiveItem
  ) => React.ReactNode;
  getStatusColor?: (status: string) => string;
  fields?: { label: string; key: string }[];
}

const ResponsiveCardTable: React.FC<ResponsiveCardTableProps> = ({
  items,
  loading,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onRowClick,
  onEdit,
  onBlock,
  onDelete,
  itemActiveState = {},
  pendingUpdates = new Set(),
  onToggleActive,
  renderCustomField,
  getStatusColor = defaultGetStatusColor,
  fields = [
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Address", key: "address" },
  ],
}) => {
  const [expandedActions, setExpandedActions] = React.useState<string | null>(
    null
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const getFieldIcon = (key: string) => {
    if (key === "email") return <Mail className="w-4 h-4 text-gray-400" />;
    if (key === "phone" || key === "contact_number")
      return <Phone className="w-4 h-4 text-gray-400" />;
    if (key === "address" || key === "location")
      return <MapPin className="w-4 h-4 text-gray-400" />;
    return null;
  };

  return (
    <div
      className="space-y-4"
      style={{
        padding: window.innerWidth < 768 ? "10px" : "0px",
      }}
    >
      {items.map((item) => {
        const itemId = (
          item.agent_id ||
          item.ticket_id ||
          item.customer_id ||
          item.id ||
          ""
        ).toString();
        const isActive =
          item.account_status === "active" || item.status === "active";
        const displayName = item.name || item.title || "N/A";
        const statusValue = item.account_status || item.status || "N/A";
        const isSelected = selectedRows.has(itemId);
        const isExpanded = expandedActions === itemId;

        return (
          <div
            key={itemId}
            className={`bg-white border rounded-xl transition-all duration-200 
shadow-sm md:shadow-none hover:shadow-lg
${
  isSelected
    ? "border-purple-300 shadow-md ring-2 ring-purple-100 md:shadow-md"
    : "border-gray-200 hover:border-purple-200"
}`}
          >
            {/* Header Section */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="flex items-center h-12">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectRow(itemId);
                      }}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-purple-600 checked:bg-purple-600 hover:border-purple-400"
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </label>
                </div>

                {/* Avatar */}
                {(item.avatar || item.profile_picture) && (
                  <div className="relative">
                    <img
                      src={
                        item.avatar ||
                        item.profile_picture ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(displayName)
                      }
                      alt={displayName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100"
                    />
                    {onToggleActive && (
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          isActive ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      ></div>
                    )}
                  </div>
                )}

                {/* Name and ID */}
                <div
                  className="flex-1 min-w-0"
                  onClick={() => onRowClick(itemId)}
                >
                  <h3 className="font-semibold text-gray-900 truncate text-base">
                    {displayName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">ID: #{itemId}</p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${getStatusColor(
                    statusValue
                  )}`}
                >
                  {statusValue}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Dynamic Fields */}
              <div className="space-y-3 mb-4">
                {fields.map((field) => {
                  const value = item[field.key];
                  if (!value) return null;

                  return (
                    <div
                      key={field.key}
                      className="flex items-start gap-3 group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-purple-50 transition-colors flex-shrink-0">
                        {getFieldIcon(field.key)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          {field.label}
                        </p>
                        <p className="text-sm text-gray-900 font-medium truncate">
                          {renderCustomField
                            ? renderCustomField(field.key, value, item)
                            : value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats Section */}
              {(item.tickets_count !== undefined ||
                item.avgResponseTime !== undefined) && (
                <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  {item.tickets_count !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {item.tickets_count || item.ticketsClosed || 0}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Tickets</div>
                    </div>
                  )}
                  {item.avgResponseTime !== undefined && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {item.avgResponseTime || "-"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Avg Response
                      </div>
                    </div>
                  )}
                  {onToggleActive && (
                    <div className="text-center">
                      <label
                        className="relative inline-flex items-center cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isActive || false}
                          disabled={pendingUpdates.has(itemId)}
                          onChange={(e) => {
                            e.stopPropagation();
                            onToggleActive(itemId, !isActive);
                          }}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${
                            pendingUpdates.has(itemId)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        ></div>
                      </label>
                      <div className="text-xs text-gray-600 mt-1">Active</div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-all hover:shadow-sm active:scale-95"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>

                {onBlock && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBlock(itemId);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-all hover:shadow-sm active:scale-95"
                  >
                    <Lock size={16} />
                    <span>Block</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all hover:shadow-sm active:scale-95"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResponsiveCardTable;
