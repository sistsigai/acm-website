import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  getAllRecruitments,
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
  toggleRecruitmentStatus,
} from "../../services/admin/recruitmentService";
import ConfirmModal from "../../components/Common/ConfirmModal";
import RecruitmentCard, {
  type Recruitment,
} from "../../components/Admin/Recruitments/RecruitmentCard";
import RecruitmentModal from "../../components/Admin/Recruitments/RecruitmentModal";

/* ---------------- COMPONENT ---------------- */
const Recruitments: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recruitmentToDelete, setRecruitmentToDelete] = useState<Recruitment | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    variant: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  const [form, setForm] = useState<Omit<Recruitment, "_id" | "applicantsCount">>({
    title: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    isOpen: true,
    questions: [],
  });

  const formatInputDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        setLoading(true);
        const start = Date.now();
        const res = await getAllRecruitments();
        const MIN_DELAY = 400;
        const elapsed = Date.now() - start;
        if (elapsed < MIN_DELAY) {
          await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed));
        }

        setRecruitments(
          (res.recruitments || []).sort(
            (a: Recruitment, b: Recruitment) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
        );
      } catch (error: any) {
        setToast({
          show: true,
          variant: "error",
          message: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitments();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const toggleRecruitment = async (id: string, current: boolean) => {
    try {
      const res = await toggleRecruitmentStatus(id, !current);

      setRecruitments((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isOpen: !current } : r))
      );

      setToast({
        show: true,
        variant: "success",
        message: res?.message || "Recruitment status updated",
      });
    } catch (error: any) {
      setToast({
        show: true,
        variant: "error",
        message: error.message,
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      let res: Recruitment;

      if (editingId) {
        res = await updateRecruitment(editingId, form);
        setRecruitments((prev) =>
          prev.map((r) => (r._id === editingId ? res : r))
        );
        setToast({
          show: true,
          variant: "success",
          message: "Recruitment updated successfully",
        });
      } else {
        res = await createRecruitment(form);
        setRecruitments((prev) => [res, ...prev]);
        setToast({
          show: true,
          variant: "success",
          message: "Recruitment created successfully",
        });
      }

      setShowModal(false);
      setEditingId(null);
      setForm({
        title: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        isOpen: true,
        questions: [],
      });
    } catch (error: any) {
      setToast({
        show: true,
        variant: "error",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (r: Recruitment) => {
    setForm({
      title: r.title,
      role: r.role,
      description: r.description,
      startDate: formatInputDate(r.startDate),
      endDate: formatInputDate(r.endDate),
      isOpen: r.isOpen,
      questions: r.questions || [],
    });

    setEditingId(r._id);
    setIsSubmitting(false);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!recruitmentToDelete) return;

    try {
      setLoading(true);
      const res = await deleteRecruitment(recruitmentToDelete._id);

      setRecruitments((prev) =>
        prev.filter((r) => r._id !== recruitmentToDelete._id)
      );

      setToast({
        show: true,
        variant: "success",
        message: res?.message || "Recruitment deleted successfully",
      });
    } catch (error: any) {
      setToast({
        show: true,
        variant: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setRecruitmentToDelete(null);
    }
  };

  return (
    <AdminLayout
      active="Recruitment"
      loading={loading || isSubmitting}
      toast={toast || undefined}
      onCloseToast={() => setToast(null)}
    >
      <div className="mobile-offset">
        {/* Header */}
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-5 gap-3 animate-card"
          style={{ animationDelay: "0ms" }}
        >
          <div>
            <h1
              className="fw-bold text-white mb-2"
              style={{ letterSpacing: "-1px" }}
            >
              Recruitments
            </h1>
            <p className="text-secondary m-0">
              Manage recruitment drives and applications.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-lg d-flex align-items-center justify-content-center gap-2 hover-scale mobile-w-100"
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                role: "",
                description: "",
                startDate: "",
                endDate: "",
                isOpen: true,
                questions: [],
              });
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-lg"></i>
            <span>New Drive</span>
          </button>
        </div>

        {/* Grid */}
        <div className="row g-4">
          {recruitments.length === 0 && !loading && (
            <div className="col-12 text-center text-secondary py-5">
              <i className="bi bi-folder2-open display-4 opacity-50 mb-3 d-block"></i>
              <h4>No recruitments found</h4>
              <p>Create a new recruitment drive to get started.</p>
            </div>
          )}

          {recruitments.map((r, index) => (
            <RecruitmentCard
              key={r._id}
              recruitment={r}
              index={index}
              onToggleStatus={toggleRecruitment}
              onEdit={handleEdit}
              onDelete={(rec) => {
                setRecruitmentToDelete(rec);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <RecruitmentModal
        show={showModal}
        editingId={editingId}
        form={form}
        setForm={setForm}
        isSubmitting={isSubmitting}
        onSave={handleSave}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Recruitment Drive?"
        message="Are you sure you want to delete"
        itemName={recruitmentToDelete?.title}
        confirmText="Delete Drive"
        confirmVariant="danger"
        isProcessing={loading}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setRecruitmentToDelete(null);
        }}
      />
    </AdminLayout>
  );
};

export default Recruitments;