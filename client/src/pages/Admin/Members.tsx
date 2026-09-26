import { useState, useEffect, useMemo, useRef } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import type { Area, Point } from "react-easy-crop";
import {
  createMember,
  getMembers,
  deleteMember,
  updateMember,
  deleteMemberSocial,
  uploadMemberImageDirect,
  deleteMemberImageDirect,
} from "../../services/admin/memberService";
import { getCroppedBlob } from "../../utils/cropUtils";
import MemberCard, { type Member } from "../../components/Admin/Members/MemberCard";
import MemberFormModal, { type ValidationErrors } from "../../components/Admin/Members/MemberFormModal";
import MemberCropperModal from "../../components/Admin/Members/MemberCropperModal";
import DeleteSocialModal from "../../components/Admin/Members/DeleteSocialModal";
import ConfirmModal from "../../components/Common/ConfirmModal";
import CustomSelect from "../../components/Common/CustomSelect";

// --- OPTION CONSTANTS ---
const DESIGNATION_OPTIONS = [
  { value: "Chairperson", label: "Chairperson" },
  { value: "Vice Chairperson", label: "Vice Chairperson" },
  { value: "Treasurer", label: "Treasurer" },
  { value: "Secretary", label: "Secretary" },
  { value: "Core Team Member", label: "Core Team Member" },
  { value: "HOD CSE", label: "HOD CSE" },
  { value: "Associate Professor", label: "Associate Professor" },
  { value: "Research Unit", label: "Research Unit" },
  { value: "Media Unit", label: "Media Unit" },
  { value: "Volunteer Unit", label: "Volunteer Unit" },
];

const BATCH_OPTIONS = [
  { value: "2024–2025", label: "2024–2025" },
  { value: "2025–2026", label: "2025–2026" },
];

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");

  // Add / Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [initialEditImagePublicId, setInitialEditImagePublicId] = useState("");
  const [newMember, setNewMember] = useState<Member>({
    name: "",
    designation: "",
    batch: "",
    profilePic: "",
    social: {},
  });
  const [editMember, setEditMember] = useState<Member | null>(null);

  // Unsaved Cloudinary Public IDs tracking refs
  const newImagePublicIdRef = useRef<string | null>(null);
  const editUnsavedPublicIdRef = useRef<string | null>(null);

  // Image & Crop States
  const [imagePreview, setImagePreview] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState("");
  const [isCropForEdit, setIsCropForEdit] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Delete Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showSocialDeleteModal, setShowSocialDeleteModal] = useState(false);
  const [socialToDelete, setSocialToDelete] = useState<"linkedin" | "instagram" | "facebook" | null>(null);

  // Validation
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [editValidationErrors, setEditValidationErrors] = useState<ValidationErrors>({});

  // Toast
  const [toast, setToast] = useState<{
    show: boolean;
    text: string;
    variant: "info" | "success" | "error" | "warning";
  }>({
    show: false,
    text: "",
    variant: "info",
  });

  const showToast = (variant: "info" | "success" | "error" | "warning", text: string) => {
    setToast({ show: true, text, variant });
  };

  /* Validation Functions */
  const validateName = (name: string): string => {
    if (!name || name.trim() === "") return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name cannot exceed 50 characters";
    return "";
  };

  const validateDesignation = (desig: string): string => {
    if (!desig || desig === "") return "Please select a designation";
    return "";
  };

  const validateBatch = (batch: string): string => {
    if (!batch || batch === "") return "Please select a batch year";
    return "";
  };

  const validateProfilePic = (pic: string): string => {
    if (!pic || pic === "") return "Profile photo is required";
    return "";
  };

  const validateLinkedInUrl = (url?: string): string => {
    if (!url || url.trim() === "") return "";
    const reg = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/;
    if (!reg.test(url.trim())) return "Invalid LinkedIn profile URL";
    return "";
  };

  const validateInstagramUrl = (url?: string): string => {
    if (!url || url.trim() === "") return "";
    const reg = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
    if (!reg.test(url.trim())) return "Invalid Instagram profile URL";
    return "";
  };

  const validateFacebookUrl = (url?: string): string => {
    if (!url || url.trim() === "") return "";
    const reg = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9_.]+\/?$/;
    if (!reg.test(url.trim())) return "Invalid Facebook profile URL";
    return "";
  };

  const validateAllAddFields = (): ValidationErrors => {
    return {
      name: validateName(newMember.name),
      designation: validateDesignation(newMember.designation),
      batch: validateBatch(newMember.batch),
      profilePic: validateProfilePic(imagePreview),
      linkedin: validateLinkedInUrl(newMember.social?.linkedin),
      instagram: validateInstagramUrl(newMember.social?.instagram),
      facebook: validateFacebookUrl(newMember.social?.facebook),
    };
  };

  const validateAllEditFields = (): ValidationErrors => {
    if (!editMember) return {};
    return {
      name: validateName(editMember.name),
      designation: validateDesignation(editMember.designation),
      batch: validateBatch(editMember.batch),
      profilePic: validateProfilePic(editImagePreview || editMember.profilePic || ""),
      linkedin: validateLinkedInUrl(editMember.social?.linkedin),
      instagram: validateInstagramUrl(editMember.social?.instagram),
      facebook: validateFacebookUrl(editMember.social?.facebook),
    };
  };

  const hasAddErrors = useMemo(() => {
    const errs = validateAllAddFields();
    return Object.values(errs).some((e) => Boolean(e));
  }, [newMember, imagePreview]);

  const hasEditErrors = useMemo(() => {
    if (!editMember) return true;
    const errs = validateAllEditFields();
    return Object.values(errs).some((e) => Boolean(e));
  }, [editMember, editImagePreview]);

  // Fetch Members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getMembers();
      const rawList = Array.isArray(res) ? res : (res?.members || []);
      const formatted: Member[] = rawList.map((m: any) => ({
        _id: m._id,
        name: m.name || "",
        designation: m.designation || "",
        batch: m.batch || "",
        imageUrl: m.imageUrl || m.profilePic || "",
        profilePic: m.imageUrl || m.profilePic || "",
        social: {
          linkedin: m.social?.linkedin || "",
          instagram: m.social?.instagram || "",
          facebook: m.social?.facebook || "",
        },
      }));
      setMembers(formatted);
    } catch (err: any) {
      showToast("error", err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filtering
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBatch = selectedBatch === "all" || member.batch === selectedBatch;
      return matchesSearch && matchesBatch;
    });
  }, [members, searchQuery, selectedBatch]);

  // Image Upload Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result as string);
        setIsCropForEdit(isEdit);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Keep refs synchronized with active unsaved uploads
  useEffect(() => {
    newImagePublicIdRef.current = newMember.imagePublicId || null;
  }, [newMember.imagePublicId]);

  useEffect(() => {
    if (editMember?.imagePublicId && editMember.imagePublicId !== initialEditImagePublicId) {
      editUnsavedPublicIdRef.current = editMember.imagePublicId;
    } else {
      editUnsavedPublicIdRef.current = null;
    }
  }, [editMember?.imagePublicId, initialEditImagePublicId]);

  // Clean up any unsaved Cloudinary uploads when navigating away or unmounting
  useEffect(() => {
    return () => {
      if (newImagePublicIdRef.current) {
        deleteMemberImageDirect(newImagePublicIdRef.current);
      }
      if (editUnsavedPublicIdRef.current) {
        deleteMemberImageDirect(editUnsavedPublicIdRef.current);
      }
    };
  }, []);

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      setShowCropModal(false);
      setIsUploadingImage(true);
      setUploadProgress(0);

      // 1. Get Blob directly from cropped canvas
      const croppedBlob = await getCroppedBlob(imageToCrop, croppedAreaPixels);

      // 2. Set instant local preview while uploading to Cloudinary
      const localUrl = URL.createObjectURL(croppedBlob);
      if (isCropForEdit) {
        setEditImagePreview(localUrl);
      } else {
        setImagePreview(localUrl);
      }

      // 3. Delete previous temporary unsaved image if user re-crops in the same session
      if (isCropForEdit) {
        if (editMember?.imagePublicId && editMember.imagePublicId !== initialEditImagePublicId) {
          deleteMemberImageDirect(editMember.imagePublicId);
          editUnsavedPublicIdRef.current = null;
        }
      } else {
        if (newMember.imagePublicId) {
          deleteMemberImageDirect(newMember.imagePublicId);
          newImagePublicIdRef.current = null;
        }
      }

      // 4. Upload directly to Cloudinary with real-time progress
      const uploadRes = await uploadMemberImageDirect(croppedBlob, (progress) => {
        setUploadProgress(progress);
      });

      // 5. Update state with official Cloudinary secure URL & public ID
      if (isCropForEdit) {
        editUnsavedPublicIdRef.current = uploadRes.public_id;
        setEditImagePreview(uploadRes.url);
        if (editMember) {
          setEditMember({
            ...editMember,
            imageUrl: uploadRes.url,
            imagePublicId: uploadRes.public_id,
            profilePic: uploadRes.url,
          });
        }
      } else {
        newImagePublicIdRef.current = uploadRes.public_id;
        setImagePreview(uploadRes.url);
        setNewMember({
          ...newMember,
          imageUrl: uploadRes.url,
          imagePublicId: uploadRes.public_id,
          profilePic: uploadRes.url,
        });
      }

      setImageToCrop("");
    } catch (err: any) {
      console.error("Direct upload failed:", err);
      showToast("error", err?.message || "Failed to upload photo");
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  // Close & Clean Add Modal
  const handleCloseAddModal = () => {
    if (newMember.imagePublicId) {
      deleteMemberImageDirect(newMember.imagePublicId);
    }
    newImagePublicIdRef.current = null;
    setShowModal(false);
    setNewMember({ name: "", designation: "", batch: "", profilePic: "", social: {} });
    setImagePreview("");
    setValidationErrors({});
  };

  // Remove Photo from Add Modal
  const handleRemoveAddImage = () => {
    if (newMember.imagePublicId) {
      deleteMemberImageDirect(newMember.imagePublicId);
    }
    newImagePublicIdRef.current = null;
    setImagePreview("");
    setNewMember({ ...newMember, profilePic: "", imageUrl: "", imagePublicId: undefined });
  };

  // Close & Clean Edit Modal
  const handleCloseEditModal = () => {
    if (editMember?.imagePublicId && editMember.imagePublicId !== initialEditImagePublicId) {
      deleteMemberImageDirect(editMember.imagePublicId);
    }
    editUnsavedPublicIdRef.current = null;
    setShowEditModal(false);
    setEditMember(null);
    setEditImagePreview("");
    setInitialEditImagePublicId("");
    setEditValidationErrors({});
  };

  // Remove Photo from Edit Modal
  const handleRemoveEditImage = () => {
    if (editMember?.imagePublicId && editMember.imagePublicId !== initialEditImagePublicId) {
      deleteMemberImageDirect(editMember.imagePublicId);
    }
    editUnsavedPublicIdRef.current = null;
    setEditImagePreview("");
    if (editMember) {
      setEditMember({ ...editMember, profilePic: "", imageUrl: "", imagePublicId: undefined });
    }
  };

  // Add Member
  const handleAddMember = async () => {
    const errs = validateAllAddFields();
    setValidationErrors(errs);
    if (Object.values(errs).some((e) => Boolean(e))) {
      showToast("error", "Please fix all validation errors");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...newMember,
        imageUrl: newMember.imageUrl || imagePreview,
        imagePublicId: (newMember as any).imagePublicId,
        profilePic: newMember.imageUrl || imagePreview,
      };
      const res = await createMember(payload);
      newImagePublicIdRef.current = null; // Mark as saved so unmount/modal reset won't delete
      showToast("success", res?.message || "Member created successfully");
      setShowModal(false);
      setNewMember({ name: "", designation: "", batch: "", profilePic: "", social: {} });
      setImagePreview("");
      await fetchMembers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to create member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Member
  const handleUpdateMember = async () => {
    if (!editMember || !editMember._id) return;
    const errs = validateAllEditFields();
    setEditValidationErrors(errs);
    if (Object.values(errs).some((e) => Boolean(e))) {
      showToast("error", "Please fix all validation errors");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...editMember,
        imageUrl: editMember.imageUrl || editImagePreview || editMember.profilePic,
        imagePublicId: (editMember as any).imagePublicId,
        profilePic: editMember.imageUrl || editImagePreview || editMember.profilePic,
      };
      const res = await updateMember(editMember._id, payload);
      editUnsavedPublicIdRef.current = null; // Mark as saved
      showToast("success", res?.message || "Member updated successfully");
      setShowEditModal(false);
      setEditMember(null);
      setEditImagePreview("");
      setInitialEditImagePublicId("");
      await fetchMembers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to update member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Member
  const handleDeleteMember = async () => {
    if (!memberToDelete || !memberToDelete._id) return;
    try {
      setLoading(true);
      const res = await deleteMember(memberToDelete._id);
      showToast("success", res?.message || "Member deleted");
      setShowDeleteModal(false);
      setMemberToDelete(null);
      await fetchMembers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete member");
    } finally {
      setLoading(false);
    }
  };

  // Delete Social Link
  const handleConfirmDeleteSocial = async () => {
    if (!editMember || !editMember._id || !socialToDelete) return;
    try {
      setLoading(true);
      await deleteMemberSocial(editMember._id, socialToDelete);
      setEditMember({
        ...editMember,
        social: { ...editMember.social, [socialToDelete]: "" },
      });
      setShowSocialDeleteModal(false);
      setSocialToDelete(null);
      showToast("success", `${socialToDelete} link removed`);
      await fetchMembers();
    } catch (err: any) {
      showToast("error", err.message || "Failed to remove social link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      active="Members"
      loading={loading || isSubmitting}
      toast={{
        show: toast.show,
        variant: toast.variant,
        message: toast.text,
      }}
      onCloseToast={() => setToast((prev) => ({ ...prev, show: false }))}
    >
      <m.div
        className="mobile-offset"
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
            <h2 className="fw-bold text-white mb-1">Members Directory</h2>
            <p className="text-secondary m-0">Manage core team and faculty members</p>
          </div>
          <button
            type="button"
            className="btn btn-primary px-4 py-2 fw-semibold shadow-lg d-flex align-items-center gap-2"
            onClick={() => {
              setNewMember({ name: "", designation: "", batch: "", profilePic: "", social: {} });
              setImagePreview("");
              setValidationErrors({});
              setShowModal(true);
            }}
            style={{ borderRadius: "12px" }}
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add Member</span>
          </button>
        </m.div>

        {/* Filter Controls */}
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
                placeholder="Search by member name or role..."
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
              value={selectedBatch}
              options={[{ value: "all", label: "All Batches" }, ...BATCH_OPTIONS]}
              onChange={setSelectedBatch}
              icon="bi-mortarboard"
              label="Filter by Batch"
            />
          </div>
        </m.div>

        {/* Members List */}
        <div className="d-flex flex-column gap-3">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-5 glass-panel rounded-4">
              <i className="bi bi-people display-4 text-secondary opacity-50 mb-3 d-block"></i>
              <h5 className="text-white">No members found</h5>
              <p className="text-secondary">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, index) => (
                <MemberCard
                  key={member._id || index}
                  member={member}
                  index={index}
                  isOpen={expandedRow === index}
                  onToggleOpen={() => setExpandedRow(expandedRow === index ? null : index)}
                  onEdit={(mem) => {
                    const pic = mem.profilePic || mem.imageUrl || "";
                    setEditMember({
                      ...mem,
                      profilePic: pic,
                      social: {
                        linkedin: mem.social?.linkedin || "",
                        instagram: mem.social?.instagram || "",
                        facebook: mem.social?.facebook || "",
                      },
                    });
                    setEditImagePreview(pic);
                    setEditValidationErrors({});
                    setShowEditModal(true);
                  }}
                  onDelete={(mem) => {
                    setMemberToDelete(mem);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </m.div>

      {/* Add Modal */}
      <MemberFormModal
        show={showModal}
        isEditMode={false}
        memberData={newMember}
        validationErrors={validationErrors}
        imagePreview={imagePreview}
        isSubmitting={isSubmitting}
        isUploadingImage={isUploadingImage}
        uploadProgress={uploadProgress}
        hasValidationErrors={hasAddErrors}
        designationOptions={DESIGNATION_OPTIONS}
        batchOptions={BATCH_OPTIONS}
        onClose={handleCloseAddModal}
        onSave={handleAddMember}
        onNameChange={(val) => {
          setNewMember({ ...newMember, name: val });
          setValidationErrors((prev) => ({ ...prev, name: validateName(val) }));
        }}
        onDesignationChange={(val) => {
          setNewMember({ ...newMember, designation: val });
          setValidationErrors((prev) => ({ ...prev, designation: validateDesignation(val) }));
        }}
        onBatchChange={(val) => {
          setNewMember({ ...newMember, batch: val });
          setValidationErrors((prev) => ({ ...prev, batch: validateBatch(val) }));
        }}
        onSocialChange={(platform, val) => {
          setNewMember({
            ...newMember,
            social: { ...newMember.social, [platform]: val },
          });
          const validator =
            platform === "linkedin"
              ? validateLinkedInUrl
              : platform === "instagram"
              ? validateInstagramUrl
              : validateFacebookUrl;
          setValidationErrors((prev) => ({ ...prev, [platform]: validator(val) }));
        }}
        onClearSocial={(platform) => {
          setNewMember({
            ...newMember,
            social: { ...newMember.social, [platform]: "" },
          });
          setValidationErrors((prev) => ({ ...prev, [platform]: "" }));
        }}
        onImageUpload={(e) => handleImageUpload(e, false)}
        onEditCurrentImage={() => {
          if (imagePreview) {
            setImageToCrop(imagePreview);
            setIsCropForEdit(false);
            setShowCropModal(true);
          }
        }}
        onRemoveImage={handleRemoveAddImage}
      />

      {/* Edit Modal */}
      {editMember && (
        <MemberFormModal
          show={showEditModal}
          isEditMode={true}
          memberData={editMember}
          validationErrors={editValidationErrors}
          imagePreview={editImagePreview || editMember.profilePic || ""}
          isSubmitting={isSubmitting}
          isUploadingImage={isUploadingImage}
          uploadProgress={uploadProgress}
          hasValidationErrors={hasEditErrors}
          designationOptions={DESIGNATION_OPTIONS}
          batchOptions={BATCH_OPTIONS}
          onClose={handleCloseEditModal}
          onSave={handleUpdateMember}
          onNameChange={(val) => {
            setEditMember({ ...editMember, name: val });
            setEditValidationErrors((prev) => ({ ...prev, name: validateName(val) }));
          }}
          onDesignationChange={(val) => {
            setEditMember({ ...editMember, designation: val });
            setEditValidationErrors((prev) => ({ ...prev, designation: validateDesignation(val) }));
          }}
          onBatchChange={(val) => {
            setEditMember({ ...editMember, batch: val });
            setEditValidationErrors((prev) => ({ ...prev, batch: validateBatch(val) }));
          }}
          onSocialChange={(platform, val) => {
            setEditMember({
              ...editMember,
              social: { ...editMember.social, [platform]: val },
            });
            const validator =
              platform === "linkedin"
                ? validateLinkedInUrl
                : platform === "instagram"
                ? validateInstagramUrl
                : validateFacebookUrl;
            setEditValidationErrors((prev) => ({ ...prev, [platform]: validator(val) }));
          }}
          onClearSocial={(platform) => {
            if (editMember._id) {
              setSocialToDelete(platform);
              setShowSocialDeleteModal(true);
            } else {
              setEditMember({
                ...editMember,
                social: { ...editMember.social, [platform]: "" },
              });
            }
          }}
          onImageUpload={(e) => handleImageUpload(e, true)}
          onEditCurrentImage={() => {
            const currentImg = editImagePreview || editMember.profilePic;
            if (currentImg) {
              setImageToCrop(currentImg);
              setIsCropForEdit(true);
              setShowCropModal(true);
            }
          }}
          onRemoveImage={handleRemoveEditImage}
        />
      )}

      {/* Cropper Modal */}
      <MemberCropperModal
        show={showCropModal}
        imageToCrop={imageToCrop}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        onSave={handleCropSave}
        onCancel={() => {
          setShowCropModal(false);
          setImageToCrop("");
        }}
      />

      {/* Delete Member Confirmation */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Member Profile?"
        message="Are you sure you want to permanently remove"
        itemName={memberToDelete?.name}
        confirmText="Delete Member"
        confirmVariant="danger"
        isProcessing={loading}
        onConfirm={handleDeleteMember}
        onCancel={() => {
          setShowDeleteModal(false);
          setMemberToDelete(null);
        }}
      />

      {/* Delete Social Link Confirmation */}
      <DeleteSocialModal
        show={showSocialDeleteModal}
        platform={socialToDelete}
        onConfirm={handleConfirmDeleteSocial}
        onCancel={() => {
          setShowSocialDeleteModal(false);
          setSocialToDelete(null);
        }}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default Members;