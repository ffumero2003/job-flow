import { useApp } from "../context/AppContext";

export function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColor =
    {
      success: "bg-success",
      error: "bg-danger",
      info: "bg-stone",
      warning: "bg-warning",
    }[toast.type] || "bg-success";

  return (
    <div
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-5 py-3 rounded-lg shadow-lg animate-slide-up font-medium z-50`}
    >
      {toast.message}
    </div>
  );
}
