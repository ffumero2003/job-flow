import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = "jobflow_applications";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  applications: [],
  isLoading: true,
};

// In the useEffect that loads data, temporarily replace with:
// const initialState = {
//   applications: [
//     {
//       id: "1",
//       company: "Google",
//       role: "Frontend Dev",
//       status: "pending",
//       dateApplied: "2026-01-20",
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     },
//     {
//       id: "2",
//       company: "Meta",
//       role: "React Engineer",
//       status: "interview",
//       dateApplied: "2026-01-18",
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     },
//     {
//       id: "3",
//       company: "Amazon",
//       role: "SDE",
//       status: "rejected",
//       dateApplied: "2026-01-15",
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     },
//   ],
//   isLoading: false,
// };

// ============================================================
// REDUCER
// ============================================================

function appReducer(state, action) {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...state,
        applications: action.payload,
        isLoading: false,
      };

    case "ADD_APPLICATION":
      return {
        ...state,
        applications: [action.payload, ...state.applications],
      };

    case "UPDATE_APPLICATION":
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id
            ? { ...app, ...action.payload, updatedAt: Date.now() }
            : app,
        ),
      };

    case "DELETE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app.id !== action.payload,
        ),
      };

    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================

const AppContext = createContext(null);

// ============================================================
// PROVIDER COMPONENT
// ============================================================

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [toast, setToast] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : [];
      // const data = stored ? JSON.parse(stored) : initialState.applications;

      dispatch({ type: "LOAD_DATA", payload: data });
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      dispatch({ type: "LOAD_DATA", payload: [] });
    }
  }, []);

  // Save to localStorage whenever applications change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.applications));
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [state.applications, state.isLoading]);

  // Toast notification helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Add a new application
  const addApplication = useCallback(
    (data) => {
      const newApp = {
        id: crypto.randomUUID(),
        company: data.company,
        role: data.role,
        status: data.status || "pending",
        dateApplied: data.dateApplied || new Date().toISOString().split("T")[0],
        nextFollowUpDate: data.nextFollowUpDate || null,
        interviewDate: data.interviewDate || null,
        notes: data.notes || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      dispatch({ type: "ADD_APPLICATION", payload: newApp });
      showToast("Application added successfully");
      return newApp.id;
    },
    [showToast],
  );

  // Update an existing application
  const updateApplication = useCallback(
    (id, data) => {
      dispatch({ type: "UPDATE_APPLICATION", payload: { id, ...data } });
      showToast("Application updated");
    },
    [showToast],
  );

  // Delete an application
  const deleteApplication = useCallback(
    (id) => {
      dispatch({ type: "DELETE_APPLICATION", payload: id });
      showToast("Application deleted", "info");
    },
    [showToast],
  );

  // Context value
  const value = {
    // State
    applications: state.applications,
    isLoading: state.isLoading,
    toast,

    // Actions
    addApplication,
    updateApplication,
    deleteApplication,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============================================================
// CUSTOM HOOK
// ============================================================

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
