import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  getDaysUntil,
  getDaysUntilLabel,
  formatDate,
} from "../utils/dateUtils";

export function FollowUpsWidget() {
  const { applications } = useApp();

  const followUps = useMemo(() => {
    return (
      applications
        // Only include apps with follow-up dates that aren't rejected/offer
        .filter(
          (a) =>
            a.nextFollowUpDate &&
            a.status !== "rejected" &&
            a.status !== "offer",
        )
        // Calculate days until follow-up
        .map((a) => ({
          ...a,
          daysUntil: getDaysUntil(a.nextFollowUpDate),
        }))
        // Sort by urgency (closest first)
        .sort((a, b) => a.daysUntil - b.daysUntil)
        // Limit to 5
        .slice(0, 5)
    );
  }, [applications]);

  // Get urgency color based on days until
  const getUrgencyColor = (days) => {
    if (days < 0) return "text-danger"; // Overdue
    if (days === 0) return "text-danger"; // Today
    if (days <= 2) return "text-warning"; // Soon
    return "text-stone"; // Normal
  };

  // Get urgency background for the indicator dot
  const getUrgencyBg = (days) => {
    if (days < 0) return "bg-danger"; // Overdue
    if (days === 0) return "bg-danger"; // Today
    if (days <= 2) return "bg-warning"; // Soon
    return "bg-stone"; // Normal
  };

  // Empty state
  if (followUps.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink mb-4">
          📅 Follow-ups Due
        </h3>
        <p className="text-stone text-sm">
          No follow-ups scheduled. Add follow-up dates to your applications to
          track them here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-ink mb-4">📅 Follow-ups Due</h3>

      <div className="space-y-3">
        {followUps.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between py-2 border-b border-smoke last:border-0"
          >
            {/* Company & Role */}
            <div className="flex items-center gap-3">
              <span
                className={`w-2 h-2 rounded-full ${getUrgencyBg(app.daysUntil)}`}
              ></span>
              <div>
                <div className="font-medium text-ink">{app.company}</div>
                <div className="text-sm text-stone">{app.role}</div>
              </div>
            </div>

            {/* Due Date */}
            <div className="text-right">
              <div
                className={`text-sm font-medium ${getUrgencyColor(app.daysUntil)}`}
              >
                {getDaysUntilLabel(app.daysUntil)}
              </div>
              <div className="text-xs text-stone">
                {formatDate(app.nextFollowUpDate)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {followUps.some((f) => f.daysUntil <= 0) && (
        <div className="mt-4 pt-4 border-t border-smoke">
          <p className="text-sm text-danger font-medium">
            ⚠️ You have overdue follow-ups!
          </p>
        </div>
      )}
    </div>
  );
}
