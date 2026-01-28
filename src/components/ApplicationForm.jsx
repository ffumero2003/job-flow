import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getTodayISO } from "../utils/dateUtils";

export function ApplicationForm({ isOpen, onClose, editingApp }) {
  const { addApplication, updateApplication } = useApp();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "pending",
    dateApplied: getTodayISO(),
    nextFollowUpDate: "",
    interviewDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Reset form when opening/closing or when editingApp changes
  useEffect(() => {
    if (editingApp) {
      setFormData({
        company: editingApp.company || "",
        role: editingApp.role || "",
        status: editingApp.status || "pending",
        dateApplied: editingApp.dateApplied || getTodayISO(),
        nextFollowUpDate: editingApp.nextFollowUpDate || "",
        interviewDate: editingApp.interviewDate || "",
        notes: editingApp.notes || "",
      });
    } else {
      setFormData({
        company: "",
        role: "",
        status: "pending",
        dateApplied: getTodayISO(),
        nextFollowUpDate: "",
        interviewDate: "",
        notes: "",
      });
    }
    setErrors({});
  }, [editingApp, isOpen]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (editingApp) {
      updateApplication(editingApp.id, formData);
    } else {
      addApplication(formData);
    }

    onClose();
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-40 animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-smoke flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">
            {editingApp ? "Edit Application" : "Add New Application"}
          </h2>
          <button
            onClick={onClose}
            className="text-stone hover:text-ink transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone mb-1">
                Company <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
                  errors.company ? "border-danger" : "border-smoke"
                }`}
                placeholder="Google"
              />
              {errors.company && (
                <p className="text-danger text-xs mt-1">{errors.company}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone mb-1">
                Role <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
                  errors.role ? "border-danger" : "border-smoke"
                }`}
                placeholder="Frontend Developer"
              />
              {errors.role && (
                <p className="text-danger text-xs mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Status & Date Applied */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-4 py-2.5 border border-smoke rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors bg-white"
              >
                <option value="pending">⏳ Pending</option>
                <option value="interview">💬 Interview</option>
                <option value="rejected">✗ Rejected</option>
                <option value="offer">🎉 Offer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone mb-1">
                Date Applied
              </label>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => handleChange("dateApplied", e.target.value)}
                className="w-full px-4 py-2.5 border border-smoke rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Follow-up Date & Interview Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.nextFollowUpDate}
                onChange={(e) =>
                  handleChange("nextFollowUpDate", e.target.value)
                }
                className="w-full px-4 py-2.5 border border-smoke rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone mb-1">
                Interview Date
              </label>
              <input
                type="date"
                value={formData.interviewDate}
                onChange={(e) => handleChange("interviewDate", e.target.value)}
                className="w-full px-4 py-2.5 border border-smoke rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-stone mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full px-4 py-2.5 border border-smoke rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none"
              rows="3"
              placeholder="Any additional notes about this application..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-smoke rounded-lg text-stone hover:bg-smoke transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              {editingApp ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
