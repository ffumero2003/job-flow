import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";

/* ============================================================
   CONSTANTS
   
   Single source of truth for the localStorage key.
   If you ever need to change it, only change it here.
   ============================================================ */
const STORAGE_KEY = "jobflow_applications";

/* ============================================================
   INITIAL STATE
   
   What the app state looks like before any data loads.
   isLoading prevents saving an empty array to localStorage
   before we've had a chance to load existing data.
   ============================================================ */
const initialState = {
  applications: [],
  isLoading: true,
};

/* ============================================================
   REDUCER
   
   Pure function that takes current state + action, returns new state.
   Never mutates the original state — always returns a new object.
   
   Why a reducer instead of useState?
   - Multiple related values (applications, isLoading)
   - Complex update logic (find by ID, filter, etc.)
   - Easier to debug (log actions)
   - Predictable state transitions
   ============================================================ */
function appReducer(state, action) {
  switch (action.type) {
    /* LOAD_DATA
       Called once on mount after reading from localStorage.
       Sets applications array and marks loading complete. */
    case "LOAD_DATA":
      return {
        ...state,
        applications: action.payload,
        isLoading: false,
      };

    /* ADD_APPLICATION
       Adds new app to the START of the array.
       Why start? So newest appears first in the table. */
    case "ADD_APPLICATION":
      return {
        ...state,
        applications: [action.payload, ...state.applications],
      };

    /* UPDATE_APPLICATION
       Finds app by ID and merges in new data.
       Also updates the updatedAt timestamp. */
    case "UPDATE_APPLICATION":
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id
            ? { ...app, ...action.payload, updatedAt: Date.now() }
            : app,
        ),
      };

    /* DELETE_APPLICATION
       Filters out the app with matching ID. */
    case "DELETE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app.id !== action.payload,
        ),
      };

    /* Default: return unchanged state for unknown actions */
    default:
      return state;
  }
}

/* ============================================================
   CONTEXT
   
   React Context allows passing data through the component tree
   without manually passing props at every level.
   ============================================================ */
const AppContext = createContext(null);

/* ============================================================
   PROVIDER COMPONENT
   
   Wraps the app and provides state + actions to all children.
   Any component can access this via useApp() hook.
   ============================================================ */
export function AppProvider({ children }) {
  /* useReducer: Like useState but for complex state logic.
     Returns [currentState, dispatchFunction] */
  const [state, dispatch] = useReducer(appReducer, initialState);

  /* Toast state: Separate from reducer because it's UI-only,
     doesn't need to persist, and has different lifecycle */
  const [toast, setToast] = useState(null);

  /* --------------------------------------------------------
     LOAD FROM LOCALSTORAGE
     
     Runs once on mount (empty dependency array).
     Tries to parse stored JSON, falls back to empty array.
     -------------------------------------------------------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : [];
      dispatch({ type: "LOAD_DATA", payload: data });
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      dispatch({ type: "LOAD_DATA", payload: [] });
    }
  }, []);

  /* --------------------------------------------------------
     SAVE TO LOCALSTORAGE
     
     Runs whenever applications array changes.
     The isLoading check prevents saving empty array before
     initial load completes.
     -------------------------------------------------------- */
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.applications));
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [state.applications, state.isLoading]);

  /* --------------------------------------------------------
     TOAST HELPER
     
     Shows a notification that auto-dismisses after 3 seconds.
     useCallback memoizes the function to prevent unnecessary
     re-renders of components that depend on it.
     -------------------------------------------------------- */
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /* --------------------------------------------------------
     ADD APPLICATION
     
     Creates a new application object with:
     - Generated UUID for unique identification
     - User-provided data spread in
     - Timestamps for tracking
     -------------------------------------------------------- */
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

  /* --------------------------------------------------------
     UPDATE APPLICATION
     
     Dispatches update with ID and new data.
     Reducer handles finding the right app and merging.
     -------------------------------------------------------- */
  const updateApplication = useCallback(
    (id, data) => {
      dispatch({ type: "UPDATE_APPLICATION", payload: { id, ...data } });
      showToast("Application updated");
    },
    [showToast],
  );

  /* --------------------------------------------------------
     DELETE APPLICATION
     
     Dispatches delete with just the ID.
     Reducer handles filtering it out.
     -------------------------------------------------------- */
  const deleteApplication = useCallback(
    (id) => {
      dispatch({ type: "DELETE_APPLICATION", payload: id });
      showToast("Application deleted", "info");
    },
    [showToast],
  );

  /* --------------------------------------------------------
     CONTEXT VALUE
     
     Everything that child components can access.
     Organized into State and Actions for clarity.
     -------------------------------------------------------- */
  const value = {
    // State (read-only for consumers)
    applications: state.applications,
    isLoading: state.isLoading,
    toast,

    // Actions (functions to modify state)
    addApplication,
    updateApplication,
    deleteApplication,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ============================================================
   CUSTOM HOOK
   
   Provides a clean API for components to access context.
   Also adds error handling if used outside Provider.
   ============================================================ */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
