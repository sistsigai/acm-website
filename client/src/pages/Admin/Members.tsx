import { useState, useEffect, useMemo, useRef } from "react";
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

// --- CUSTOM SELECT COMPONENT ---
interface CustomSelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    options: CustomSelectOption[];
    onChange: (value: string) => void;
    label?: string;
    icon?: string;
    hasError?: boolean;
    disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    value,
    options,
    onChange,
    label = "Select",
    icon,
    hasError = false,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="position-relative w-100" style={{ zIndex: isOpen ? 1050 : 'auto' }}>
            <button
                type="button"
                className={`w-100 d-flex align-items-center justify-content-between text-start ${hasError ? 'border-danger' : ''}`}
                style={{
                    background: '#060911',
                    border: hasError ? '1px solid #ef4444' : (isOpen ? '1px solid #3b82f6' : '1px solid #1e293b'),
                    borderRadius: '10px',
                    padding: '0.65rem 0.95rem',
                    color: selectedOption ? '#f8fafc' : '#ffffff',
                    fontSize: '0.9rem',
                    boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none',
                    transition: 'all 0.2s ease',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    minHeight: '48px'
                }}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <div className="d-flex align-items-center text-truncate" style={{ gap: '10px' }}>
                    {icon && <i className={`bi ${icon} text-secondary flex-shrink-0`} style={{ fontSize: '1rem' }}></i>}
                    <span className="text-truncate">
                        {selectedOption ? selectedOption.label : label}
                    </span>
                </div>
                <i
                    className="bi bi-chevron-down text-secondary flex-shrink-0 ms-2"
                    style={{
                        fontSize: '0.8rem',
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                ></i>
            </button>

            {isOpen && (
                <div
                    className="position-absolute start-0 w-100 mt-1 py-1 custom-select-dropdown"
                    style={{
                        top: '100%',
                        zIndex: 1060,
                        background: '#0d1527',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                        maxHeight: '230px',
                        overflowY: 'auto'
                    }}
                >
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={opt.value}
                                className="d-flex align-items-center justify-content-between px-3 py-2 cursor-pointer"
                                style={{
                                    background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                    color: isSelected ? '#60a5fa' : '#e2e8f0',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = '#1e293b';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                                }}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                            >
                                <span className={isSelected ? 'fw-semibold' : ''}>{opt.label}</span>
                                {isSelected && <i className="bi bi-check2 text-primary fw-bold"></i>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

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

    canvas.width = Math.max(1, Math.round(pixelCrop.width));
    canvas.height = Math.max(1, Math.round(pixelCrop.height));

    // Sample corner pixel for seamless background blending if padded
    let bgColor = '#ffffff';
    try {
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = 1;
        sampleCanvas.height = 1;
        const sampleCtx = sampleCanvas.getContext('2d');
        if (sampleCtx) {
            sampleCtx.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 1);
            const p = sampleCtx.getImageData(0, 0, 1, 1).data;
            if (p[3] > 0) {
                bgColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
            }
        }
    } catch (_) {}

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sX = Math.max(0, pixelCrop.x);
    const sY = Math.max(0, pixelCrop.y);
    const sWidth = Math.min(image.naturalWidth - sX, pixelCrop.width - (sX - pixelCrop.x));
    const sHeight = Math.min(image.naturalHeight - sY, pixelCrop.height - (sY - pixelCrop.y));

    const dX = Math.max(0, sX - pixelCrop.x);
    const dY = Math.max(0, sY - pixelCrop.y);
    const dWidth = Math.max(0, sWidth);
    const dHeight = Math.max(0, sHeight);

    if (dWidth > 0 && dHeight > 0) {
        ctx.drawImage(
            image,
            sX,
            sY,
            sWidth,
            sHeight,
            dX,
            dY,
            dWidth,
            dHeight
        );
    }

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) return;
            resolve(URL.createObjectURL(blob));
        }, 'image/jpeg', 0.95);
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
                const data = await getMembers();

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
    };

    const handleEditCurrentImage = (isEditMode: boolean = false) => {
        const currentImg = isEditMode ? (editImagePreview || editMember?.profilePic) : imagePreview;
        if (!currentImg) {
            showToast("Please upload an image first to edit", "info");
            return;
        }
        setImageToCrop(currentImg);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setEditImageCropMode(isEditMode);
        setShowCropModal(true);
    };

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

    // Ensure Cropper gets accurate container dimensions immediately on modal open
    useEffect(() => {
        if (showCropModal) {
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 30);
            return () => clearTimeout(timer);
        }
    }, [showCropModal]);

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
            const src = reader.result as string;
            setImageToCrop(src);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
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
    /* --- PLACEHOLDER COLOR (LIGHT / MUTED TEXT) --- */
    input::placeholder, 
    textarea::placeholder,
    .form-control::placeholder,
    .form-control-glass::placeholder,
    .studio-input-wrap input::placeholder {
      color: #64748b !important;
      opacity: 1 !important;
      font-weight: 400 !important;
    }
    
    /* Ensure user text is white */
    .form-control-glass,
    .studio-input-wrap input {
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
      from { transform: scale(0.96); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @keyframes pulseDanger {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    @keyframes liveDotPulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
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
      opacity: 0;
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

    /* Custom Select Dropdown Animation */
    @keyframes dropdownSlideFade {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .custom-select-dropdown {
      animation: dropdownSlideFade 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Expandable Accordion Logic - Smooth Slide & Height Transition */
    .expandable-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .expandable-wrapper.open {
      grid-template-rows: 1fr;
    }
    .expandable-inner {
      overflow: hidden;
      min-height: 0;
      opacity: 0;
      transform: translateY(-8px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .expandable-wrapper.open .expandable-inner {
      opacity: 1;
      transform: translateY(0);
    }

    /* Inputs & Selects */
    .form-control-glass, .form-select-glass {
      background: rgba(0, 0, 0, 0.3) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      border-radius: 10px;
      padding: 0.55rem 0.85rem;
      transition: all 0.2s ease;
    }
    .form-control-glass:focus, .form-select-glass:focus {
      background: rgba(0, 0, 0, 0.5) !important;
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
      color: #ffffff !important;
    }
    .input-group > .form-control-glass,
    .input-group > .form-select-glass {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .input-group > .input-group-text {
      border-top-left-radius: 10px !important;
      border-bottom-left-radius: 10px !important;
    }
    .input-group > .btn {
      border-top-right-radius: 10px !important;
      border-bottom-right-radius: 10px !important;
    }
    .form-select-glass option {
      background-color: #111827;
      color: #ffffff;
    }
    .form-control-glass.is-invalid, .form-select-glass.is-invalid {
      border-color: #dc3545 !important;
      background: rgba(220, 53, 69, 0.1) !important;
    }
    .form-control-glass.is-invalid:focus, .form-select-glass.is-invalid:focus {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important;
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
      border-radius: 50px !important;
      height: 48px;
    }

    .search-pill .input-group-text {
      border-radius: 50px;
    }

    .search-pill .form-control-glass:focus {
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    }
    .search-pill .search-icon {
      top: 45%;
      transform: translateY(-45%);
      left: 0;
      height: 100%;
      display: flex;
      align-items: center;
      pointer-events: none;
    }

    /* --- CLEAN MEMBER MODAL STYLES --- */
    .member-studio-modal {
      max-width: 860px;
      width: 100%;
      background: linear-gradient(165deg, #0f172a 0%, #090d16 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
      animation: scaleInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .member-studio-modal::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
      opacity: 0.9;
    }

    /* Dedicated crop modal without scale transform to prevent cropper offset distortion */
    .member-crop-modal {
      max-width: 720px;
      width: 100%;
      background: linear-gradient(165deg, #0f172a 0%, #090d16 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
      animation: fadeInCropModal 0.15s ease-out forwards;
    }

    .member-crop-modal::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
      opacity: 0.9;
    }

    @keyframes fadeInCropModal {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .studio-photo-frame {
      width: 175px;
      height: 230px;
      border-radius: 12px;
      border: 2px dashed rgba(59, 130, 246, 0.35);
      background: radial-gradient(circle at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .studio-photo-frame.has-image {
      border: 2px solid rgba(59, 130, 246, 0.5);
    }

    .studio-photo-frame:hover {
      border-color: #3b82f6;
      box-shadow: 0 12px 28px -5px rgba(59, 130, 246, 0.25);
    }

    /* Custom form input container */
    .studio-input-wrap {
      background: #060911;
      border: 1px solid #1e293b;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .studio-input-wrap:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .studio-input-wrap.has-error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }

    /* Social Brand Badges */
    .social-brand-badge {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 1rem;
    }
    .social-brand-badge.linkedin {
      background: rgba(10, 102, 194, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(10, 102, 194, 0.3);
    }
    .social-brand-badge.instagram {
      background: rgba(225, 48, 108, 0.15);
      color: #f43f5e;
      border: 1px solid rgba(225, 48, 108, 0.3);
    }
    .social-brand-badge.facebook {
      background: rgba(24, 119, 242, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(24, 119, 242, 0.3);
    }

    /* --- MOBILE RESPONSIVENESS (< 768px) --- */
    @media (max-width: 768px) {
        .mobile-offset {
            padding-top: 85px !important;
        }
        .search-container-mobile {
            width: 100% !important;
            max-width: 100% !important;
        }
        .action-buttons-mobile {
            width: 100%;
            justify-content: flex-end;
        }
    }

    /* Validation styles */
    .invalid-feedback-custom {
      display: block;
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      margin-left: 0.25rem;
      font-weight: 500;
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
                <div className="glass-panel p-3 rounded-4 mb-4 d-flex flex-column flex-md-row gap-3 align-items-center position-relative" style={{ zIndex: 30 }}>

                    {/* Search Pill - Full width on mobile */}
                    <div className="input-group search-pill search-container-mobile" style={{ maxWidth: '360px' }}>
                        <span className="input-group-text bg-transparent border-0 text-white ps-3 position-absolute search-icon">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control form-control-glass ps-5"
                            placeholder="Search members by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filters with CustomSelect */}
                    <div className="d-flex flex-column flex-md-row gap-3 flex-grow-1 w-100" style={{ maxWidth: '520px' }}>
                        <CustomSelect
                            value={filterDesignation}
                            options={[{ value: "", label: "All Designations" }, ...uniqueDesignations.map(d => ({ value: d, label: d }))]}
                            onChange={(val) => setFilterDesignation(val)}
                            label="All Designations"
                            icon="bi-award"
                        />
                        <CustomSelect
                            value={filterBatch}
                            options={[{ value: "", label: "All Batches" }, ...uniqueBatches.map(b => ({ value: b, label: b }))]}
                            onChange={(val) => setFilterBatch(val)}
                            label="All Batches"
                            icon="bi-calendar3"
                        />
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

                                        <div
                                            className="text-secondary d-flex align-items-center justify-content-center"
                                            style={{
                                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                            }}
                                        >
                                            <i className="bi bi-chevron-down fs-5"></i>
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

            {/* --- ADD / EDIT MODAL --- */}
            {(showModal || showEditModal) && (
                <div className="admin-modal-overlay">
                    <div className="member-studio-modal p-4 p-md-4 m-2" style={{ maxWidth: '860px', width: '100%' }}>
                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <i className={`bi ${showEditModal ? 'bi-pencil-square text-primary' : 'bi-person-plus text-primary'} fs-5`}></i>
                                <h5 className="m-0 fw-bold text-white" style={{ fontSize: '1.15rem' }}>
                                    {showEditModal ? 'Edit Member' : 'Add Member'}
                                </h5>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-secondary text-decoration-none p-1 rounded-circle hover-light d-flex align-items-center justify-content-center"
                                style={{ width: 32, height: 32 }}
                                onClick={() => {
                                    setShowModal(false);
                                    setShowEditModal(false);
                                    setValidationErrors({});
                                    setEditValidationErrors({});
                                }}
                            >
                                <i className="bi bi-x-lg" style={{ fontSize: '0.9rem' }}></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="row g-4">
                            {/* Left Column: Photo Upload */}
                            <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                                <div className={`studio-photo-frame mb-3 ${(showEditModal ? (editImagePreview || editMember?.profilePic) : imagePreview) ? 'has-image' : ''}`}>
                                    {(showEditModal ? (editImagePreview || editMember?.profilePic) : imagePreview) ? (
                                        <img
                                            src={showEditModal ? (editImagePreview || editMember?.profilePic) : imagePreview}
                                            alt="Portrait Preview"
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    ) : (
                                        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-secondary opacity-60 p-3 text-center">
                                            <i className="bi bi-person-bounding-box fs-1 mb-2 text-primary opacity-75"></i>
                                            <span className="fw-medium text-white small">No Photo</span>
                                        </div>
                                    )}
                                </div>

                                {/* Photo Action Buttons */}
                                <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap w-100 px-2">
                                    <label
                                        className="btn btn-sm btn-primary mb-0 px-3 py-1.5 d-inline-flex align-items-center rounded-2 fw-medium shadow-sm"
                                        style={{ gap: '6px', fontSize: '0.825rem', cursor: 'pointer' }}
                                    >
                                        <i className="bi bi-cloud-arrow-up-fill"></i>
                                        <span>{(showEditModal ? (editImagePreview || editMember?.profilePic) : imagePreview) ? 'Change' : 'Upload Photo'}</span>
                                        <input
                                            type="file"
                                            className="d-none"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={(e) => handleImageUpload(e, showEditModal)}
                                        />
                                    </label>

                                    {(showEditModal ? (editImagePreview || editMember?.profilePic) : imagePreview) && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-info px-2.5 py-1.5 d-inline-flex align-items-center rounded-2 fw-medium"
                                            style={{ gap: '6px', fontSize: '0.825rem' }}
                                            onClick={() => handleEditCurrentImage(showEditModal)}
                                            title="Crop / Recenter photo"
                                        >
                                            <i className="bi bi-crop"></i> <span>Crop</span>
                                        </button>
                                    )}

                                    {(showEditModal ? (editImagePreview || editMember?.profilePic) : imagePreview) && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger px-2.5 py-1.5 d-inline-flex align-items-center rounded-2"
                                            style={{ fontSize: '0.825rem' }}
                                            onClick={handleRemoveImage}
                                            title="Remove photo"
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    )}
                                </div>

                                {(showEditModal ? editValidationErrors.profilePic : validationErrors.profilePic) && (
                                    <div className="invalid-feedback-custom text-center mt-2">
                                        {showEditModal ? editValidationErrors.profilePic : validationErrors.profilePic}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Details & Social Links */}
                            <div className="col-12 col-md-8 d-flex flex-column gap-3">
                                {/* Full Name */}
                                <div>
                                    <label className="admin-form-label mb-1">
                                        Full Name <span className="text-danger">*</span>
                                    </label>
                                    <div
                                        className={`studio-input-wrap d-flex align-items-center w-100 px-3 ${(showEditModal ? editValidationErrors.name : validationErrors.name) ? 'has-error' : ''}`}
                                        style={{ minHeight: '44px', gap: '10px' }}
                                    >
                                        <i className="bi bi-person text-secondary flex-shrink-0"></i>
                                        <input
                                            type="text"
                                            placeholder="Enter member full name"
                                            className="w-100 text-white bg-transparent border-0"
                                            style={{ outline: 'none', fontSize: '0.9rem' }}
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
                                    </div>
                                    {(showEditModal ? editValidationErrors.name : validationErrors.name) && (
                                        <div className="invalid-feedback-custom">
                                            {showEditModal ? editValidationErrors.name : validationErrors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Designation & Batch Dropdowns */}
                                <div className="row g-3">
                                    {/* Designation */}
                                    <div className="col-12 col-sm-6">
                                        <label className="admin-form-label mb-1">
                                            Designation <span className="text-danger">*</span>
                                        </label>
                                        <CustomSelect
                                            value={showEditModal ? (editMember?.designation || "") : newMember.designation}
                                            options={DESIGNATION_OPTIONS}
                                            onChange={(val) => {
                                                if (showEditModal && editMember) {
                                                    setEditMember({ ...editMember, designation: val });
                                                    handleDesignationChange(val, true);
                                                } else {
                                                    setNewMember({ ...newMember, designation: val });
                                                    handleDesignationChange(val, false);
                                                }
                                            }}
                                            label="Select Designation"
                                            icon="bi-award"
                                            hasError={Boolean(showEditModal ? editValidationErrors.designation : validationErrors.designation)}
                                        />
                                        {(showEditModal ? editValidationErrors.designation : validationErrors.designation) && (
                                            <div className="invalid-feedback-custom">
                                                {showEditModal ? editValidationErrors.designation : validationErrors.designation}
                                            </div>
                                        )}
                                    </div>

                                    {/* Batch */}
                                    <div className="col-12 col-sm-6">
                                        <label className="admin-form-label mb-1">
                                            Batch Year <span className="text-danger">*</span>
                                        </label>
                                        <CustomSelect
                                            value={showEditModal ? (editMember?.batch || "") : newMember.batch}
                                            options={BATCH_OPTIONS}
                                            onChange={(val) => {
                                                if (showEditModal && editMember) {
                                                    setEditMember({ ...editMember, batch: val });
                                                    handleBatchChange(val, true);
                                                } else {
                                                    setNewMember({ ...newMember, batch: val });
                                                    handleBatchChange(val, false);
                                                }
                                            }}
                                            label="Select Batch"
                                            icon="bi-mortarboard"
                                            hasError={Boolean(showEditModal ? editValidationErrors.batch : validationErrors.batch)}
                                        />
                                        {(showEditModal ? editValidationErrors.batch : validationErrors.batch) && (
                                            <div className="invalid-feedback-custom">
                                                {showEditModal ? editValidationErrors.batch : validationErrors.batch}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div>
                                    <label className="admin-form-label mb-2 text-secondary">
                                        Social Profiles (Optional)
                                    </label>
                                    <div className="d-flex flex-column" style={{ gap: '12px' }}>
                                        {/* LinkedIn */}
                                        <div>
                                            <div
                                                className={`studio-input-wrap d-flex align-items-center w-100 px-3 ${(showEditModal ? editValidationErrors.linkedin : validationErrors.linkedin) ? 'has-error' : ''}`}
                                                style={{ minHeight: '44px', gap: '10px' }}
                                            >
                                                <i className="bi bi-linkedin text-info flex-shrink-0" style={{ fontSize: '1rem' }}></i>
                                                <input
                                                    type="url"
                                                    placeholder="https://linkedin.com/in/username"
                                                    className="w-100 text-white bg-transparent border-0"
                                                    style={{ outline: 'none', fontSize: '0.875rem' }}
                                                    value={showEditModal ? (editMember?.social.linkedin || "") : (newMember.social.linkedin || "")}
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
                                                {(showEditModal ? editMember?.social.linkedin : newMember.social.linkedin) && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-secondary p-1 ms-1 text-decoration-none hover-light"
                                                        title="Clear LinkedIn"
                                                        onClick={() => {
                                                            if (showEditModal && editMember) {
                                                                if (editMember._id) {
                                                                    handleDeleteSocial("linkedin");
                                                                } else {
                                                                    setEditMember({ ...editMember, social: { ...editMember.social, linkedin: "" } });
                                                                    handleLinkedInChange("", true);
                                                                }
                                                            } else {
                                                                setNewMember({ ...newMember, social: { ...newMember.social, linkedin: "" } });
                                                                handleLinkedInChange("", false);
                                                            }
                                                        }}
                                                    >
                                                        <i className="bi bi-x-circle-fill" style={{ fontSize: '0.85rem' }}></i>
                                                    </button>
                                                )}
                                            </div>
                                            {(showEditModal ? editValidationErrors.linkedin : validationErrors.linkedin) && (
                                                <div className="invalid-feedback-custom">
                                                    {showEditModal ? editValidationErrors.linkedin : validationErrors.linkedin}
                                                </div>
                                            )}
                                        </div>

                                        {/* Instagram */}
                                        <div>
                                            <div
                                                className={`studio-input-wrap d-flex align-items-center w-100 px-3 ${(showEditModal ? editValidationErrors.instagram : validationErrors.instagram) ? 'has-error' : ''}`}
                                                style={{ minHeight: '44px', gap: '10px' }}
                                            >
                                                <i className="bi bi-instagram text-danger flex-shrink-0" style={{ fontSize: '1rem' }}></i>
                                                <input
                                                    type="url"
                                                    placeholder="https://instagram.com/username"
                                                    className="w-100 text-white bg-transparent border-0"
                                                    style={{ outline: 'none', fontSize: '0.875rem' }}
                                                    value={showEditModal ? (editMember?.social.instagram || "") : (newMember.social.instagram || "")}
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
                                                {(showEditModal ? editMember?.social.instagram : newMember.social.instagram) && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-secondary p-1 ms-1 text-decoration-none hover-light"
                                                        title="Clear Instagram"
                                                        onClick={() => {
                                                            if (showEditModal && editMember) {
                                                                if (editMember._id) {
                                                                    handleDeleteSocial("instagram");
                                                                } else {
                                                                    setEditMember({ ...editMember, social: { ...editMember.social, instagram: "" } });
                                                                    handleInstagramChange("", true);
                                                                }
                                                            } else {
                                                                setNewMember({ ...newMember, social: { ...newMember.social, instagram: "" } });
                                                                handleInstagramChange("", false);
                                                            }
                                                        }}
                                                    >
                                                        <i className="bi bi-x-circle-fill" style={{ fontSize: '0.85rem' }}></i>
                                                    </button>
                                                )}
                                            </div>
                                            {(showEditModal ? editValidationErrors.instagram : validationErrors.instagram) && (
                                                <div className="invalid-feedback-custom">
                                                    {showEditModal ? editValidationErrors.instagram : validationErrors.instagram}
                                                </div>
                                            )}
                                        </div>

                                        {/* Facebook */}
                                        <div>
                                            <div
                                                className={`studio-input-wrap d-flex align-items-center w-100 px-3 ${(showEditModal ? editValidationErrors.facebook : validationErrors.facebook) ? 'has-error' : ''}`}
                                                style={{ minHeight: '44px', gap: '10px' }}
                                            >
                                                <i className="bi bi-facebook text-primary flex-shrink-0" style={{ fontSize: '1rem' }}></i>
                                                <input
                                                    type="url"
                                                    placeholder="https://facebook.com/username"
                                                    className="w-100 text-white bg-transparent border-0"
                                                    style={{ outline: 'none', fontSize: '0.875rem' }}
                                                    value={showEditModal ? (editMember?.social.facebook || "") : (newMember.social.facebook || "")}
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
                                                {(showEditModal ? editMember?.social.facebook : newMember.social.facebook) && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-secondary p-1 ms-1 text-decoration-none hover-light"
                                                        title="Clear Facebook"
                                                        onClick={() => {
                                                            if (showEditModal && editMember) {
                                                                if (editMember._id) {
                                                                    handleDeleteSocial("facebook");
                                                                } else {
                                                                    setEditMember({ ...editMember, social: { ...editMember.social, facebook: "" } });
                                                                    handleFacebookChange("", true);
                                                                }
                                                            } else {
                                                                setNewMember({ ...newMember, social: { ...newMember.social, facebook: "" } });
                                                                handleFacebookChange("", false);
                                                            }
                                                        }}
                                                    >
                                                        <i className="bi bi-x-circle-fill" style={{ fontSize: '0.85rem' }}></i>
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

                        {/* Modal Footer */}
                        <div className="d-flex justify-content-end align-items-center pt-3 mt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', gap: '14px' }}>
                            <button
                                type="button"
                                className="btn-admin-secondary d-inline-flex align-items-center px-4 py-2"
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
                                className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center"
                                onClick={showEditModal ? handleUpdateMember : handleAddMember}
                                disabled={showEditModal ? (hasEditValidationErrors || isSubmitting || !editMember) : (hasValidationErrors || isSubmitting)}
                            >
                                {isSubmitting ? (
                                    <span className="d-inline-flex align-items-center" style={{ gap: '8px' }}>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span>{showEditModal ? 'Saving...' : 'Adding...'}</span>
                                    </span>
                                ) : (
                                    <span>{showEditModal ? 'Save Changes' : 'Add Member'}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- CROP STUDIO MODAL --- */}
            {showCropModal && (
                <div className="admin-modal-overlay">
                    <div className="member-crop-modal p-4 m-2" style={{ maxWidth: '760px', width: '100%' }}>
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '10px',
                                        background: 'rgba(56, 189, 248, 0.15)',
                                        border: '1px solid rgba(56, 189, 248, 0.3)',
                                        color: '#38bdf8'
                                    }}
                                >
                                    <i className="bi bi-crop fs-5"></i>
                                </div>
                                <div>
                                    <h5 className="m-0 fw-bold text-white tracking-tight" style={{ fontSize: '1.1rem' }}>Studio Photo Framing</h5>
                                    <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: '0.78rem' }}>Drag and zoom to perfectly frame the executive portrait</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-link text-secondary text-decoration-none p-1.5 rounded-circle hover-light"
                                onClick={() => setShowCropModal(false)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* Cropper Viewport */}
                        <div
                            className="position-relative overflow-hidden rounded-3 mb-3"
                            style={{
                                height: '460px',
                                background: '#020617',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                            }}
                        >
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={3 / 4}
                                restrictPosition={true}
                                minZoom={1}
                                maxZoom={4}
                                onCropChange={setCrop}
                                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                                onZoomChange={setZoom}
                                showGrid={true}
                            />
                        </div>

                        {/* Footer Controls */}
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-2">
                            <div className="d-flex align-items-center w-100 w-sm-auto" style={{ gap: '12px' }}>
                                <i className="bi bi-zoom-out text-secondary" style={{ fontSize: '1rem', flexShrink: 0 }}></i>
                                <input
                                    type="range"
                                    min={1}
                                    max={4}
                                    step={0.05}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="form-range"
                                    style={{ width: 140, cursor: 'pointer', margin: '0 4px' }}
                                />
                                <i className="bi bi-zoom-in text-secondary" style={{ fontSize: '1rem', flexShrink: 0 }}></i>
                                <span
                                    className="badge rounded-pill bg-dark border border-secondary text-secondary"
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '6px 12px',
                                        marginLeft: '8px',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {zoom.toFixed(1)}x
                                </span>
                            </div>
                            <div className="d-flex align-items-center w-100 w-sm-auto justify-content-end" style={{ gap: '14px' }}>
                                <button
                                    type="button"
                                    className="btn-admin-secondary px-4 py-2"
                                    onClick={() => setShowCropModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center"
                                    style={{ gap: '8px' }}
                                    onClick={handleCropSave}
                                >
                                    <i className="bi bi-check2 fs-6"></i> <span>Apply Crop</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {showDeleteModal && (
                <div className="admin-modal-overlay">
                    <div
                        className="member-studio-modal p-4 m-2 text-center"
                        style={{
                            maxWidth: '460px',
                            width: '100%',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(239, 68, 68, 0.15)'
                        }}
                    >
                        {/* Glowing Warning Icon */}
                        <div
                            className="d-inline-flex align-items-center justify-content-center p-3 mb-3"
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                animation: 'pulseDanger 2s infinite'
                            }}
                        >
                            <i className="bi bi-trash3-fill fs-3 text-danger"></i>
                        </div>

                        <h4 className="fw-bold text-white mb-1.5" style={{ fontSize: '1.25rem' }}>Delete Member Profile?</h4>
                        <p className="text-secondary small mb-3" style={{ fontSize: '0.85rem' }}>
                            Are you sure you want to permanently remove this member from the directory?
                        </p>

                        {/* Member Identity Chip */}
                        {memberToDelete && (
                            <div
                                className="rounded-3 mb-4 d-flex align-items-center text-start mx-auto"
                                style={{
                                    maxWidth: '360px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    padding: '12px 16px',
                                    gap: '14px'
                                }}
                            >
                                <div
                                    className="rounded-2 overflow-hidden flex-shrink-0"
                                    style={{
                                        width: 46,
                                        height: 46,
                                        background: '#020617',
                                        border: '1px solid rgba(255, 255, 255, 0.12)'
                                    }}
                                >
                                    {memberToDelete.profilePic ? (
                                        <img src={memberToDelete.profilePic} alt={memberToDelete.name} className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary opacity-50">
                                            <i className="bi bi-person text-white fs-5"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="overflow-hidden flex-grow-1">
                                    <div className="text-white fw-bold text-truncate" style={{ fontSize: '0.925rem', lineHeight: 1.3, marginBottom: '2px' }}>
                                        {memberToDelete.name}
                                    </div>
                                    <div className="text-secondary small text-truncate" style={{ fontSize: '0.78rem', lineHeight: 1.3, color: '#94a3b8' }}>
                                        {memberToDelete.designation} · {memberToDelete.batch}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="d-flex justify-content-center" style={{ gap: '14px' }}>
                            <button
                                type="button"
                                className="btn-admin-secondary px-4 py-2"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger px-4 py-2 rounded-2 fw-semibold d-inline-flex align-items-center gap-2 shadow"
                                onClick={handleDeleteMember}
                                disabled={loading}
                                style={{ background: '#dc2626', border: '1px solid #ef4444' }}
                            >
                                {loading ? (
                                    <span className="d-inline-flex align-items-center gap-2">
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span>Deleting...</span>
                                    </span>
                                ) : (
                                    <span className="d-inline-flex align-items-center gap-2">
                                        <i className="bi bi-trash3-fill"></i>
                                        <span>Delete Member</span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Members;