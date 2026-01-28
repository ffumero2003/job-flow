import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function PipelineHealth() {
  const { applications } = useApp();

  const breakdown = useMemo(() => {
    const total = applications.length || 1; // Avoid division by zero
    const counts = {
      pending: applications.filter((a) => a.status === "pending").length,
      interview: applications.filter((a) => a.status === "interview").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      offer: applications.filter((a) => a.status === "offer").length,
    };

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }, [applications]);

  const colors = {
    pending: "bg-amber-500",
    interview: "bg-blue-500",
    rejected: "bg-red-500",
    offer: "bg-emerald-500",
  };

  const labels = {
    pending: "Pending",
    interview: "Interview",
    rejected: "Rejected",
    offer: "Offer",
  };

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink mb-4">Pipeline Health</h3>
        <p className="text-stone text-sm">
          Add applications to see your pipeline breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-ink mb-4">Pipeline Health</h3>

      {/* Progress Bar */}
      <div className="h-3 rounded-full bg-smoke overflow-hidden flex mb-4">
        {breakdown.map(
          ({ status, percent }) =>
            percent > 0 && (
              <div
                key={status}
                className={`${colors[status]} transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            ),
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {breakdown.map(({ status, count, percent }) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${colors[status]}`}></span>
            <span className="text-sm text-stone">{labels[status]}</span>
            <span className="text-sm font-mono font-medium text-ink ml-auto">
              {percent}%
            </span>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-4 pt-4 border-t border-smoke">
        <div className="flex justify-between text-sm">
          <span className="text-stone">Total Applications</span>
          <span className="font-mono font-medium text-ink">
            {applications.length}
          </span>
        </div>
      </div>
    </div>
  );
}
