import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function InsightsPanel() {
  const { applications } = useApp();

  const insights = useMemo(() => {
    const result = [];
    const total = applications.length;

    if (total === 0) return result;

    // Count by status
    const pending = applications.filter((a) => a.status === "pending").length;
    const interview = applications.filter(
      (a) => a.status === "interview",
    ).length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const offer = applications.filter((a) => a.status === "offer").length;

    // Calculate rates
    const rejectionRate = Math.round((rejected / total) * 100);
    const pendingRate = Math.round((pending / total) * 100);
    const interviewRate = Math.round((interview / total) * 100);

    // ============================================================
    // INSIGHT: High rejection rate
    // ============================================================
    if (rejectionRate > 50 && total >= 3) {
      result.push({
        type: "warning",
        icon: "⚠️",
        title: "High Rejection Rate",
        message: `${rejectionRate}% of your applications were rejected. Consider tailoring your resume for each role.`,
      });
    }

    // ============================================================
    // INSIGHT: Many pending applications
    // ============================================================
    if (pendingRate > 60 && pending >= 3) {
      result.push({
        type: "info",
        icon: "📬",
        title: "Follow Up Time",
        message: `${pendingRate}% of applications are still pending. Consider following up on older ones.`,
      });
    }

    // ============================================================
    // INSIGHT: Good interview rate
    // ============================================================
    if (interviewRate >= 25 && total >= 4) {
      result.push({
        type: "success",
        icon: "🎯",
        title: "Strong Interview Rate",
        message: `${interviewRate}% interview rate! Your applications are getting noticed.`,
      });
    } else if (interviewRate < 15 && total >= 5) {
      result.push({
        type: "info",
        icon: "💡",
        title: "Improve Interview Rate",
        message: `Only ${interviewRate}% interview rate. Try customizing your cover letters.`,
      });
    }

    // ============================================================
    // INSIGHT: Offers received
    // ============================================================
    if (offer > 0) {
      const offerRate = Math.round((offer / total) * 100);
      result.push({
        type: "success",
        icon: "🎉",
        title: "Congratulations!",
        message: `You have ${offer} offer${offer > 1 ? "s" : ""}! That's a ${offerRate}% success rate.`,
      });
    }

    // ============================================================
    // INSIGHT: Interview to offer conversion
    // ============================================================
    const totalInterviewStage = interview + offer;
    if (totalInterviewStage >= 2 && offer > 0) {
      const conversionRate = Math.round((offer / totalInterviewStage) * 100);
      result.push({
        type: "success",
        icon: "📈",
        title: "Interview Conversion",
        message: `${conversionRate}% of your interviews led to offers. Great performance!`,
      });
    }

    // ============================================================
    // INSIGHT: Weekly activity
    // ============================================================
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const thisWeek = applications.filter(
      (a) => a.createdAt > oneWeekAgo,
    ).length;
    const lastWeek = applications.filter(
      (a) => a.createdAt > twoWeeksAgo && a.createdAt <= oneWeekAgo,
    ).length;

    if (thisWeek > 0) {
      let trend = "";
      if (lastWeek > 0) {
        if (thisWeek > lastWeek) {
          trend = ` (↑ ${thisWeek - lastWeek} more than last week)`;
        } else if (thisWeek < lastWeek) {
          trend = ` (↓ ${lastWeek - thisWeek} fewer than last week)`;
        } else {
          trend = " (same as last week)";
        }
      }
      result.push({
        type: "neutral",
        icon: "📊",
        title: "Weekly Activity",
        message: `${thisWeek} application${thisWeek > 1 ? "s" : ""} this week${trend}`,
      });
    } else if (total > 0) {
      result.push({
        type: "warning",
        icon: "⏰",
        title: "Stay Active",
        message: "No applications this week. Keep the momentum going!",
      });
    }

    // ============================================================
    // INSIGHT: Milestone celebrations
    // ============================================================
    if (total === 10 || total === 25 || total === 50 || total === 100) {
      result.push({
        type: "success",
        icon: "🏆",
        title: "Milestone Reached!",
        message: `You've submitted ${total} applications! Keep going!`,
      });
    }

    // Limit to 4 most relevant insights
    return result.slice(0, 4);
  }, [applications]);

  // Style mappings
  const styles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      title: "text-emerald-800",
      text: "text-emerald-700",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      title: "text-amber-800",
      text: "text-amber-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      title: "text-blue-800",
      text: "text-blue-700",
    },
    neutral: {
      bg: "bg-stone-50",
      border: "border-stone-200",
      title: "text-stone-800",
      text: "text-stone-600",
    },
  };

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink mb-4">💡 Insights</h3>
        <p className="text-stone text-sm">
          Add applications to see personalized insights about your job search.
        </p>
      </div>
    );
  }

  // No insights yet (need more data)
  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink mb-4">💡 Insights</h3>
        <p className="text-stone text-sm">
          Keep adding applications to unlock insights about your job search
          patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-ink mb-4">💡 Insights</h3>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const style = styles[insight.type];

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${style.bg} ${style.border}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{insight.icon}</span>
                <div>
                  <div className={`font-medium text-sm ${style.title}`}>
                    {insight.title}
                  </div>
                  <div className={`text-sm ${style.text}`}>
                    {insight.message}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
