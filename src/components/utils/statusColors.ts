export const getStatusColor = (account_status: string): string => {
  const normalizedStatus = (account_status || "").toLowerCase();
  const colors: Record<string, string> = {
    active: "bg-green-50 text-green-800 border border-green-200",
    block: "bg-red-50 text-red-800 border border-red-200",
    blocked: "bg-red-50 text-red-800 border border-red-200",
    inactive: "bg-blue-50 text-blue-800 border border-blue-200",
    manager: "bg-purple-50 text-purple-800 border border-purple-200",
    training: "bg-blue-50 text-blue-800 border border-blue-200",
    new: "bg-blue-50 text-blue-800 border border-blue-200",
  };
  return (
    colors[normalizedStatus] ||
    "bg-gray-50 text-gray-800 border border-gray-200"
  );
};
