import React from "react";

const shimmer = "animate-pulse bg-gray-200";

export default function AgentDetailSkeleton() {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto p-6 pb-2 space-y-6">

        {/* Header Skeleton */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8">
          <div className="flex gap-6">
            
            {/* Avatar */}
            <div className={`${shimmer} w-24 h-24 rounded-full`} />

            {/* Name + Details */}
            <div className="flex-1 space-y-3">
              <div className={`${shimmer} h-6 w-48 rounded`} />
              <div className={`${shimmer} h-4 w-32 rounded`} />

              <div className="flex gap-4 mt-4">
                <div className={`${shimmer} h-4 w-28 rounded`} />
                <div className={`${shimmer} h-4 w-28 rounded`} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <div className={`${shimmer} h-10 w-20 rounded-lg`} />
              <div className={`${shimmer} h-10 w-24 rounded-lg`} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4"
            >
              <div className={`${shimmer} h-12 w-12 rounded-lg`} />
              <div className={`${shimmer} h-8 w-20 rounded`} />
              <div className={`${shimmer} h-3 w-24 rounded`} />
            </div>
          ))}
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className={`${shimmer} h-6 w-40 rounded`} />
          </div>

          {/* Table Rows */}
          <div className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100"
              >
                <div className={`${shimmer} h-4 w-20 rounded`} />
                <div className={`${shimmer} h-4 w-28 rounded`} />
                <div className={`${shimmer} h-4 w-32 rounded`} />
                <div className={`${shimmer} h-4 w-16 rounded`} />
                <div className={`${shimmer} h-4 w-20 rounded`} />
                <div className={`${shimmer} h-4 w-24 rounded`} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
