import React, { useState, useEffect, useRef } from 'react';
import { motion as m, AnimatePresence, type Variants } from "framer-motion";
import { FaExternalLinkAlt, FaCalendarAlt, FaTimes, FaUpload, FaTrash, FaFile, FaExclamationTriangle, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import {
    getAllRecruitments,
    getRecruitmentById,
    submitApplication,
    uploadFiles,
    type Question,
    type Answer,
    type FileAnswer,
    type ApplicationData,
    type AnswerValue
} from '../../services/website/joinservice';
import { GlobalLoader } from "../../components/GlobalLoader";
import { FloatingOrb } from '../../components/StatusMessage';

// --- TYPES ---
interface Role {
    id: string;
    title: string;
    department: string;
    description: string;
    startDate: string;
    endDate: string;
    questions?: Question[];
}

// --- HELPER: DATE FORMATTER ---
const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- HELPER: GET STATUS ---
const getStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return 'UPCOMING';
    if (now > endDate) return 'CLOSED';
    return 'OPEN';
};

// --- HELPER: FORMAT FILE SIZE ---
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const JoinUs: React.FC = () => {
    const [openings, setOpenings] = useState<Role[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    // Removed old error state in favor of Orb, or kept for inline fallback if desired
    // const [error, setError] = useState(''); 

    const [answers, setAnswers] = useState<Answer[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // 2. ORB STATE
    const [orb, setOrb] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
        isVisible: false,
        message: '',
        type: 'success'
    });

    const triggerOrb = (message: string, type: 'success' | 'error' | 'info') => {
        const orbType = type === 'info' ? 'success' : type;
        setOrb({ isVisible: true, message, type: orbType });
    };

    const closeOrb = () => {
        setOrb(prev => ({ ...prev, isVisible: false }));
    };

    const showGlobalLoader = submitting || uploading;

    useEffect(() => {
        const fetchRecruitments = async () => {
            try {
                const res = await getAllRecruitments();
                const recruitments = Array.isArray(res?.recruitments) ? res.recruitments : [];

                const mappedRoles = recruitments.map((r: any) => ({
                    id: r._id,
                    title: r.title,
                    department: r.role,
                    description: r.description,
                    startDate: r.startDate,
                    endDate: r.endDate,
                    questions: r.questions || []
                }));

                setOpenings(mappedRoles);

                // Show success message if no recruitments (empty state)
                if (mappedRoles.length === 0) {
                    triggerOrb(res?.message || "No active recruitments at the moment.", "success"); // Changed from "info" to "success"
                } else if (res?.message) {
                    triggerOrb(res.message, "success");
                }
            } catch (err: any) {
                console.error("Recruitment fetch failed", err);
                setOpenings([]);
                const errorMsg = err.response?.data?.message || "Failed to load recruitment openings.";
                triggerOrb(errorMsg, "error");
            }
        };

        fetchRecruitments();
    }, []);

    // --- MODAL FUNCTIONS ---
    const openApplicationModal = async (role: Role) => {
        try {
            const res = await getRecruitmentById(role.id);

            if (!res.success) {
                triggerOrb(res.message || "Failed to load application form.", "error");
                return;
            }

            const recruitmentData = res.recruitment;

            const roleWithQuestions = {
                ...role,
                questions: recruitmentData.questions || []
            };

            setSelectedRole(roleWithQuestions);

            if (roleWithQuestions.questions && roleWithQuestions.questions.length > 0) {
                const initialAnswers = roleWithQuestions.questions.map((q: Question) => ({
                    questionId: q.id,
                    question: q.question,
                    type: q.type,
                    answer: q.type === 'checkbox' ? [] as string[] :
                        q.type === 'yes-no' ? false :
                            (q.type === 'file-upload' || q.type === 'file') ? [] as FileAnswer[] : ''
                }));
                setAnswers(initialAnswers);
            }

            setValidationErrors({});
            setSuccess(false);
            setShowModal(true);

            // Show success message from server if available
            if (res.message) {
                triggerOrb(res.message, "success");
            }
        } catch (err: any) {
            console.error("Failed to fetch role details:", err);
            const errorMsg = err.response?.data?.message || "Failed to load application form.";
            triggerOrb(errorMsg, "error");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setSelectedRole(null);
            setSuccess(false);
            setSubmitting(false);
            setValidationErrors({});
        }, 300);
    };

    const handleAnswerChange = (questionId: string, value: AnswerValue) => {
        setAnswers(prev => prev.map(answer =>
            answer.questionId === questionId ? { ...answer, answer: value } : answer
        ));
        if (validationErrors[questionId]) {
            setValidationErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[questionId];
                return newErrs;
            });
        }
    };

    const handleCheckboxChange = (questionId: string, optionId: string, checked: boolean, question: Question) => {
        setAnswers(prev => prev.map(answer => {
            if (answer.questionId === questionId) {
                const currentAnswers = Array.isArray(answer.answer) ? answer.answer as string[] : [];
                let newAnswers: string[];

                if (checked) {
                    if (question.maxSelections && currentAnswers.length >= question.maxSelections) {
                        triggerOrb(`Max ${question.maxSelections} selections allowed`, 'error');
                        return answer;
                    }
                    newAnswers = [...currentAnswers, optionId];
                } else {
                    newAnswers = currentAnswers.filter(id => id !== optionId);
                }
                return { ...answer, answer: newAnswers };
            }
            return answer;
        }));

        if (validationErrors[questionId]) {
            setValidationErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[questionId];
                return newErrs;
            });
        }
    };

    // --- FILE UPLOAD HANDLERS ---
    const handleFileSelect = async (questionId: string, question: Question, files: FileList | null) => {
        if (!files || files.length === 0) return;

        const questionFiles = Array.from(files);
        const errors: string[] = [];
        const currentAnswer = answers.find(a => a.questionId === questionId);
        const currentFiles = Array.isArray(currentAnswer?.answer) ? currentAnswer.answer as FileAnswer[] : [];

        if (question.maxFiles && (currentFiles.length + questionFiles.length) > question.maxFiles) {
            errors.push(`Maximum ${question.maxFiles} file(s) allowed`);
        }

        questionFiles.forEach(file => {
            // --- FORMAT VALIDATION ---
            if (question.allowedFormats && question.allowedFormats.length > 0) {
                const fileExtension = file.name.includes('.')
                    ? file.name.split('.').pop()!.toLowerCase()
                    : '';

                const allowed = question.allowedFormats.map(f => f.toLowerCase());

                if (!allowed.includes(fileExtension)) {
                    errors.push(
                        `File "${file.name}" has invalid format.`
                    );
                }
            }

            // --- FILE SIZE VALIDATION ---
            if (question.maxFileSize && file.size > question.maxFileSize * 1024 * 1024) {
                errors.push(
                    `File "${file.name}" exceeds ${question.maxFileSize}MB`
                );
            }
        });

        if (errors.length > 0) {
            setValidationErrors(prev => ({ ...prev, [questionId]: errors.join('. ') }));
            triggerOrb(errors[0], 'error');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            questionFiles.forEach(file => { formData.append('files', file); });
            const uploadRes = await uploadFiles(formData);

            if (uploadRes.success && uploadRes.files) {
                const uploadedFiles: FileAnswer[] = uploadRes.files.map((file: any) => ({
                    url: file.url,
                    name: file.originalname,
                    size: file.size,
                    type: file.mimetype
                }));
                const updatedFiles = [...currentFiles, ...uploadedFiles];
                handleAnswerChange(questionId, updatedFiles);
                triggerOrb(uploadRes.message || "Files uploaded successfully", "success");
            } else {
                // Handle non-success response from upload
                triggerOrb(uploadRes.message || "File upload failed", "error");
            }
        } catch (err: any) {
            const serverResponse = err.response?.data;
            const errorMsg = serverResponse?.message ||
                (serverResponse?.code === "NO_FILES" ? "Please select files to upload" :
                    'Failed to upload files');

            setValidationErrors(prev => ({
                ...prev,
                [questionId]: errorMsg
            }));
            triggerOrb(errorMsg, "error");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (questionId: string, fileIndex: number) => {
        const currentAnswer = answers.find(a => a.questionId === questionId);
        if (!currentAnswer || !Array.isArray(currentAnswer.answer)) return;
        const currentFiles = currentAnswer.answer as FileAnswer[];
        const updatedFiles = currentFiles.filter((_, index) => index !== fileIndex);
        handleAnswerChange(questionId, updatedFiles);
    };

    // --- VALIDATION ---
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (selectedRole?.questions) {
            selectedRole.questions.forEach(question => {
                const answer = answers.find(a => a.questionId === question.id);

                if (question.required) {
                    if (!answer || answer.answer === undefined || answer.answer === null ||
                        (typeof answer.answer === 'string' && answer.answer.trim() === '') ||
                        (Array.isArray(answer.answer) && answer.answer.length === 0)) {
                        errors[question.id] = 'This field is required';
                    }
                }
                // ... (rest of validation logic remains same)
                if ((question.type === 'text' || question.type === 'textarea') && question.maxLength) {
                    const textAnswer = (answer?.answer as string) || '';
                    if (textAnswer.length > question.maxLength) {
                        errors[question.id] = `Max ${question.maxLength} characters`;
                    }
                }

                if (question.type === 'checkbox') {
                    const selectedOptions = Array.isArray(answer?.answer) ? (answer.answer as string[]).length : 0;
                    if (question.minSelections && selectedOptions < question.minSelections) {
                        errors[question.id] = `Select at least ${question.minSelections}`;
                    }
                    if (question.maxSelections && selectedOptions > question.maxSelections) {
                        errors[question.id] = `Select max ${question.maxSelections}`;
                    }
                }
            });
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // --- SUBMIT HANDLER ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            triggerOrb("Please correct the errors in the form.", "error");
            return;
        }

        setSubmitting(true);

        try {
            if (!selectedRole?.id) {
                triggerOrb("Recruitment not selected", "error");
                return;
            }

            const applicationData: ApplicationData = {
                recruitmentId: selectedRole.id,
                answers,
            };

            const res = await submitApplication(applicationData);

            if (res?.success) {
                setSuccess(true);
                setAnswers([]);
                triggerOrb(res.message || "Application submitted successfully!", "success");
            } else {
                // Handle non-success responses from server
                const errorMessage = res?.message ||
                    (res?.code === "VALIDATION_ERROR" ? "Please check your application details" :
                        res?.code === "DUPLICATE_APPLICATION" ? "You have already applied for this position" :
                            res?.code === "INVALID_ID" ? "Invalid recruitment ID" :
                                res?.code === "NOT_FOUND" ? "Recruitment not found" :
                                    res?.code === "SERVER_ERROR" ? "Server error, please try again" :
                                        "Submission failed");
                triggerOrb(errorMessage, "error");
            }
        } catch (error: any) {
            // Extract error message from axios response structure
            const serverResponse = error?.response?.data;
            let errorMessage = "Something went wrong";

            if (serverResponse) {
                // Use server message if available
                errorMessage = serverResponse.message ||
                    (serverResponse.code === "VALIDATION_ERROR" ? "Please check your application details" :
                        serverResponse.code === "DUPLICATE_APPLICATION" ? "You have already applied for this position" :
                            serverResponse.code === "INVALID_ID" ? "Invalid recruitment ID" :
                                serverResponse.code === "NOT_FOUND" ? "Recruitment not found" :
                                    serverResponse.code === "SERVER_ERROR" ? "Server error, please try again" :
                                        "Submission failed");
            } else if (error?.message) {
                errorMessage = error.message;
            }

            triggerOrb(errorMessage, "error");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [showModal]);

    // --- ANIMATION VARIANTS ---
    const formContainerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const formItemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 50, damping: 15 }
        }
    };

    // --- RENDER QUESTION COMPONENT ---
    const renderQuestion = (question: Question) => {
        const answer = answers.find(a => a.questionId === question.id);
        const error = validationErrors[question.id];
        const isCheckbox = question.type === 'checkbox';
        const selectedCount = isCheckbox && Array.isArray(answer?.answer) ? (answer.answer as string[]).length : 0;
        const canSelectMore = isCheckbox && question.maxSelections ? selectedCount < question.maxSelections : true;

        return (
            <m.div key={question.id} className="holo-input-group" variants={formItemVariants}>
                <label className="holo-label">
                    {question.question}
                    {question.required && <span className="req-star">*</span>}
                </label>

                {question.description && <div className="holo-desc">{question.description}</div>}

                {/* TEXT INPUTS */}
                {question.type === 'text' && (
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={(answer?.answer as string) || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            maxLength={question.maxLength}
                            placeholder={question.placeholder || "Type here..."}
                            className={`holo-input ${error ? 'error' : ''}`}
                        />
                        {question.maxLength && (
                            <span className="char-count">{((answer?.answer as string) || '').length}/{question.maxLength}</span>
                        )}
                    </div>
                )}

                {/* TEXTAREA */}
                {question.type === 'textarea' && (
                    <div className="input-wrapper">
                        <textarea
                            rows={4}
                            value={(answer?.answer as string) || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            maxLength={question.maxLength}
                            placeholder={question.placeholder || "Type details here..."}
                            className={`holo-input holo-textarea ${error ? 'error' : ''}`}
                        />
                        {question.maxLength && (
                            <span className="char-count">{((answer?.answer as string) || '').length}/{question.maxLength}</span>
                        )}
                    </div>
                )}

                {/* CHOICES (Radio/Checkbox) */}
                {(question.type === 'multiple-choice' || question.type === 'yes-no' || question.type === 'checkbox') && (
                    <div className="holo-options-grid">
                        {question.type === 'checkbox' ? (
                            question.options?.map(option => {
                                const isChecked = Array.isArray(answer?.answer) && (answer.answer as string[]).includes(option.id);
                                const isDisabled = !isChecked && !canSelectMore;
                                return (
                                    <div
                                        key={option.id}
                                        className={`holo-option-card ${isChecked ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                        onClick={() => !isDisabled && handleCheckboxChange(question.id, option.id, !isChecked, question)}
                                    >
                                        <div className="opt-checkbox">
                                            <AnimatePresence initial={false}>
                                                {isChecked && (
                                                    <m.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
                                                    >
                                                        <FaCheckCircle size={10} />
                                                    </m.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <span>{option.label}</span>
                                    </div>
                                );
                            })
                        ) : (
                            (question.type === 'yes-no' ? [{ id: true, label: 'Yes' }, { id: false, label: 'No' }] : question.options!).map((opt: any) => (
                                <div
                                    key={opt.id.toString()}
                                    className={`holo-option-card ${answer?.answer === opt.id ? 'selected' : ''}`}
                                    onClick={() => handleAnswerChange(question.id, opt.id)}
                                >
                                    <div className="opt-radio"></div>
                                    <span>{opt.label}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* DROPDOWN */}
                {question.type === 'dropdown' && (
                    <div className="input-wrapper">
                        <select
                            value={(answer?.answer as string) || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className={`holo-input ${error ? 'error' : ''}`}
                        >
                            <option value="">Select an option...</option>
                            {question.options?.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* FILE UPLOAD */}
                {question.type === 'file' && (
                    <div className="holo-file-area">
                        <input
                            type="file"
                            ref={el => { if (el) fileInputRefs.current[question.id] = el; }}
                            onChange={(e) => handleFileSelect(question.id, question, e.target.files)}
                            multiple={question.maxFiles !== 1}
                            style={{ display: 'none' }}
                            accept={question.allowedFormats?.join(',')}
                        />
                        <button type="button" className="holo-upload-btn" onClick={() => fileInputRefs.current[question.id]?.click()} disabled={uploading}>
                            <FaUpload /> {uploading ? 'Uploading...' : 'Select Files'}
                        </button>

                        <div className="holo-file-list">
                            {Array.isArray(answer?.answer) && (answer.answer as FileAnswer[]).map((file, idx) => (
                                <div key={idx} className="holo-file-tag">
                                    <FaFile className="file-icon" />
                                    <span className="fname">{file.name}</span>
                                    <span className="fsize">{formatFileSize(file.size)}</span>
                                    <FaTrash className="trash-icon" onClick={() => removeFile(question.id, idx)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="holo-error">
                        <FaExclamationTriangle /> {error}
                    </div>
                )}
            </m.div>
        );
    };

    return (
        <>
            <div className="join-page">
                <>
                    {/* --- IF NO DATA: SHOW STAY TUNED --- */}
                    {openings.length === 0 ? (
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flex: 1, justifyContent: 'center', marginTop: '-100px' }}
                        >
                            <div className="neural-container">
                                <m.div className="neural-core" animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                                <m.div className="gyro-ring g1" animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                                <m.div className="gyro-ring g2" animate={{ rotateX: -360, rotateZ: -180 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                                <m.div className="gyro-ring g3" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
                            </div>
                            <h2 className="stay-tuned-text">
                                Stay tuned for <br />
                                <span>upcoming Recruitments</span>
                            </h2>
                        </m.div>
                    ) : (
                        /* --- IF DATA EXISTS: SHOW GRID --- */
                        <>
                            <m.h1
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className='timeline-main-title'
                            >
                                JOIN THE <span className="highlight-text">TEAM</span>
                            </m.h1>

                            <m.div className="roles-grid" variants={formContainerVariants} initial="hidden" animate="show">
                                {openings.map((role) => {
                                    const status = getStatus(role.startDate, role.endDate);
                                    const isOpen = status === 'OPEN';
                                    return (
                                        <m.div key={role.id} className="role-card" variants={formItemVariants} whileHover={{ y: -5 }}>
                                            <div className="card-header">
                                                <span className="dept-badge">{role.department}</span>
                                                {isOpen ? <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.8rem' }}>● OPEN</span> : <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.8rem' }}>● CLOSED</span>}
                                            </div>
                                            <h3 className="role-title">{role.title}</h3>
                                            <p className="role-desc">{role.description}</p>
                                            <div className="card-footer">
                                                <div style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                    <FaCalendarAlt /> {formatDate(role.startDate)} - {formatDate(role.endDate)}
                                                </div>
                                                {isOpen ? (
                                                    <button onClick={() => openApplicationModal(role)} className="apply-btn btn-active">
                                                        Apply <FaExternalLinkAlt size={12} />
                                                    </button>
                                                ) : (
                                                    <button disabled className="apply-btn btn-disabled">Closed</button>
                                                )}
                                            </div>
                                        </m.div>
                                    );
                                })}
                            </m.div>
                        </>
                    )}
                </>

                {/* --- HOLOGRAPHIC MODAL --- */}
                <AnimatePresence>
                    {showModal && selectedRole && (
                        <m.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <m.div
                                className="holo-modal"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", bounce: 0.3 }}
                            >
                                {/* Header */}
                                <div className="modal-header">
                                    <h2 className="modal-title">{selectedRole.title}</h2>
                                    <button onClick={closeModal} className="close-button"><FaTimes /></button>
                                </div>

                                <div className="modal-body">
                                    {success ? (
                                        <div className="success-view">
                                            <m.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                                <FaCheckCircle className="success-check" />
                                            </m.div>
                                            <h2 style={{ color: '#fff', marginBottom: '10px' }}>Application Sent!</h2>
                                            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                                                Thank you for applying to the {selectedRole.department} position. <br />
                                                A confirmation email has been sent to your registered email address. We will review your application and contact you shortly.
                                            </p>
                                            <button onClick={closeModal} className="holo-submit-btn">
                                                Return to Openings
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            <m.div
                                                variants={formContainerVariants}
                                                initial="hidden"
                                                animate="show"
                                            >
                                                {selectedRole.questions?.map(q => renderQuestion(q))}

                                                <m.button
                                                    type="submit"
                                                    className="holo-submit-btn"
                                                    disabled={submitting || uploading}
                                                    whileTap={{ scale: 0.98 }}
                                                    variants={formItemVariants}
                                                >
                                                    {submitting ? 'Transmitting...' : uploading ? 'Uploading Files...' : <><FaPaperPlane style={{ marginRight: '8px' }} /> Submit Application</>}
                                                </m.button>
                                            </m.div>
                                        </form>
                                    )}
                                </div>
                            </m.div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="loader-wrapper">
                <GlobalLoader isLoading={showGlobalLoader} />
            </div>

            <FloatingOrb
                isVisible={orb.isVisible}
                message={orb.message}
                type={orb.type}
                onClose={closeOrb}
            />
        </>
    );
};

export default JoinUs;