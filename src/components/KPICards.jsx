import { useMemo } from "react";
import { useApp } from "../context/AppContext";

export function KPICards() {
  const { applications } = useApp();

  const metrics = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const interview = applications.filter(
      (a) => a.status === "interview",
    ).length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    const offer = applications.filter((a) => a.status === "offer").length;
    return { total, pending, interview, rejected, offer };
  }, [applications]);

  const cards = [
    {
      label: "Total",
      value: metrics.total,
      borderColor: "border-ink",
      icon: "📊",
    },
    {
      label: "Pending",
      value: metrics.pending,
      borderColor: "border-amber-500",
      icon: "⏳",
    },
    {
      label: "Interviews",
      value: metrics.interview,
      borderColor: "border-blue-500",
      icon: "💬",
    },
    {
      label: "Rejected",
      value: metrics.rejected,
      borderColor: "border-red-500",
      icon: "🚫",
    },
    {
      label: "Offers",
      value: metrics.offer,
      borderColor: "border-emerald-500",
      icon: "🎉",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl p-5 border-l-4 ${card.borderColor} shadow-sm hover:shadow-md transition-shadow animate-fade-in`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-stone text-sm font-medium uppercase tracking-wide">
              {card.label}
            </span>
            <span className="text-lg">{card.icon}</span>
          </div>
          <div className="text-3xl font-bold text-ink font-mono">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
