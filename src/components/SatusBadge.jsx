export function StatusBadge({ status }) {
  const config = {
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      dot: "bg-amber-500",
    },
    interview: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
    rejected: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
    offer: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} px-3 py-1 text-sm rounded-full font-medium capitalize`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
      {status}
    </span>
  );
}
