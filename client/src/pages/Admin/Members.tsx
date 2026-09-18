import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { createMember, getMembers, deleteMember, updateMember, deleteMemberSocial } from "../../services/admin/membersService";

// --- INTERFACES ---
interface Member {
    _id?: string;
    name: string;
    designation: string;
    batch: string;
    profilePic: string;
    social: {
        linkedin?: string;
        instagram?: string;
        facebook?: string;
    };
}

type ToastVariant = "info" | "success" | "error" | "warning";

interface ToastState {
    show: boolean;
    text: string;
    variant: ToastVariant;
}

// Validation errors interface
interface ValidationErrors {
    name?: string;
    designation?: string;
    batch?: string;
    profilePic?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
}

// --- UTILS ---
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) return;
            resolve(URL.createObjectURL(blob));
        }, 'image/jpeg');
    });
};

// --- VALIDATION UTILITIES ---
const validateName = (name: string): string => {
    if (!name.trim()) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s.'-]+$/.test(name)) return "Name can only contain letters, spaces, and basic punctuation";
    return "";
};

const validateDesignation = (designation: string): string => {
    if (!designation) return "Designation is required";
    return "";
};

const validateBatch = (batch: string): string => {
    if (!batch) return "Batch is required";
    return "";
};

const validateLinkedInUrl = (url: string): string => {
    if (!url) return "";
    if (!url.trim()) return "";

    try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.includes('linkedin.com')) {
            return "Must be a valid LinkedIn URL";
        }
    } catch {
        return "Please enter a valid URL";
    }
    return "";
};

const validateInstagramUrl = (url: string): string => {
    if (!url) return "";
    if (!url.trim()) return "";

    try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.includes('instagram.com')) {
            return "Must be a valid Instagram URL";
        }
    } catch {
        return "Please enter a valid URL";
    }
    return "";
};

const validateFacebookUrl = (url: string): string => {
    if (!url) return "";
    if (!url.trim()) return "";

    try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.includes('facebook.com')) {
            return "Must be a valid Facebook URL";
        }
    } catch {
        return "Please enter a valid URL";
    }
    return "";
};

const validateProfilePic = (file?: File): string => {
    if (!file) return "";

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        return "Image must be less than 5MB";
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return "Only JPEG, PNG, and WebP images are allowed";
    }

    return "";
};

const validateAllFields = (
    name: string,
    designation: string,
    batch: string,
    linkedin: string = "",
    instagram: string = "",
    facebook: string = ""
): ValidationErrors => {
    const errors: ValidationErrors = {};

    errors.name = validateName(name);
    errors.designation = validateDesignation(designation);
    errors.batch = validateBatch(batch);
    errors.linkedin = validateLinkedInUrl(linkedin);
    errors.instagram = validateInstagramUrl(instagram);
    errors.facebook = validateFacebookUrl(facebook);

    return errors;
};

// --- COMPONENT ---
const Members = () => {
    // Data States
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDesignation, setFilterDesignation] = useState("");
    const [filterBatch, setFilterBatch] = useState("");

    // Modal States
    const [showModal, setShowModal] = useState(false); // Add Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);

    // Form States
    const [newMember, setNewMember] = useState<Member>({
        name: "", designation: "", batch: "", profilePic: "",
        social: { linkedin: "", instagram: "", facebook: "" }
    });
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

    // Image Handling States
    const [imagePreview, setImagePreview] = useState<string>("");
    const [editImagePreview, setEditImagePreview] = useState<string>("");
    const [imageToCrop, setImageToCrop] = useState<string>("");
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [editImageCropMode, setEditImageCropMode] = useState(false);

    // Validation States
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [editValidationErrors, setEditValidationErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // UI States
    const [toast, setToast] = useState<ToastState>({ show: false, text: "", variant: "info" });
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    // --- DERIVED STATE ---
    const uniqueDesignations = useMemo(() => Array.from(new Set(members.map(m => m.designation))).sort(), [members]);
    const uniqueBatches = useMemo(() => Array.from(new Set(members.map(m => m.batch))).sort(), [members]);

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const matchesSearch = searchTerm === "" || member.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDesignation = filterDesignation === "" || member.designation === filterDesignation;
            const matchesBatch = filterBatch === "" || member.batch === filterBatch;
            return matchesSearch && matchesDesignation && matchesBatch;
        });
    }, [members, searchTerm, filterDesignation, filterBatch]);

    // Check if form has any validation errors
    const hasValidationErrors = useMemo(() => {
        return Object.values(validationErrors).some(error => error !== "");
    }, [validationErrors]);

    const hasEditValidationErrors = useMemo(() => {
        return Object.values(editValidationErrors).some(error => error !== "");
    }, [editValidationErrors]);

    // Get current name length safely
    const currentNameLength = useMemo(() => {
        if (showEditModal && editMember) {
            return editMember.name.length;
        }
        return newMember.name.length;
    }, [showEditModal, editMember, newMember.name]);

    const handleServiceError = (err: any) => {
        if (err?.type === "validation" && Array.isArray(err.errors)) {
            err.errors.forEach((msg: string) =>
                showToast(msg, "error")
            );
            return;
        }

        if (err?.message) {
            showToast(err.message, "error");
            return;
        }

        showToast("Something went wrong", "error");
    };

    // --- EFFECTS ---
    useEffect(() => {
        const loadMembers = async () => {
            try {
                setLoading(true);

                const start = Date.now();

                const data = await getMembers();

                // Minimum loader time (ms)
                const MIN_LOADING_TIME = 400;
                const elapsed = Date.now() - start;

                if (elapsed < MIN_LOADING_TIME) {
                    await new Promise(resolve =>
                        setTimeout(resolve, MIN_LOADING_TIME - elapsed)
                    );
                }

                setMembers(
                    data.map((m: any) => ({
                        _id: m._id,
                        name: m.name,
                        designation: m.designation,
                        batch: m.batch,
                        profilePic: m.imageUrl,
                        social: {
                            linkedin: m.social?.linkedin?.trim() || undefined,
                            instagram: m.social?.instagram?.trim() || undefined,
                            facebook: m.social?.facebook?.trim() || undefined,
                        },
                    }))

                );
            } catch (err: any) {
                handleServiceError(err);
            }
            finally {
                setLoading(false);
            }
        };

        loadMembers();
    }, []);

    const handleRemoveImage = () => {
        if (showEditModal && editMember) {
            setEditImagePreview("");
            setEditMember({ ...editMember, profilePic: "" });
            setEditValidationErrors(prev => ({ ...prev, profilePic: "" }));
        } else {
            setImagePreview("");
            setNewMember(prev => ({ ...prev, profilePic: "" }));
            setValidationErrors(prev => ({ ...prev, profilePic: "" }));
        }
    }

    // Reset validation errors when modal closes
    useEffect(() => {
        if (!showModal) {
            setValidationErrors({});
        }
    }, [showModal]);

    useEffect(() => {
        if (!showEditModal) {
            setEditValidationErrors({});
        }
    }, [showEditModal]);

    // --- HANDLERS ---
    const showToast = (text: string, variant: ToastVariant = "info") => {
        setToast({ show: true, text, variant });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate image file
        const validationError = validateProfilePic(file);
        if (validationError) {
            showToast(validationError, "error");
            e.target.value = ""; // Reset file input
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageToCrop(reader.result as string);
            setEditImageCropMode(isEditMode);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropSave = async () => {
        if (!croppedAreaPixels || !imageToCrop) return;
        try {
            const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
            if (editImageCropMode && editMember) {
                setEditImagePreview(croppedImage);
                setEditMember({ ...editMember, profilePic: croppedImage });
                // Clear any existing profile pic validation error
                setEditValidationErrors(prev => ({ ...prev, profilePic: "" }));
            } else {
                setImagePreview(croppedImage);
                setNewMember(prev => ({ ...prev, profilePic: croppedImage }));
                // Clear any existing profile pic validation error
                setValidationErrors(prev => ({ ...prev, profilePic: "" }));
            }
            setShowCropModal(false);
        } catch (e) {
            showToast("Failed to crop image", "error");
        }
    };

    const handleAddMember = async () => {
        // Validate all fields before submission
        const errors = validateAllFields(
            newMember.name,
            newMember.designation,
            newMember.batch,
            newMember.social.linkedin,
            newMember.social.instagram,
            newMember.social.facebook
        );

        setValidationErrors(errors);

        // Check if there are any errors
        if (Object.values(errors).some(error => error !== "")) {
            showToast("Please fix the validation errors before submitting", "error");
            return;
        }

        if (!newMember.name || !newMember.designation || !newMember.batch) {
            showToast("Please fill all required fields", "error");
            return;
        }

        try {
            setIsSubmitting(true);
            let fileToUpload: File | null = null;
            if (newMember.profilePic) {
                const response = await fetch(newMember.profilePic);
                const blob = await response.blob();
                fileToUpload = new File([blob], "profile.jpg", { type: "image/jpeg" });
            }

            const payload = {
                name: newMember.name,
                designation: newMember.designation,
                batch: newMember.batch,
                profilePic: fileToUpload,
                linkedin: newMember.social.linkedin,
                instagram: newMember.social.instagram,
                facebook: newMember.social.facebook,
            };

            const result = await createMember(payload);
            setMembers(prev => [
                ...prev,
                {
                    _id: result._id,
                    name: result.name,
                    designation: result.designation,
                    batch: result.batch,
                    profilePic: result.imageUrl,
                    social: {
                        linkedin: result.social?.linkedin?.trim() || undefined,
                        instagram: result.social?.instagram?.trim() || undefined,
                        facebook: result.social?.facebook?.trim() || undefined,
                    },
                }
            ]);

            setShowModal(false);
            setNewMember({ name: "", designation: "", batch: "", profilePic: "", social: { linkedin: "", instagram: "", facebook: "" } });
            setImagePreview("");
            setValidationErrors({});
            showToast(result.message || "Member added successfully!", "success");
        } catch (err: any) {
            handleServiceError(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateMember = async () => {
        if (!editMember) return;

        // Validate all fields before submission
        const errors = validateAllFields(
            editMember.name,
            editMember.designation,
            editMember.batch,
            editMember.social.linkedin || "",
            editMember.social.instagram || "",
            editMember.social.facebook || ""
        );

        setEditValidationErrors(errors);

        // Check if there are any errors
        if (Object.values(errors).some(error => error !== "")) {
            showToast("Please fix the validation errors before submitting", "error");
            return;
        }

        try {
            setIsSubmitting(true);
            let fileToUpload: File | null = null;
            // Check if image is a blob url (changed) or existing url
            if (editImagePreview !== editMember.profilePic || editImagePreview.startsWith('blob:')) {
                const res = await fetch(editImagePreview);
                const blob = await res.blob();
                fileToUpload = new File([blob], "updated.jpg", { type: "image/jpeg" });
            }

            const updated = await updateMember(editMember._id!, {
                name: editMember.name,
                designation: editMember.designation,
                batch: editMember.batch,
                linkedin: editMember.social.linkedin,
                instagram: editMember.social.instagram,
                facebook: editMember.social.facebook,
                profilePic: fileToUpload || undefined
            });

            setMembers(prev =>
                prev.map(m =>
                    m._id === updated._id
                        ? {
                            _id: updated._id,
                            name: updated.name,
                            designation: updated.designation,
                            batch: updated.batch,
                            profilePic: updated.imageUrl || m.profilePic,
                            social: {
                                linkedin: updated.social?.linkedin?.trim() || undefined,
                                instagram: updated.social?.instagram?.trim() || undefined,
                                facebook: updated.social?.facebook?.trim() || undefined,
                            },
                        }
                        : m
                )
            );
            setShowEditModal(false);
            setEditValidationErrors({});
            showToast("Member updated successfully!", "success");
        } catch (err: any) {
            handleServiceError(err);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSocial = async (
        platform: "linkedin" | "instagram" | "facebook"
    ) => {
        if (!editMember?._id) return;

        try {
            setIsSubmitting(true);

            const res = await deleteMemberSocial(editMember._id, platform);

            // Update local edit state
            setEditMember(prev =>
                prev
                    ? {
                        ...prev,
                        social: {
                            ...prev.social,
                            [platform]: undefined,
                        },
                    }
                    : prev
            );

            showToast(res.message, "success");
        } catch (err: any) {
            showToast(err?.message || "Failed to remove social link", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMember = async () => {
        if (!memberToDelete?._id) return;
        try {
            setLoading(true);
            await deleteMember(memberToDelete._id);
            setMembers(prev => prev.filter(m => m._id !== memberToDelete._id));
            setShowDeleteModal(false);
            showToast("Member deleted successfully!", "success");
        } catch (err: any) {
            handleServiceError(err);
        } finally {
            setLoading(false);
        }
    };

    // Validation handlers
    const handleNameChange = (value: string, isEditMode: boolean) => {
        const error = validateName(value);
        if (isEditMode) {
            setEditValidationErrors(prev => ({ ...prev, name: error }));
        } else {
            setValidationErrors(prev => ({ ...prev, name: error }));
        }
    };

    const handleDesignationChange = (value: string, isEditMode: boolean) => {
        const error = validateDesignation(value);
        if (isEditMode) {
            setEditValidationErrors(prev => ({ ...prev, designation: error }));
        } else {
            setValidationErrors(prev => ({ ...prev, designation: error }));
        }
    };

    const handleBatchChange = (value: string, isEditMode: boolean) => {
        const error = validateBatch(value);
        if (isEditMode) {
            setEditValidationErrors(prev => ({ ...prev, batch: error }));
        } else {
            setValidationErrors(prev => ({ ...prev, batch: error }));
        }
    };

    const handleLinkedInChange = (value: string, isEditMode: boolean) => {
        const error = validateLinkedInUrl(value);
        if (isEditMode) {
            setEditValidationErrors(prev => ({ ...prev, linkedin: error }));
        } else {
            setValidationErrors(prev => ({ ...prev, linkedin: error }));
        }
    };

    const handleInstagramChange = (value: string, isEditMode: boolean) => {
        const error = validateInstagramUrl(value);
        if (isEditMode) {
            setEditValidationErrors(prev => ({ ...prev, instagram: error }));
        } else {
            setValidationErrors(prev => ({ ...prev, instagram: error }));
        }
    };

    const handleFacebookChange = (value: string, isEditMode: boolean) => {
        const error = validateFacebookUrl(value);
        if (isEditMode) {
            setEditValidationErrors(prev => ({ ...prev, facebook: error }));
        } else {
            setValidationErrors(prev => ({ ...prev, facebook: error }));
        }
    };

    // --- CSS STYLES ---
    const styles = `
    /* --- PLACEHOLDER COLOR OVERRIDE (PURE WHITE) --- */
    input::placeholder, 
    .form-control::placeholder,
    .form-control-glass::placeholder {
      color: #ffffff !important;
      opacity: 1 !important; /* Forces visible white on Firefox */
    }
    
    /* Ensure user text is also white */
    .form-control-glass {
      color: #ffffff !important;
    }

    /* --- ANIMATIONS --- */
    @keyframes fadeInStagger {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }

    @keyframes scaleInModal {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* --- COMPONENTS --- */
    .glass-panel {
      background: rgba(31, 41, 55, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .member-card {
      background: linear-gradient(145deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      animation: fadeInStagger 0.5s ease-out forwards;
      opacity: 0; /* Hidden initially for animation */
    }

    .member-card:hover {
      transform: translateY(-4px);
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
    }

    .member-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .member-card:hover::after { opacity: 1; }

    /* Expandable logic */
    .expandable-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .expandable-wrapper.open { grid-template-rows: 1fr; }
    .expandable-inner { overflow: hidden; opacity: 0; transform: translateY(-10px); transition: all 0.3s ease 0.1s; }
    .expandable-wrapper.open .expandable-inner { opacity: 1; transform: translateY(0); }

    /* Inputs */
    .form-control-glass {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 50px; /* Pill shape */
      padding: 0.5rem 1rem;
      transition: all 0.2s;
    }
    .form-control-glass:focus {
      background: rgba(0, 0, 0, 0.5);
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      color: white;
    }
    .form-control-glass.is-invalid {
      border-color: #dc3545;
      background: rgba(220, 53, 69, 0.1);
    }
    .form-control-glass.is-invalid:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
    }
    .form-select-glass {
      background-color: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 50px;
    }
    .form-select-glass:focus {
      background-color: #1f2937;
      border-color: #3b82f6;
      color: white;
      box-shadow: none;
    }
    .form-select-glass.is-invalid {
      border-color: #dc3545;
      background: rgba(220, 53, 69, 0.1);
    }

    /* Social Icons */
    .social-btn {
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      color: #9ca3af;
      transition: all 0.3s ease;
      font-size: 1.1rem;
    }
    .social-btn:hover { transform: translateY(-3px) scale(1.1); color: white; }
    .social-btn.linkedin:hover { background: #0077b5; }
    .social-btn.instagram:hover { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
    .social-btn.facebook:hover { background: #1877f2; }

    /* Modals */
    .modal-content-glass {
      background: #1f2937;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      animation: scaleInModal 0.3s ease-out forwards;
    }
    .modal-backdrop.show { opacity: 0.8; backdrop-filter: blur(4px); }
    
    /* --- PERFECT PILL SEARCH BAR --- */
    .search-pill {
      position: relative;
    }

    .search-pill .form-control-glass {
      border-radius: 50px !important;   /* pill */
      height: 48px;
    }

    .search-pill .input-group-text {
      border-radius: 50px;
    }

    /* Optional: subtle glow on focus */
    .search-pill .form-control-glass:focus {
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    }
    .search-pill .search-icon {
      top: 45%;
      transform: translateY(-45%); /* slightly lower than center */
      left: 0;
      height: 100%;
      display: flex;
      align-items: center;
      pointer-events: none; /* allows clicking input */
    }

    /* --- MOBILE RESPONSIVENESS (< 768px) --- */
    @media (max-width: 768px) {
        /* 1. Space on top for floating navbar */
        .mobile-offset {
            padding-top: 85px !important;
        }

        /* 2. Full width search pill on mobile */
        .search-container-mobile {
            width: 100% !important;
            max-width: 100% !important;
        }

        /* 3. Stack action buttons on mobile */
        .action-buttons-mobile {
            width: 100%;
            justify-content: flex-end; /* Align right or stretch */
        }
    }

    /* Validation styles */
    .invalid-feedback-custom {
      display: block;
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      margin-left: 0.5rem;
    }

    .character-counter {
      font-size: 0.75rem;
      color: #6c757d;
      margin-top: 0.25rem;
      margin-left: 0.5rem;
    }

    .character-counter.warning {
      color: #ffc107;
    }

    .character-counter.danger {
      color: #dc3545;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `;

    return (
        <AdminLayout
            active="Members"
            loading={loading || isSubmitting}
            toast={{
                show: toast.show,
                variant: toast.variant,
                message: toast.text,
            }}
            onCloseToast={() => setToast(prev => ({ ...prev, show: false }))}
        >
            <style>{styles}</style>

            {/* Main Wrapper with mobile top spacing */}
            <div className="mobile-offset">

                {/* --- HEADER --- */}
                {/* Responsive: Flex Column on Mobile, Row on Desktop */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-5 gap-3">
                    <div>
                        <h1 className="fw-bold text-white mb-2" style={{ letterSpacing: '-1px' }}>Team Directory</h1>
                        <p className="text-secondary mb-0">Manage your organization's hierarchy and members.</p>
                    </div>
                    <button
                        className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-lg d-flex align-items-center gap-2"
                        onClick={() => setShowModal(true)}
                        style={{ transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <i className="bi bi-plus-lg"></i>
                        <span>Add Member</span>
                    </button>
                </div>

                {/* --- FILTER TOOLBAR --- */}
                <div className="glass-panel p-3 rounded-4 mb-4 d-flex flex-column flex-md-row gap-3 align-items-center">

                    {/* Search Pill - Full width on mobile */}
                    <div className="input-group search-pill search-container-mobile" style={{ maxWidth: '400px' }}>
                        <span className="input-group-text bg-transparent border-0 text-white ps-3 position-absolute search-icon">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control form-control-glass ps-5"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="d-flex flex-column flex-md-row gap-3 flex-grow-1 w-100">
                        <select
                            className="form-select form-select-glass"
                            value={filterDesignation}
                            onChange={(e) => setFilterDesignation(e.target.value)}
                        >
                            <option value="">All Designations</option>
                            {uniqueDesignations.map((d, i) => (
                                <option key={i} value={d}>{d}</option>
                            ))}
                        </select>

                        <select
                            className="form-select form-select-glass"
                            value={filterBatch}
                            onChange={(e) => setFilterBatch(e.target.value)}
                        >
                            <option value="">All Batches</option>
                            {uniqueBatches.map((b, i) => (
                                <option key={i} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || filterDesignation || filterBatch) && (
                        <button
                            className="btn btn-outline-secondary rounded-pill px-3 text-white border-white align-self-end align-self-md-center"
                            onClick={() => {
                                setSearchTerm("");
                                setFilterDesignation("");
                                setFilterBatch("");
                            }}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    )}

                    {/* Member Count */}
                    <div className="ms-md-auto d-flex align-items-center">
                        <div
                            className="px-3 py-2 rounded-pill"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                lineHeight: "1",
                                whiteSpace: "nowrap"
                            }}
                        >
                            <span className="text-secondary small">
                                Showing{" "}
                                <span className="text-white fw-bold">
                                    {filteredMembers.length}
                                </span>{" "}
                                of{" "}
                                <span className="text-white fw-bold">
                                    {members.length}
                                </span>
                            </span>
                        </div>
                    </div>

                </div>

                {/* --- MEMBERS LIST --- */}
                <div className="d-flex flex-column gap-3">
                    {filteredMembers.length === 0 ? (
                        <div className="text-center py-5 glass-panel rounded-4">
                            <i className="bi bi-people display-4 text-secondary opacity-50 mb-3 d-block"></i>
                            <h5 className="text-white">No members found</h5>
                            <p className="text-secondary">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        filteredMembers.map((member, index) => {
                            const isOpen = expandedRow === index;
                            return (
                                <div
                                    key={member._id || index}
                                    className={`member-card rounded-4 ${isOpen ? 'border-primary border-opacity-50' : ''}`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Card Header */}
                                    <div
                                        className="p-3 p-md-4 d-flex justify-content-between align-items-center cursor-pointer"
                                        onClick={() => setExpandedRow(isOpen ? null : index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center gap-4">
                                            {/* Avatar */}
                                            <div className="position-relative">
                                                <img
                                                    src={member.profilePic || "https://via.placeholder.com/60"}
                                                    alt={member.name}
                                                    className="rounded-circle shadow-sm object-fit-cover"
                                                    style={{ width: '60px', height: '60px', border: '2px solid rgba(255,255,255,0.2)' }}
                                                />
                                                <div className="position-absolute bottom-0 end-0 bg-success border border-dark rounded-circle" style={{ width: 12, height: 12 }}></div>
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <h5 className="fw-bold text-white mb-1">{member.name}</h5>
                                                <div className="d-flex flex-wrap align-items-center gap-2">
                                                    <span className="badge bg-primary bg-opacity-20 text-primary-subtle fw-medium px-2 py-1 rounded-2">
                                                        {member.designation}
                                                    </span>
                                                    <span className="text-secondary small border-start border-secondary ps-2 d-none d-sm-inline">
                                                        {member.batch}
                                                    </span>
                                                    {/* Mobile Only Batch Display (below badge) */}
                                                    <span className="text-secondary small w-100 d-block d-sm-none mt-1">
                                                        {member.batch}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                            <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} fs-5`}></i>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <div className={`expandable-wrapper ${isOpen ? "open" : ""}`}>
                                        <div className="expandable-inner px-4 pb-4">
                                            <hr className="border-secondary opacity-25 my-0 mb-4" />

                                            {/* Flex container switches to column on mobile */}
                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
                                                {/* Social Links */}
                                                <div className="d-flex gap-3">
                                                    {member.social.linkedin?.trim() && (
                                                        <a
                                                            href={member.social.linkedin}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="social-btn linkedin"
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
                                                            className="social-btn instagram"
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
                                                            className="social-btn facebook"
                                                            title="Facebook"
                                                        >
                                                            <i className="bi bi-facebook"></i>
                                                        </a>
                                                    )}

                                                    {!member.social.linkedin?.trim() &&
                                                        !member.social.instagram?.trim() &&
                                                        !member.social.facebook?.trim() && (
                                                            <span className="text-secondary small fst-italic mt-2">
                                                                No social links linked.
                                                            </span>
                                                        )}
                                                </div>

                                                {/* Actions - Full width on mobile */}
                                                <div className="d-flex gap-2 action-buttons-mobile">
                                                    <button
                                                        className="btn btn-outline-info rounded-pill px-4 btn-sm fw-medium hover-lift flex-grow-1 flex-md-grow-0"
                                                        onClick={(e) => { e.stopPropagation(); setEditMember(member); setEditImagePreview(member.profilePic); setShowEditModal(true); }}
                                                    >
                                                        <i className="bi bi-pencil-square me-2"></i> Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger rounded-pill px-4 btn-sm fw-medium hover-lift flex-grow-1 flex-md-grow-0"
                                                        onClick={(e) => { e.stopPropagation(); setMemberToDelete(member); setShowDeleteModal(true); }}
                                                    >
                                                        <i className="bi bi-trash me-2"></i> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* --- ADD / EDIT MODAL (Reusable Layout) --- */}
            {(showModal || showEditModal) && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content modal-content-glass text-light rounded-4 overflow-hidden">
                            <div className="modal-header border-bottom border-secondary border-opacity-25 p-4">
                                <h5 className="modal-title fw-bold">{showEditModal ? 'Edit Member' : 'Add New Member'}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowModal(false);
                                        setShowEditModal(false);
                                        setValidationErrors({});
                                        setEditValidationErrors({});
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-4">
                                    {/* Left: Image */}
                                    <div className="col-md-4 text-center">
                                        <div className="position-relative d-inline-block group">
                                            <div className="rounded-4 overflow-hidden shadow-lg border border-secondary" style={{ width: 160, height: 200 }}>
                                                <img
                                                    src={showEditModal ? (editImagePreview || editMember?.profilePic || "https://via.placeholder.com/150") : (imagePreview || "https://via.placeholder.com/150")}
                                                    alt="Preview"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            </div>
                                            <div className="d-flex gap-2 justify-content-center mt-3">
                                                {/* Change Image */}
                                                <label className="btn btn-sm btn-primary rounded-pill shadow">
                                                    <i className="bi bi-camera me-1"></i> Change
                                                    <input
                                                        type="file"
                                                        className="d-none"
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        onChange={(e) => handleImageUpload(e, showEditModal)}
                                                    />
                                                </label>

                                                {/* Remove Image */}
                                                {(showEditModal ? editImagePreview : imagePreview) && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger rounded-pill shadow"
                                                        onClick={handleRemoveImage}
                                                    >
                                                        <i className="bi bi-trash me-1"></i> Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {(showEditModal ? editValidationErrors.profilePic : validationErrors.profilePic) && (
                                            <div className="invalid-feedback-custom mt-2">
                                                {showEditModal ? editValidationErrors.profilePic : validationErrors.profilePic}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Form */}
                                    <div className="col-md-8">
                                        <div className="row g-3">
                                            {/* Name Field */}
                                            <div className="col-12">
                                                <label className="form-label text-secondary small text-uppercase fw-bold">
                                                    Full Name <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-glass ${(showEditModal ? editValidationErrors.name : validationErrors.name) ? 'is-invalid' : ''}`}
                                                    value={showEditModal ? (editMember?.name || "") : newMember.name}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        if (showEditModal && editMember) {
                                                            setEditMember({ ...editMember, name: value });
                                                            handleNameChange(value, true);
                                                        } else {
                                                            setNewMember({ ...newMember, name: value });
                                                            handleNameChange(value, false);
                                                        }
                                                    }}
                                                    maxLength={50}
                                                />
                                                {(showEditModal ? editValidationErrors.name : validationErrors.name) && (
                                                    <div className="invalid-feedback-custom">
                                                        {showEditModal ? editValidationErrors.name : validationErrors.name}
                                                    </div>
                                                )}
                                                <div className={`character-counter ${currentNameLength > 45 ? 'warning' : ''} ${currentNameLength >= 50 ? 'danger' : ''}`}>
                                                    {currentNameLength} / 50
                                                </div>
                                            </div>

                                            {/* Designation Field */}
                                            <div className="col-12 col-md-6">
                                                <label className="form-label text-secondary small text-uppercase fw-bold">
                                                    Designation <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`form-select form-select-glass ${(showEditModal ? editValidationErrors.designation : validationErrors.designation) ? 'is-invalid' : ''}`}
                                                    value={showEditModal ? (editMember?.designation || "") : newMember.designation}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        if (showEditModal && editMember) {
                                                            setEditMember({ ...editMember, designation: value });
                                                            handleDesignationChange(value, true);
                                                        } else {
                                                            setNewMember({ ...newMember, designation: value });
                                                            handleDesignationChange(value, false);
                                                        }
                                                    }}
                                                >
                                                    <option value="" disabled>Select...</option>
                                                    <option value="Chairperson">Chairperson</option>
                                                    <option value="Vice Chairperson">Vice Chairperson</option>
                                                    <option value="Treasurer">Treasurer</option>
                                                    <option value="Secretary">Secretary</option>
                                                    <option value="Core Team Member">Core Team Member</option>
                                                    <option value="HOD CSE">HOD CSE</option>
                                                    <option value="Associate Professor">Associate Professor</option>
                                                    <option value="Research Unit">Research Unit</option>
                                                    <option value="Media Unit">Media Unit</option>
                                                    <option value="Volunteer Unit">Volunteer Unit</option>
                                                </select>
                                                {(showEditModal ? editValidationErrors.designation : validationErrors.designation) && (
                                                    <div className="invalid-feedback-custom">
                                                        {showEditModal ? editValidationErrors.designation : validationErrors.designation}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Batch Field */}
                                            <div className="col-12 col-md-6">
                                                <label className="form-label text-secondary small text-uppercase fw-bold">
                                                    Batch <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`form-select form-select-glass ${(showEditModal ? editValidationErrors.batch : validationErrors.batch) ? 'is-invalid' : ''}`}
                                                    value={showEditModal ? (editMember?.batch || "") : newMember.batch}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        if (showEditModal && editMember) {
                                                            setEditMember({ ...editMember, batch: value });
                                                            handleBatchChange(value, true);
                                                        } else {
                                                            setNewMember({ ...newMember, batch: value });
                                                            handleBatchChange(value, false);
                                                        }
                                                    }}
                                                >
                                                    <option value="" disabled>Select...</option>
                                                    <option value="2024–2025">2024–2025</option>
                                                    <option value="2025–2026">2025–2026</option>
                                                </select>
                                                {(showEditModal ? editValidationErrors.batch : validationErrors.batch) && (
                                                    <div className="invalid-feedback-custom">
                                                        {showEditModal ? editValidationErrors.batch : validationErrors.batch}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Social Media Section */}
                                            <div className="col-12 mt-4">
                                                <label className="form-label text-secondary small text-uppercase fw-bold border-bottom border-secondary w-100 pb-1 mb-3">
                                                    Social Media (Optional)
                                                </label>

                                                {/* LinkedIn */}
                                                <div className="input-group mb-2">
                                                    <span className="input-group-text bg-transparent border-secondary text-info">
                                                        <i className="bi bi-linkedin"></i>
                                                    </span>

                                                    <input
                                                        type="url"
                                                        className={`form-control bg-transparent border-secondary text-light ${(showEditModal ? editValidationErrors.linkedin : validationErrors.linkedin)
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        placeholder="https://linkedin.com/in/username"
                                                        value={
                                                            showEditModal
                                                                ? editMember?.social.linkedin || ""
                                                                : newMember.social.linkedin || ""
                                                        }
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            if (showEditModal && editMember) {
                                                                setEditMember({
                                                                    ...editMember,
                                                                    social: { ...editMember.social, linkedin: value },
                                                                });
                                                                handleLinkedInChange(value, true);
                                                            } else {
                                                                setNewMember({
                                                                    ...newMember,
                                                                    social: { ...newMember.social, linkedin: value },
                                                                });
                                                                handleLinkedInChange(value, false);
                                                            }
                                                        }}
                                                    />

                                                    {/* DELETE BUTTON (EDIT MODE ONLY) */}
                                                    {showEditModal && editMember?.social.linkedin && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            title="Remove LinkedIn"
                                                            onClick={() => handleDeleteSocial("linkedin")}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>

                                                {(showEditModal ? editValidationErrors.linkedin : validationErrors.linkedin) && (
                                                    <div className="invalid-feedback-custom mb-3">
                                                        {showEditModal ? editValidationErrors.linkedin : validationErrors.linkedin}
                                                    </div>
                                                )}

                                                {/* Instagram */}
                                                <div className="input-group mb-2">
                                                    <span className="input-group-text bg-transparent border-secondary text-danger">
                                                        <i className="bi bi-instagram"></i>
                                                    </span>

                                                    <input
                                                        type="url"
                                                        className={`form-control bg-transparent border-secondary text-light ${(showEditModal ? editValidationErrors.instagram : validationErrors.instagram)
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        placeholder="https://instagram.com/username"
                                                        value={
                                                            showEditModal
                                                                ? editMember?.social.instagram || ""
                                                                : newMember.social.instagram || ""
                                                        }
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            if (showEditModal && editMember) {
                                                                setEditMember({
                                                                    ...editMember,
                                                                    social: { ...editMember.social, instagram: value },
                                                                });
                                                                handleInstagramChange(value, true);
                                                            } else {
                                                                setNewMember({
                                                                    ...newMember,
                                                                    social: { ...newMember.social, instagram: value },
                                                                });
                                                                handleInstagramChange(value, false);
                                                            }
                                                        }}
                                                    />

                                                    {/* DELETE BUTTON */}
                                                    {showEditModal && editMember?.social.instagram && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            title="Remove Instagram"
                                                            onClick={() => handleDeleteSocial("instagram")}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>

                                                {(showEditModal ? editValidationErrors.instagram : validationErrors.instagram) && (
                                                    <div className="invalid-feedback-custom mb-3">
                                                        {showEditModal ? editValidationErrors.instagram : validationErrors.instagram}
                                                    </div>
                                                )}

                                                {/* Facebook */}
                                                <div className="input-group">
                                                    <span className="input-group-text bg-transparent border-secondary text-primary">
                                                        <i className="bi bi-facebook"></i>
                                                    </span>

                                                    <input
                                                        type="url"
                                                        className={`form-control bg-transparent border-secondary text-light ${(showEditModal ? editValidationErrors.facebook : validationErrors.facebook)
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        placeholder="https://facebook.com/username"
                                                        value={
                                                            showEditModal
                                                                ? editMember?.social.facebook || ""
                                                                : newMember.social.facebook || ""
                                                        }
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            if (showEditModal && editMember) {
                                                                setEditMember({
                                                                    ...editMember,
                                                                    social: { ...editMember.social, facebook: value },
                                                                });
                                                                handleFacebookChange(value, true);
                                                            } else {
                                                                setNewMember({
                                                                    ...newMember,
                                                                    social: { ...newMember.social, facebook: value },
                                                                });
                                                                handleFacebookChange(value, false);
                                                            }
                                                        }}
                                                    />

                                                    {/* DELETE BUTTON */}
                                                    {showEditModal && editMember?.social.facebook && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            title="Remove Facebook"
                                                            onClick={() => handleDeleteSocial("facebook")}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>

                                                {(showEditModal ? editValidationErrors.facebook : validationErrors.facebook) && (
                                                    <div className="invalid-feedback-custom">
                                                        {showEditModal ? editValidationErrors.facebook : validationErrors.facebook}
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top border-secondary border-opacity-25 p-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-light rounded-pill px-4"
                                    onClick={() => {
                                        setShowModal(false);
                                        setShowEditModal(false);
                                        setValidationErrors({});
                                        setEditValidationErrors({});
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-pill px-5 fw-bold"
                                    onClick={showEditModal ? handleUpdateMember : handleAddMember}
                                    disabled={showEditModal ? (hasEditValidationErrors || isSubmitting || !editMember) : (hasValidationErrors || isSubmitting)}
                                >
                                    {isSubmitting ? (
                                        <span>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {showEditModal ? 'Saving...' : 'Adding...'}
                                        </span>
                                    ) : (
                                        showEditModal ? 'Save Changes' : 'Add Member'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CROP MODAL --- */}
            <div className={`modal fade ${showCropModal ? "show d-block" : ""}`} style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-light border border-secondary">
                        <div className="modal-body p-0 position-relative" style={{ height: '500px' }}>
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 4}
                                onCropChange={setCrop}
                                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="modal-footer bg-dark border-top border-secondary justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <span className="small text-secondary">Zoom:</span>
                                <input
                                    type="range" min={1} max={3} step={0.1} value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="form-range" style={{ width: 100 }}
                                />
                            </div>
                            <div>
                                <button className="btn btn-secondary rounded-pill me-2" onClick={() => setShowCropModal(false)}>Cancel</button>
                                <button className="btn btn-primary rounded-pill" onClick={handleCropSave}>Apply Crop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- DELETE CONFIRMATION --- */}
            {showDeleteModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-content-glass rounded-4 p-3 text-center">
                            <div className="modal-body">
                                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
                                    <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                                </div>
                                <h4 className="fw-bold mb-2 text-white">Delete Member?</h4>
                                <p className="text-secondary mb-4">Are you sure you want to remove <strong>{memberToDelete?.name}</strong>? This action cannot be undone.</p>
                                <div className="d-flex gap-2 justify-content-center">
                                    <button className="btn btn-outline-light rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                    <button className="btn btn-danger rounded-pill px-4 fw-bold" onClick={handleDeleteMember} disabled={loading}>
                                        {loading ? (
                                            <span>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Deleting...
                                            </span>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Members;