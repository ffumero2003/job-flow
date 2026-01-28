import { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/dateUtils";

export function ApplicationsTable({ onEdit }) {
  const { applications, updateApplication, deleteApplication } = useApp();
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [newId, setNewId] = useState(null);

  // Sort applications
  const sorted = useMemo(() => {
    return [...applications].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle string comparison for company/role
      if (sortField === "company" || sortField === "role") {
        aVal = aVal?.toLowerCase() || "";
        bVal = bVal?.toLowerCase() || "";
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [applications, sortField, sortDir]);

  // Highlight newly added rows
  useEffect(() => {
    if (applications.length > 0) {
      const latest = applications[0];
      if (Date.now() - latest.createdAt < 1000) {
        setNewId(latest.id);
        setTimeout(() => setNewId(null), 2000);
      }
    }
  }, [applications]);

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  // Handle inline status change
  const handleStatusChange = (id, newStatus) => {
    updateApplication(id, { status: newStatus });
  };

  // Handle delete with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Delete this application?")) {
      deleteApplication(id);
    }
  };

  // Sort indicator component
  const SortIcon = ({ field }) => (
    <span className="ml-1 text-stone/50">
      {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </span>
  );

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-ink mb-2">
          No applications yet
        </h3>
        <p className="text-stone">
          Click "Add Application" to start tracking your job search.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-smoke/50">
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-stone cursor-pointer hover:text-ink transition-colors"
                onClick={() => handleSort("company")}
              >
                Company <SortIcon field="company" />
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-stone cursor-pointer hover:text-ink transition-colors"
                onClick={() => handleSort("role")}
              >
                Role <SortIcon field="role" />
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-stone cursor-pointer hover:text-ink transition-colors"
                onClick={() => handleSort("status")}
              >
                Status <SortIcon field="status" />
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-stone cursor-pointer hover:text-ink transition-colors"
                onClick={() => handleSort("dateApplied")}
              >
                Applied <SortIcon field="dateApplied" />
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-stone">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-smoke">
            {sorted.map((app) => (
              <tr
                key={app.id}
                className={`hover:bg-smoke/30 transition-colors ${
                  newId === app.id ? "highlight-new" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-ink">{app.company}</div>
                </td>
                <td className="px-6 py-4 text-stone">{app.role}</td>
                <td className="px-6 py-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="bg-transparent border border-smoke rounded-lg px-2 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="interview">💬 Interview</option>
                    <option value="rejected">✗ Rejected</option>
                    <option value="offer">🎉 Offer</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-stone font-mono text-sm">
                  {formatDate(app.dateApplied)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(app)}
                    className="text-accent hover:text-accent/70 font-medium text-sm mr-4 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-danger hover:text-danger/70 font-medium text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
