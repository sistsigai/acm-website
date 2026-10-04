import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion as m } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import ConfirmModal from "../../components/Common/ConfirmModal";
import CustomSelect from "../../components/Common/CustomSelect";
import {
  getAllAdmins,
  getBatchMembersForAdmin,
  createAdminAccount,
  updateAdminAccount,
  toggleAdminStatus,
  resetAdminPassword,
  deleteAdminAccount,
  type AdminUserRecord,
  type BatchMemberOption,
  type AdminPermission,
} from "../../services/admin/adminUserService";
import { useAuth } from "../../context/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaUsers,
  FaTachometerAlt,
  FaCheck,
} from "react-icons/fa";

interface ToastState {
  show: boolean;
  variant: "success" | "error" | "info" | "warning";
  message: string;
  title?: string;
}

const AVAILABLE_PERMISSIONS: { key: AdminPermission; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt color="#38bdf8" />,
    desc: "View analytics, chapter metrics, and registration counts",
  },
  {
    key: "members",
    label: "Members",
    icon: <FaUsers color="#a855f7" />,
    desc: "Manage leadership, core units, faculty & website members",
  },
  {
    key: "events",
    label: "Events",
    icon: <FaCalendarAlt color="#34d399" />,
    desc: "Create & edit events, manage attendees, export data & scan QR",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active Accounts" },
  { value: "disabled", label: "Disabled Accounts" },
];

const AdminUsers: React.FC = () => {
  const { user: currentAuthUser } = useAuth();
  const [admins, setAdmins] = useState<AdminUserRecord[]>([]);
  const [batchMembers, setBatchMembers] = useState<BatchMemberOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toast, setToast] = useState<ToastState | null>(null);

  // Modal States
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Password Reset Modal States
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetTargetAdmin, setResetTargetAdmin] = useState<AdminUserRecord | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);

  // Delete Confirm Modal States
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUserRecord | null>(null);

  // Admin Form State
  const [formData, setFormData] = useState<{
    memberId: string;
    name: string;
    username: string;
    password: string;
    permissions: AdminPermission[];
    isActive: boolean;
  }>({
    memberId: "",
    name: "",
    username: "",
    password: "",
    permissions: ["dashboard", "events"],
    isActive: true,
  });

  const showToast = (variant: "success" | "error" | "info" | "warning", message: string, title?: string) => {
    setToast({ show: true, variant, message, title });
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [adminsData, membersData] = await Promise.all([
        getAllAdmins(),
        getBatchMembersForAdmin(),
      ]);
      setAdmins(adminsData);
      setBatchMembers(membersData);
    } catch (err: any) {
      console.error("Error loading admin users:", err);
      showToast("error", err.message || "Failed to load admin users", "Load Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setFormData({
      memberId: "",
      name: "",
      username: "",
      password: "",
      permissions: ["dashboard", "events"],
      isActive: true,
    });
    setShowAdminModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (admin: AdminUserRecord) => {
    setEditingAdmin(admin);
    setFormData({
      memberId: admin.memberId?._id || "",
      name: admin.name || "",
      username: admin.username || "",
      password: "",
      permissions: admin.permissions || [],
      isActive: admin.isActive,
    });
    setShowAdminModal(true);
  };

  // Handle member selection dropdown change
  const handleMemberSelect = (selectedMemberId: string) => {
    if (!selectedMemberId) {
      setFormData((prev) => ({
        ...prev,
        memberId: "",
      }));
      return;
    }

    const member = batchMembers.find((m) => m._id === selectedMemberId);
    if (member) {
      const cleanSlug = member.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "");
      const suggestedUsername = cleanSlug ? `${cleanSlug}.sigai` : "";

      setFormData((prev) => ({
        ...prev,
        memberId: member._id,
        name: member.name,
        username: editingAdmin ? prev.username : suggestedUsername,
      }));
    }
  };

  // Toggle single permission checkbox
  const handleTogglePermission = (permission: AdminPermission) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);
      const newPerms = exists
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: newPerms };
    });
  };

  // Select all permissions
  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: ["dashboard", "members", "events"],
    }));
  };

  // Submit Create / Edit Admin Form
  const handleSubmitAdminForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      showToast("warning", "Please enter a valid Username.", "Validation Error");
      return;
    }

    if (!editingAdmin && (!formData.password || formData.password.length < 6)) {
      showToast("warning", "Password must be at least 6 characters long.", "Validation Error");
      return;
    }

    if (formData.permissions.length === 0) {
      showToast("warning", "Please grant at least one page permission for this admin.", "Permissions Required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingAdmin) {
        // Update
        const updated = await updateAdminAccount(editingAdmin._id, {
          name: formData.name,
          role: "admin",
          permissions: formData.permissions,
          memberId: formData.memberId || null,
          isActive: formData.isActive,
        });

        setAdmins((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
        showToast("success", `Admin '${updated.username}' updated successfully.`);
      } else {
        // Create
        const created = await createAdminAccount({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          role: "admin",
          permissions: formData.permissions,
          memberId: formData.memberId || null,
          isActive: formData.isActive,
        });

        setAdmins((prev) => [created, ...prev]);
        showToast("success", `Admin '${created.username}' created successfully.`);
      }

      setShowAdminModal(false);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message || "Failed to save admin user", "Save Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Admin Status
  const handleToggleStatus = async (admin: AdminUserRecord) => {
    if (admin._id === currentAuthUser?.id) {
      showToast("warning", "You cannot disable your own active account.", "Action Blocked");
      return;
    }

    try {
      const res = await toggleAdminStatus(admin._id);
      setAdmins((prev) =>
        prev.map((a) => (a._id === admin._id ? { ...a, isActive: res.isActive } : a))
      );
      showToast("success", res.message);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message || "Failed to toggle status");
    }
  };

  // Submit Password Reset
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetAdmin) return;

    if (!newPassword || newPassword.length < 6) {
      showToast("warning", "Password must be at least 6 characters.", "Validation Error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("warning", "Passwords do not match.", "Validation Error");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await resetAdminPassword(resetTargetAdmin._id, newPassword);
      showToast("success", res.message);
      setShowResetModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setResetTargetAdmin(null);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Admin
  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      setIsSubmitting(true);
      const res = await deleteAdminAccount(adminToDelete._id);
      setAdmins((prev) => prev.filter((a) => a._id !== adminToDelete._id));
      showToast("success", res.message);
      setShowDeleteModal(false);
      setAdminToDelete(null);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message || "Failed to delete admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Admins (Strictly sub-admins; superadmin manages their master credentials in Profile)
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const isSuper = (admin.role || "").toLowerCase() === "superadmin";
      if (isSuper) return false;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        admin.username.toLowerCase().includes(q) ||
        (admin.name && admin.name.toLowerCase().includes(q)) ||
        (admin.memberId?.designation &&
          admin.memberId.designation.toLowerCase().includes(q));

      if (statusFilter === "active") return matchesSearch && admin.isActive;
      if (statusFilter === "disabled") return matchesSearch && !admin.isActive;
      return matchesSearch;
    });
  }, [admins, searchQuery, statusFilter]);

  return (
    <AdminLayout
      active="Admin Users"
      loading={loading || isSubmitting}
      toast={toast || undefined}
      onCloseToast={() => setToast(null)}
    >
      <m.div
        className="mobile-offset pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <m.div
          className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div>
            <h2 className="fw-bold text-white mb-1">Admin User Management</h2>
            <p className="text-secondary m-0">
              Create and manage administrative sub-accounts with page-level access permissions
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-primary px-4 py-2 fw-semibold shadow-lg d-flex align-items-center gap-2"
              onClick={handleOpenCreate}
              style={{ borderRadius: "12px" }}
            >
              <i className="bi bi-person-plus-fill"></i>
              <span>Create Admin User</span>
            </button>
          </div>
        </m.div>

        {/* Search & Filter Bar */}
        <m.div
          className="row g-3 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
        >
          <div className="col-12 col-md-8">
            <div className="admin-search-bar">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search by name, username, designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <CustomSelect
              value={statusFilter}
              options={STATUS_OPTIONS}
              onChange={setStatusFilter}
              icon="bi-filter"
              label="Filter by Status"
            />
          </div>
        </m.div>

        {/* Admins Table / Card List */}
        <div className="glass-panel rounded-4 overflow-hidden border-0 shadow-lg">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: "transparent" }}>
              <thead>
                <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th className="py-3 px-4 text-secondary small text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    Administrator / Member
                  </th>
                  <th className="py-3 px-3 text-secondary small text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    Role
                  </th>
                  <th className="py-3 px-3 text-secondary small text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    Granted Pages
                  </th>
                  <th className="py-3 px-3 text-secondary small text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    Status
                  </th>
                  <th className="py-3 px-4 text-end text-secondary small text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-secondary">
                      <i className="bi bi-people display-4 opacity-50 mb-3 d-block"></i>
                      <h6 className="text-white">No administrative users found</h6>
                      <p className="small text-secondary mb-0">Click "Create Admin User" to assign access to a member.</p>
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => {
                    const isSelf = admin._id === currentAuthUser?.id;

                    return (
                      <tr key={admin._id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                        {/* Admin Info */}
                        <td className="py-3 px-4">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0 position-relative"
                              style={{
                                width: 44,
                                height: 44,
                                background: "rgba(56, 189, 248, 0.2)",
                                border: "2px solid rgba(56, 189, 248, 0.5)",
                              }}
                            >
                              {admin.memberId?.imageUrl ? (
                                <img
                                  src={admin.memberId.imageUrl}
                                  alt={admin.name || admin.username}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <span
                                  className="fw-bold"
                                  style={{ color: "#38bdf8", fontSize: "1rem" }}
                                >
                                  {(admin.name || admin.username).charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div>
                              <div className="d-flex align-items-center gap-2">
                                <span className="fw-semibold text-white">
                                  {admin.name || admin.username}
                                </span>
                                {isSelf && (
                                  <span
                                    className="badge px-2 py-0.5 rounded-pill"
                                    style={{
                                      background: "rgba(56, 189, 248, 0.2)",
                                      color: "#38bdf8",
                                      border: "1px solid rgba(56, 189, 248, 0.4)",
                                      fontSize: "0.65rem",
                                      fontWeight: 600,
                                    }}
                                  >
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-secondary small" style={{ fontSize: "0.78rem" }}>
                                @{admin.username}
                              </div>
                              {admin.memberId && (
                                <div className="text-info small mt-0.5" style={{ fontSize: "0.72rem" }}>
                                  <i className="bi bi-mortarboard me-1"></i>
                                  {admin.memberId.designation} ({admin.memberId.batch})
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-3">
                          <span
                            className="badge px-2.5 py-1 rounded-pill"
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              letterSpacing: "0.5px",
                              background: "rgba(56, 189, 248, 0.2)",
                              color: "#38bdf8",
                              border: "1px solid rgba(56, 189, 248, 0.4)",
                            }}
                          >
                            🛡️ ADMIN
                          </span>
                        </td>

                        {/* Granted Pages */}
                        <td className="py-3 px-3">
                          {admin.permissions && admin.permissions.length > 0 ? (
                            <div className="d-flex flex-wrap gap-1">
                              {admin.permissions.map((p) => {
                                const meta = AVAILABLE_PERMISSIONS.find((item) => item.key === p);
                                return (
                                  <span
                                    key={p}
                                    className="badge d-inline-flex align-items-center gap-1.5 px-2 py-1"
                                    style={{
                                      fontSize: "0.7rem",
                                      background: "rgba(255, 255, 255, 0.06)",
                                      border: "1px solid rgba(255, 255, 255, 0.1)",
                                      color: "#e2e8f0",
                                      borderRadius: "6px",
                                    }}
                                  >
                                    {meta?.icon} {meta?.label || p}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-danger small">No pages assigned</span>
                          )}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="form-check form-switch mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={admin.isActive}
                                disabled={isSelf}
                                onChange={() => handleToggleStatus(admin)}
                                style={{ cursor: isSelf ? "not-allowed" : "pointer" }}
                              />
                            </div>
                            <span
                              className={`small fw-semibold ${admin.isActive ? "text-success" : "text-danger"}`}
                              style={{ fontSize: "0.78rem" }}
                            >
                              {admin.isActive ? "Active" : "Disabled"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-end">
                          <div
                            className="d-flex align-items-center justify-content-end"
                            style={{ gap: "12px" }}
                          >
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info rounded-3 d-inline-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "10px",
                                border: "1px solid rgba(56, 189, 248, 0.4)",
                                background: "rgba(56, 189, 248, 0.08)",
                                color: "#38bdf8",
                                transition: "all 0.2s ease",
                              }}
                              title="Edit Admin & Permissions"
                              onClick={() => handleOpenEdit(admin)}
                            >
                              <i className="bi bi-pencil-square" style={{ fontSize: "1rem" }}></i>
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning rounded-3 d-inline-flex align-items-center justify-content-center p-0"
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "10px",
                                border: "1px solid rgba(234, 179, 8, 0.4)",
                                background: "rgba(234, 179, 8, 0.08)",
                                color: "#facc15",
                                transition: "all 0.2s ease",
                              }}
                              title="Reset Password"
                              onClick={() => {
                                setResetTargetAdmin(admin);
                                setNewPassword("");
                                setConfirmPassword("");
                                setShowResetModal(true);
                              }}
                            >
                              <i className="bi bi-key-fill" style={{ fontSize: "1rem" }}></i>
                            </button>

                            {!isSelf && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger rounded-3 d-inline-flex align-items-center justify-content-center p-0"
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  borderRadius: "10px",
                                  border: "1px solid rgba(239, 68, 68, 0.4)",
                                  background: "rgba(239, 68, 68, 0.08)",
                                  color: "#f87171",
                                  transition: "all 0.2s ease",
                                }}
                                title="Delete Admin"
                                onClick={() => {
                                  setAdminToDelete(admin);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <i className="bi bi-trash3-fill" style={{ fontSize: "1rem" }}></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </m.div>

      {/* =========================================================
          CREATE / EDIT ADMIN MODAL
          ========================================================= */}
      {showAdminModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setShowAdminModal(false);
            }
          }}
        >
          <div className="admin-modal-container p-4 p-md-4 m-2" style={{ maxWidth: "860px", width: "100%" }}>
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${editingAdmin ? "bi-pencil-square text-primary" : "bi-person-plus text-primary"} fs-5`}></i>
                <h5 className="m-0 fw-bold text-white" style={{ fontSize: "1.2rem" }}>
                  {editingAdmin ? "Edit Admin & Permissions" : "Create New Admin User"}
                </h5>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-secondary p-1 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
                onClick={() => setShowAdminModal(false)}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-lg" style={{ fontSize: "0.9rem" }}></i>
              </button>
            </div>

            <form onSubmit={handleSubmitAdminForm}>
              {/* Member Selection Dropdown */}
              <div className="mb-3">
                <label className="admin-form-label">
                  Link with Current Batch Member (Optional)
                </label>
                <select
                  className="form-select form-control-glass"
                  value={formData.memberId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                >
                  <option value="" style={{ background: "#0f172a" }}>
                    -- No Member Selected (Custom Admin) --
                  </option>
                  {batchMembers.map((member) => (
                    <option key={member._id} value={member._id} style={{ background: "#0f172a" }}>
                      {member.name} — {member.designation} ({member.batch})
                    </option>
                  ))}
                </select>
                <small className="text-secondary" style={{ fontSize: "0.72rem" }}>
                  Selecting a member auto-suggests their display name and login identifier.
                </small>
              </div>

              {/* Name & Username Row */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Full Name / Display Name</label>
                  <input
                    type="text"
                    className="form-control form-control-glass"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Username / Login Identifier <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-glass"
                    placeholder="e.g. john.sigai"
                    disabled={Boolean(editingAdmin)}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                  {editingAdmin && (
                    <small className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Username cannot be changed after creation.
                    </small>
                  )}
                </div>
              </div>

              {/* Password Row (only on Create) */}
              {!editingAdmin && (
                <div className="mb-3">
                  <label className="admin-form-label">
                    Initial Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPasswordText ? "text" : "password"}
                      className="form-control form-control-glass pe-5"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y text-secondary border-0"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                    >
                      {showPasswordText ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Page Access Checkboxes in Responsive Grid */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="admin-form-label mb-0">
                    Accessible Pages & Permissions
                  </label>
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-info p-0 text-decoration-none"
                    style={{ fontSize: "0.75rem" }}
                    onClick={handleSelectAllPermissions}
                  >
                    Select All
                  </button>
                </div>

                <div className="row g-3">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = formData.permissions.includes(perm.key);
                    return (
                      <div key={perm.key} className="col-12 col-md-4">
                        <div
                          className="p-3 rounded-3 d-flex flex-column justify-content-between h-100 cursor-pointer"
                          style={{
                            background: isChecked ? "rgba(56, 189, 248, 0.08)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${isChecked ? "rgba(56, 189, 248, 0.35)" : "rgba(255,255,255,0.07)"}`,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleTogglePermission(perm.key)}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: 34,
                                height: 34,
                                background: "rgba(255,255,255,0.06)",
                              }}
                            >
                              {perm.icon}
                            </div>

                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(perm.key)}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="fw-semibold text-white small mb-1">{perm.label}</div>
                            <div className="text-secondary" style={{ fontSize: "0.72rem", lineHeight: 1.4 }}>
                              {perm.desc}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Account Status Switch */}
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div>
                  <div className="text-white fw-semibold small">Account Status</div>
                  <div className="text-secondary" style={{ fontSize: "0.72rem" }}>
                    Allow this administrator to sign in and access their console.
                  </div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3 px-3 py-2 text-white"
                  onClick={() => setShowAdminModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-3 px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck size={14} />
                      <span>{editingAdmin ? "Update Admin" : "Create Admin"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          PASSWORD RESET MODAL
          ========================================================= */}
      {showResetModal && resetTargetAdmin && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setShowResetModal(false);
            }
          }}
        >
          <div className="admin-modal-container p-4 p-md-4 m-2" style={{ maxWidth: "460px", width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-key-fill text-warning fs-5"></i>
                <h5 className="m-0 fw-bold text-white" style={{ fontSize: "1.15rem" }}>
                  Reset Password
                </h5>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-secondary p-1 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
                onClick={() => setShowResetModal(false)}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-lg" style={{ fontSize: "0.9rem" }}></i>
              </button>
            </div>

            <p className="text-secondary small mb-4">
              Enter a new password for administrator <strong className="text-white">{resetTargetAdmin.username}</strong>.
            </p>

            <form onSubmit={handleResetPasswordSubmit}>
              <div className="mb-3">
                <label className="admin-form-label">New Password</label>
                <input
                  type="password"
                  className="form-control form-control-glass"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="admin-form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control form-control-glass"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3 px-3 py-2 text-white"
                  onClick={() => setShowResetModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-warning rounded-3 px-4 py-2 fw-semibold text-dark d-flex align-items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Admin Account"
        message="Are you sure you want to delete this administrator account? All assigned privileges and access rights will be permanently revoked."
        itemName={adminToDelete ? adminToDelete.username : undefined}
        confirmText="Delete Account"
        confirmVariant="danger"
        isProcessing={isSubmitting}
        onConfirm={handleDeleteAdmin}
        onCancel={() => {
          setShowDeleteModal(false);
          setAdminToDelete(null);
        }}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
