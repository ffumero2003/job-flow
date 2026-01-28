import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Toast } from "./Toast";
import { KPICards } from "./KPICards";
import { ApplicationsTable } from "./ApplicationsTable";
import { ApplicationForm } from "./ApplicationForm";
import { PipelineHealth } from "./PipelineHealth";
import { FollowUpsWidget } from "./FollowUpsWidget";
import { UpcomingInterviewsWidget } from "./UpcomingWidget";
import { InsightsPanel } from "./InsightsPanel";

export function Dashboard() {
  const { applications, isLoading } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const handleAddNew = () => {
    setEditingApp(null);
    setIsFormOpen(true);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingApp(null);
  };

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
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Application
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <section>
          <KPICards />
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area - Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">Applications</h2>
              <span className="text-sm text-stone">
                {applications.length} total
              </span>
            </div>
            <ApplicationsTable onEdit={handleEdit} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PipelineHealth />
            <FollowUpsWidget />
            <UpcomingInterviewsWidget />
            <InsightsPanel />
          </div>
        </div>
      </main>

      {/* Application Form Modal */}
      <ApplicationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingApp={editingApp}
      />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
// ```

// ---

// ### Summary

// | File | Action |
// |------|--------|
// | `src/components/InsightsPanel.jsx` | **CREATE** — Smart insights widget |
// | `src/components/Dashboard.jsx` | **REPLACE** — Add InsightsPanel to sidebar |

// ---

// ### What's New — Insight Types

// | Insight | Triggers When |
// |---------|---------------|
// | **High Rejection Rate** | >50% rejected, 3+ applications |
// | **Follow Up Time** | >60% pending, 3+ pending |
// | **Strong Interview Rate** | ≥25% interview rate, 4+ applications |
// | **Improve Interview Rate** | <15% interview rate, 5+ applications |
// | **Congratulations (Offers)** | Any offers received |
// | **Interview Conversion** | Offers from interviews, 2+ in interview stage |
// | **Weekly Activity** | Shows this week's count + comparison to last week |
// | **Stay Active** | No applications this week |
// | **Milestone Reached** | Hit 10, 25, 50, or 100 applications |

// ---

// ### Features

// | Feature | Description |
// |---------|-------------|
// | **Color-coded cards** | Green (success), Orange (warning), Blue (info), Gray (neutral) |
// | **Smart filtering** | Only shows relevant insights based on your data |
// | **Weekly trends** | Compares this week vs last week |
// | **Limited to 4** | Shows most relevant insights only |
// | **Actionable advice** | Each insight includes a suggestion |

// ---

// ### To Test

// Add various applications to trigger different insights:

// 1. **Add 5 applications, reject 3** → "High Rejection Rate" warning
// 2. **Add 5 applications, all pending** → "Follow Up Time" info
// 3. **Add 4 applications, 1 interview** → "Strong Interview Rate" success
// 4. **Add 1 offer** → "Congratulations!" success
// 5. **Add applications today** → "Weekly Activity" shows count
// 6. **Wait (or don't add any)** → "Stay Active" warning
// 7. **Add exactly 10 applications** → "Milestone Reached!" celebration

// ---

// ## 🎉 All 8 Phases Complete!

// Your **JobFlow** micro-SaaS is now fully functional:

// | Phase | Feature | Status |
// |-------|---------|--------|
// | 1 | Project Setup + Data Layer | ✅ |
// | 2 | KPI Cards | ✅ |
// | 3 | Applications Table | ✅ |
// | 4 | Application Form | ✅ |
// | 5 | Pipeline Health | ✅ |
// | 6 | Follow-ups Widget | ✅ |
// | 7 | Upcoming Interviews | ✅ |
// | 8 | Insights Panel | ✅ |

// ---

// ### Final File Structure
// ```
// src/
// ├── components/
// │   ├── ApplicationForm.jsx
// │   ├── ApplicationsTable.jsx
// │   ├── Dashboard.jsx
// │   ├── FollowUpsWidget.jsx
// │   ├── InsightsPanel.jsx
// │   ├── KPICards.jsx
// │   ├── PipelineHealth.jsx
// │   ├── Toast.jsx
// │   └── UpcomingInterviewsWidget.jsx
// ├── context/
// │   └── AppContext.jsx
// ├── utils/
// │   └── dateUtils.js
// ├── App.jsx
// ├── App.css
// ├── index.css
// └── main.jsx
