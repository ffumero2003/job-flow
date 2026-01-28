import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  getDaysUntil,
  getDaysUntilLabel,
  formatDate,
} from "../utils/dateUtils";

export function UpcomingInterviewsWidget() {
  const { applications } = useApp();

  const interviews = useMemo(() => {
    return (
      applications
        // Only include apps with interview status and interview date
        .filter((a) => a.status === "interview" && a.interviewDate)
        // Calculate days until interview
        .map((a) => ({
          ...a,
          daysUntil: getDaysUntil(a.interviewDate),
        }))
        // Only show upcoming (not past)
        .filter((a) => a.daysUntil >= 0)
        // Sort by closest first
        .sort((a, b) => a.daysUntil - b.daysUntil)
        // Limit to 5
        .slice(0, 5)
    );
  }, [applications]);

  // Get urgency styling based on days until
  const getUrgencyStyles = (days) => {
    if (days === 0) {
      return {
        badge: "bg-danger text-white",
        text: "text-danger",
        dot: "bg-danger animate-pulse",
      };
    }
    if (days === 1) {
      return {
        badge: "bg-warning text-white",
        text: "text-warning",
        dot: "bg-warning",
      };
    }
    if (days <= 3) {
      return {
        badge: "bg-accent text-white",
        text: "text-accent",
        dot: "bg-accent",
      };
    }
    return {
      badge: "bg-smoke text-stone",
      text: "text-stone",
      dot: "bg-stone",
    };
  };

  // Empty state
  if (interviews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink mb-4">
          💬 Upcoming Interviews
        </h3>
        <p className="text-stone text-sm">
          No interviews scheduled. When you set an application to "Interview"
          status and add an interview date, it will appear here.
        </p>
      </div>
    );
  }

  // Count interviews today
  const interviewsToday = interviews.filter((i) => i.daysUntil === 0).length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ink">
          💬 Upcoming Interviews
        </h3>
        {interviewsToday > 0 && (
          <span className="px-2 py-1 bg-danger text-white text-xs font-medium rounded-full">
            {interviewsToday} today!
          </span>
        )}
      </div>

      <div className="space-y-3">
        {interviews.map((app) => {
          const styles = getUrgencyStyles(app.daysUntil);

          return (
            <div
              key={app.id}
              className={`flex items-center justify-between py-3 px-3 rounded-lg border border-smoke ${
                app.daysUntil === 0 ? "bg-danger/5 border-danger/20" : ""
              }`}
            >
              {/* Company & Role */}
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
                <div>
                  <div className="font-medium text-ink">{app.company}</div>
                  <div className="text-sm text-stone">{app.role}</div>
                </div>
              </div>

              {/* Interview Date */}
              <div className="text-right">
                <div className={`text-sm font-semibold ${styles.text}`}>
                  {getDaysUntilLabel(app.daysUntil)}
                </div>
                <div className="text-xs text-stone">
                  {formatDate(app.interviewDate)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preparation Tip */}
      {interviews.length > 0 && interviews[0].daysUntil <= 1 && (
        <div className="mt-4 pt-4 border-t border-smoke">
          <p className="text-sm text-accent font-medium">
            💡 Tip: Review your notes and prepare questions!
          </p>
        </div>
      )}
    </div>
  );
}
