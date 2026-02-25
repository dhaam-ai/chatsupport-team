import React, { useEffect } from "react";

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface GenericTableProps {
  columns: TableColumn[];
  rows: any[];
  loading: boolean;
  limit: number;
  densityClasses: string;
  selectedRows: Set<string>;
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onRowClick?: (id: string) => void;
  keyField?: string;
  getRowColor?: (row: any) => string;
}

const ReusableTable: React.FC<GenericTableProps> = ({
  columns,
  rows,
  loading,
  limit,
  densityClasses,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onRowClick,
  keyField = "id",
  getRowColor,
}) => {
  const getRowId = (row: any): string => row[keyField] || row.id || "";

  useEffect(() => {
    // console.log("agnet columns ", columns);
  }, [columns]);

  if (loading) {
    return (
      <div className="overflow-x-auto max-h-[calc(100vh-450px)] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm border-b border-purple-200/50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 rounded border-gray-400"
                />
              </th>
              {columns.map((col, idx) => (
                <th
                  key={`col-${col.key}-${idx}`}
                  className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {Array(limit)
              .fill(0)
              .map((_, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={`shimmer-${idx}-${colIdx}`} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead className="bg-gradient-to-r from-purple-100/80 to-indigo-100/80 backdrop-blur-sm border-b border-purple-200/50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left w-12">
              <input
                type="checkbox"
                style={{ accentColor: "#7c43df" }}
                checked={selectedRows.size === rows.length && rows.length > 0}
                onChange={onSelectAll}
                className="w-4 h-4 rounded border-gray-400 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </th>
            {columns.map((col, idx) => (
              <th
                key={`col-${col.key}-${idx}`}
                className="px-4 py-3 text-left text-xs font-extrabold text-gray-800 uppercase tracking-wider"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-50 divide-y divide-gray-200">
          {rows.map((row) => {
            const rowId = getRowId(row);
            const rowColor = getRowColor ? getRowColor(row) : undefined;

            return (
              <tr
                key={rowId}
                className="border-b border-gray-200 hover:bg-white hover:border-t-[1px] cursor-pointer hover:border-gray-200 hover:shadow-[0_-5px_7px_-1px_rgba(0,0,0,0.1),0_5px_7px_-1px_rgba(0,0,0,0.1)] hover:z-10 relative transition-all duration-200 ease-in-out"
                onClick={() => onRowClick?.(rowId)}
                id={`row-${rowId}`}
                style={{ backgroundColor: rowColor }}
              >
                <td
                  className={`px-4 ${densityClasses}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowId) || false}
                    onChange={() => onSelectRow(rowId)}
                    className="w-4 h-4 rounded border-gray-400 accent-[#7c43df] cursor-pointer transition-colors"
                  />
                </td>
             {columns.map((col) => {
  const content = col.render
    ? col.render(row[col.key], row)
    : row[col.key];

  // Add this debug line
  if (col.key === 'actions') {
    // console.log('Actions column - row:', row, 'content:', content);
  }

  return (
    <td
      key={`${rowId}-${col.key}`}
      className={`px-4 ${densityClasses}`}
      style={{ width: col.width }}
    >
      {content ?? null}
    </td>
  );
})}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
