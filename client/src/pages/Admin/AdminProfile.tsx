import React, { useState, useEffect, useCallback } from "react";
import { motion as m, type Variants } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  type AdminProfileData,
} from "../../services/admin/profileService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const AdminProfile: React.FC = () => {
  const { user: authUser, checkAuth } = useAuth();
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Profile Form State
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);

  const [toast, setToast] = useState<{
    show: boolean;
    variant: "success" | "error" | "info" | "warning";
    message: string;
    title?: string;
  } | null>(null);

  const showToast = (variant: "success" | "error" | "info" | "warning", message: string, title?: string) => {
    setToast({ show: true, variant, message, title });
  };

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      setName(data.name || "");
      setUsername(data.username || "");
    } catch (err: any) {
      console.error("Error loading profile:", err);
      showToast("error", err.response?.data?.message || err.message || "Failed to load profile", "Load Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      showToast("warning", "Username cannot be empty.", "Validation Error");
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await updateMyProfile({
        name: name.trim(),
        username: username.trim(),
      });

      showToast("success", res.message || "Profile updated successfully!", "Success");
      await checkAuth();
      await loadProfile();
    } catch (err: any) {
      showToast(
        "error",
        err.response?.data?.message || err.message || "Failed to update profile",
        "Update Failed"
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      showToast("warning", "New password must be at least 6 characters long.", "Validation Error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("warning", "New passwords do not match.", "Validation Error");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await changeMyPassword({
        currentPassword: currentPassword || undefined,
        newPassword,
      });

      showToast("success", res.message || "Password updated successfully!", "Security Updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(
        "error",
        err.response?.data?.message || err.message || "Failed to change password",
        "Password Change Failed"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const isSuperadmin = profile?.role === "superadmin" || authUser?.role === "superadmin";

  return (
    <AdminLayout
      active="Profile"
      loading={loading || isSavingProfile || isChangingPassword}
      toast={toast || undefined}
      onCloseToast={() => setToast(null)}
    >
      <m.div
        className="mobile-offset pb-5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <m.div
          className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
          variants={itemVariants}
        >
          <div>
            <h2 className="fw-bold text-white mb-1">
              {isSuperadmin ? "Superadmin Profile & Security" : "Admin Profile & Security"}
            </h2>
            <p className="text-secondary m-0">
              Manage your credentials, master username, and account security
            </p>
          </div>
        </m.div>

        {/* Profile Overview Banner */}
        <m.div className="glass-panel rounded-4 p-4 mb-4 border-0 shadow-lg" variants={itemVariants}>
          <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
            <div
              className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 80,
                height: 80,
                background: isSuperadmin ? "rgba(168, 85, 247, 0.2)" : "rgba(56, 189, 248, 0.2)",
                border: `3px solid ${isSuperadmin ? "#c084fc" : "#38bdf8"}`,
                boxShadow: isSuperadmin ? "0 0 20px rgba(168, 85, 247, 0.35)" : "0 0 20px rgba(56, 189, 248, 0.35)",
              }}
            >
              {profile?.member?.imageUrl ? (
                <img
                  src={profile.member.imageUrl}
                  alt={profile.name || profile.username}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  className="fw-bold"
                  style={{ color: isSuperadmin ? "#c084fc" : "#38bdf8", fontSize: "2rem" }}
                >
                  {(name || username || "A").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="text-center text-sm-start flex-grow-1">
              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2 mb-1">
                <h4 className="fw-bold text-white mb-0">{name || username}</h4>
                <span
                  className="badge px-2.5 py-1 rounded-pill"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    background: isSuperadmin ? "rgba(168, 85, 247, 0.2)" : "rgba(56, 189, 248, 0.2)",
                    color: isSuperadmin ? "#c084fc" : "#38bdf8",
                    border: `1px solid ${isSuperadmin ? "rgba(168, 85, 247, 0.45)" : "rgba(56, 189, 248, 0.45)"}`,
                  }}
                >
                  {isSuperadmin ? "⭐ Superadmin (Full Access)" : "🛡️ Admin User"}
                </span>
              </div>

              <div className="text-secondary small mb-1">
                <span className="text-white-50">@{username}</span>
              </div>

              {profile?.member && (
                <div className="text-info small mt-1">
                  <i className="bi bi-mortarboard me-1"></i>
                  Linked Batch Member: <strong>{profile.member.name}</strong> ({profile.member.designation} - {profile.member.batch})
                </div>
              )}
            </div>
          </div>
        </m.div>

        {/* 2-Column Grid: Profile Details & Password Management */}
        <div className="row g-4">
          {/* Left Column: Account Details */}
          <m.div className="col-12 col-lg-6" variants={itemVariants}>
            <div className="glass-panel rounded-4 p-4 border-0 h-100 shadow-lg d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-white mb-4 border-bottom border-secondary border-opacity-25 pb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-person-badge text-primary"></i>
                  Account Profile Settings
                </h5>

                <form onSubmit={handleSaveProfile} id="profile-form">
                  {/* Full Name */}
                  <div className="mb-4">
                    <label className="admin-form-label">Display / Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-glass"
                      placeholder="Enter display name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <small className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      This name will appear on the top header and activity records.
                    </small>
                  </div>

                  {/* Master Username */}
                  <div className="mb-4">
                    <label className="admin-form-label">
                      Master Username / Login Identifier <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-glass"
                      placeholder="e.g. superadmin or admin.sigai"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <small className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Used for signing in to the admin console.
                    </small>
                  </div>
                </form>
              </div>

              <div className="d-flex justify-content-end pt-3 border-top border-secondary border-opacity-25">
                <button
                  type="submit"
                  form="profile-form"
                  className="btn btn-primary px-4 py-2 fw-semibold shadow d-flex align-items-center gap-2"
                  style={{ borderRadius: "10px" }}
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </m.div>

          {/* Right Column: Change Password */}
          <m.div className="col-12 col-lg-6" variants={itemVariants}>
            <div className="glass-panel rounded-4 p-4 border-0 h-100 shadow-lg">
              <h5 className="fw-bold text-white mb-4 border-bottom border-secondary border-opacity-25 pb-3 d-flex align-items-center gap-2">
                <i className="bi bi-shield-lock text-warning"></i>
                Change Password & Security
              </h5>

              <form onSubmit={handleChangePassword}>
                {/* Current Password */}
                <div className="mb-3">
                  <label className="admin-form-label">Current Password (Optional)</label>
                  <div className="position-relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      className="form-control form-control-glass pe-5"
                      placeholder="Enter current password if set"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y text-secondary border-0"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                    >
                      {showCurrentPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="admin-form-label">
                    New Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      className="form-control form-control-glass pe-5"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y text-secondary border-0"
                      onClick={() => setShowNewPass(!showNewPass)}
                    >
                      {showNewPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="mb-4">
                  <label className="admin-form-label">
                    Confirm New Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-glass"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-end pt-2">
                  <button
                    type="submit"
                    className="btn btn-warning px-4 py-2 fw-semibold text-dark shadow d-flex align-items-center gap-2"
                    style={{ borderRadius: "10px" }}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-key-fill"></i>
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </m.div>

          {/* Bottom Card: Master Privileges Overview */}
          <m.div className="col-12" variants={itemVariants}>
            <div className="glass-panel rounded-4 p-4 border-0 shadow-lg">
              <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-stars text-info"></i>
                Privileges & System Roles
              </h5>
              <p className="text-secondary small mb-3">
                {isSuperadmin
                  ? "As Superadmin, you have full unrestricted access across all portal modules and administrative controls."
                  : "Assigned access rights and granted console sections for this administrator."}
              </p>

              <div className="d-flex flex-wrap gap-2">
                <span
                  className="badge px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2"
                  style={{
                    background: "rgba(56, 189, 248, 0.12)",
                    color: "#7dd3fc",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                    fontSize: "0.8rem",
                  }}
                >
                  <i className="bi bi-speedometer2"></i> Dashboard Analytics
                </span>

                <span
                  className="badge px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2"
                  style={{
                    background: "rgba(168, 85, 247, 0.12)",
                    color: "#d8b4fe",
                    border: "1px solid rgba(168, 85, 247, 0.25)",
                    fontSize: "0.8rem",
                  }}
                >
                  <i className="bi bi-people-fill"></i> Members & Leadership
                </span>

                <span
                  className="badge px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2"
                  style={{
                    background: "rgba(52, 211, 153, 0.12)",
                    color: "#6ee7b7",
                    border: "1px solid rgba(52, 211, 153, 0.25)",
                    fontSize: "0.8rem",
                  }}
                >
                  <i className="bi bi-calendar-event-fill"></i> Events & Attendees
                </span>

                {isSuperadmin && (
                  <>
                    <span
                      className="badge px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2"
                      style={{
                        background: "rgba(234, 179, 8, 0.12)",
                        color: "#fde047",
                        border: "1px solid rgba(234, 179, 8, 0.25)",
                        fontSize: "0.8rem",
                      }}
                    >
                      <i className="bi bi-person-badge-fill"></i> Admin Sub-Accounts
                    </span>

                    <span
                      className="badge px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2"
                      style={{
                        background: "rgba(244, 63, 94, 0.12)",
                        color: "#fda4af",
                        border: "1px solid rgba(244, 63, 94, 0.25)",
                        fontSize: "0.8rem",
                      }}
                    >
                      <i className="bi bi-gear-fill"></i> Organization Settings
                    </span>
                  </>
                )}
              </div>
            </div>
          </m.div>
        </div>
      </m.div>
    </AdminLayout>
  );
};

export default AdminProfile;
