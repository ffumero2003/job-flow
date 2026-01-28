import { useApp } from "../context/AppContext.jsx";
import { Toast } from "./Toast.jsx";

export function Dashboard() {
  const { applications, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-stone">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-white border-b border-smoke sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              Job<span className="text-accent">Flow</span>
            </h1>
            <p className="text-sm text-stone">Track your job search journey</p>
          </div>
          <button className="px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-sm hover:shadow-md flex items-center gap-2">
            <span className="text-lg">+</span>
            Add Application
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Phase 1: Basic layout shell */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-xl font-semibold text-ink mb-2">
                Phase 1 Complete!
              </h2>
              <p className="text-stone mb-4">
                Data layer is ready. You have {applications.length}{" "}
                application(s) stored.
              </p>
              <p className="text-sm text-stone">
                Next: Phase 2 will add KPI Cards here.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-ink mb-4">
                Sidebar Widgets
              </h3>
              <p className="text-stone text-sm">
                Pipeline Health, Follow-ups, and Insights will appear here in
                later phases.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
