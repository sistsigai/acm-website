import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Member {
  _id?: string;
  name: string;
  designation: string;
  batch: string;
  imageUrl?: string;
  imagePublicId?: string;
  profilePic?: string;
  social: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  adminAccount?: {
    username: string;
    email?: string;
    name?: string;
    role: string;
    permissions?: string[];
    isActive: boolean;
  } | null;
}

interface MemberCardProps {
  member: Member;
  index: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  index,
  isOpen,
  onToggleOpen,
  onEdit,
  onDelete,
}) => {
  const isAdmin = Boolean(member.adminAccount);
  const isSuperadmin = member.adminAccount?.role?.toLowerCase() === "superadmin";

  return (
    <div
      className={`admin-member-card glass-panel rounded-4 ${
        isOpen ? "border-primary border-opacity-50 is-open" : ""
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Card Header */}
      <div
        className="p-3 p-md-4 d-flex justify-content-between align-items-center cursor-pointer"
        onClick={onToggleOpen}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        <div className="d-flex align-items-center gap-3 gap-md-4">
          {/* Avatar */}
          <div className="position-relative">
            <img
              src={member.profilePic || member.imageUrl || "https://via.placeholder.com/60"}
              alt={member.name}
              className="rounded-circle shadow-sm object-fit-cover"
              style={{
                width: "60px",
                height: "60px",
                border: isAdmin
                  ? `2px solid ${isSuperadmin ? "#c084fc" : "#38bdf8"}`
                  : "2px solid rgba(255,255,255,0.2)",
              }}
            />
            <div
              className={`position-absolute bottom-0 end-0 border border-dark rounded-circle ${
                isAdmin && !member.adminAccount?.isActive ? "bg-danger" : "bg-success"
              }`}
              style={{ width: 12, height: 12 }}
            ></div>
          </div>

          {/* Info */}
          <div>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h5 className="fw-bold text-white mb-0">{member.name}</h5>
              {isAdmin && (
                <span
                  className="badge px-2 py-0.5 rounded-2"
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    background: isSuperadmin ? "rgba(168, 85, 247, 0.25)" : "rgba(56, 189, 248, 0.25)",
                    color: isSuperadmin ? "#c084fc" : "#38bdf8",
                    border: `1px solid ${isSuperadmin ? "rgba(168, 85, 247, 0.45)" : "rgba(56, 189, 248, 0.45)"}`,
                  }}
                >
                  {isSuperadmin ? "⭐ Superadmin" : "🛡️ Admin User"}
                </span>
              )}
            </div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="badge bg-primary bg-opacity-20 text-primary-subtle fw-medium px-2 py-1 rounded-2">
                {member.designation}
              </span>
              <span className="text-secondary small border-start border-secondary ps-2 d-none d-sm-inline">
                {member.batch}
              </span>
              <span className="text-secondary small w-100 d-block d-sm-none mt-1">
                {member.batch}
              </span>
            </div>
          </div>
        </div>

        <div
          className="text-secondary d-flex align-items-center justify-content-center"
          style={{
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: isOpen ? "#3b82f6" : "inherit",
          }}
        >
          <i className="bi bi-chevron-down fs-5"></i>
        </div>
      </div>

      {/* Animated Expanded Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`member-body-${member._id || index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.35,
                  ease: [0.25, 1, 0.5, 1],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.05,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.28,
                  ease: [0.25, 1, 0.5, 1],
                },
                opacity: {
                  duration: 0.15,
                },
              },
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4">
              <hr className="border-secondary opacity-25 my-0 mb-3" />

              {/* Linked Admin Account Info Panel */}
              {member.adminAccount && (
                <div
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: isSuperadmin ? "rgba(168, 85, 247, 0.08)" : "rgba(56, 189, 248, 0.08)",
                    border: `1px solid ${isSuperadmin ? "rgba(168, 85, 247, 0.25)" : "rgba(56, 189, 248, 0.25)"}`,
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold text-white small d-flex align-items-center gap-2">
                      <i className={`bi ${isSuperadmin ? "bi-shield-shaded" : "bi-shield-check"}`} style={{ color: isSuperadmin ? "#c084fc" : "#38bdf8" }}></i>
                      Referenced Administrator Account
                    </span>
                    <span
                      className={`badge px-2 py-0.5 ${
                        member.adminAccount.isActive ? "bg-success bg-opacity-25 text-success" : "bg-danger bg-opacity-25 text-danger"
                      }`}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {member.adminAccount.isActive ? "Active Account" : "Disabled Account"}
                    </span>
                  </div>

                  <div className="row g-2 text-white-50 small" style={{ fontSize: "0.8rem" }}>
                    <div className="col-12 col-sm-6">
                      <span className="text-secondary">Username: </span>
                      <span className="text-white fw-semibold">{member.adminAccount.username}</span>
                    </div>
                    {member.adminAccount.email && (
                      <div className="col-12 col-sm-6">
                        <span className="text-secondary">Email: </span>
                        <span className="text-white">{member.adminAccount.email}</span>
                      </div>
                    )}
                    <div className="col-12">
                      <span className="text-secondary">Assigned Permissions: </span>
                      <span className="text-white text-capitalize">
                        {isSuperadmin
                          ? "All Pages (Superadmin)"
                          : member.adminAccount.permissions && member.adminAccount.permissions.length > 0
                          ? member.adminAccount.permissions.join(", ")
                          : "None"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
                {/* Social Links */}
                <div className="d-flex align-items-center gap-3">
                  {member.social.linkedin?.trim() && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="social-icon linkedin"
                      title="LinkedIn"
                    >
                      <i className="bi bi-linkedin"></i>
                    </a>
                  )}

                  {member.social.instagram?.trim() && (
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="social-icon instagram"
                      title="Instagram"
                    >
                      <i className="bi bi-instagram"></i>
                    </a>
                  )}

                  {member.social.facebook?.trim() && (
                    <a
                      href={member.social.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="social-icon facebook"
                      title="Facebook"
                    >
                      <i className="bi bi-facebook"></i>
                    </a>
                  )}

                  {!member.social.linkedin?.trim() &&
                    !member.social.instagram?.trim() &&
                    !member.social.facebook?.trim() && (
                      <span className="text-secondary small fst-italic text-nowrap m-0">
                        No social links available.
                      </span>
                    )}
                </div>

                {/* Actions */}
                <div className="d-flex gap-2 w-100 w-md-auto">
                  <button
                    type="button"
                    className="btn btn-outline-info rounded-pill px-4 btn-sm fw-medium flex-grow-1 flex-md-grow-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(member);
                    }}
                  >
                    <i className="bi bi-pencil-square me-2"></i> Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger rounded-pill px-4 btn-sm fw-medium flex-grow-1 flex-md-grow-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(member);
                    }}
                  >
                    <i className="bi bi-trash me-2"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberCard;
