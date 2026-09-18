import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import {
    getApplicationsByRecruitment,
    updateApplicationStatus,
    type Applicant,
    type ApplicationStatus,
} from "../../services/admin/applicationService";

interface Recruitment {
    _id: string;
    title: string;
    role: string;
    description: string;
    startDate: string;
    endDate: string;
    isOpen: boolean;
    applicantsCount: number;
    questions?: any[];
}

const RecruitmentApplications: React.FC = () => {
    const { recruitmentId } = useParams<{ recruitmentId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<Applicant[]>([]);
    const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
    const [filteredApplications, setFilteredApplications] = useState<Applicant[]>([]);

    // Selection States
    const [selectedApplication, setSelectedApplication] = useState<Applicant | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'questionnaire'>('overview');

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'appliedAt' | 'name' | 'status'>('appliedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Status Updates
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const [toast, setToast] = useState<{
        show: boolean;
        variant: "success" | "error" | "info" | "warning";
        message: string;
    } | null>(null);

    // Fetch applications
    useEffect(() => {
        const fetchApplications = async () => {
            if (!recruitmentId) return;
            try {
                setLoading(true);
                const response = await getApplicationsByRecruitment(recruitmentId);
                setApplications(response.applications || []);
                setRecruitment(response.recruitment || null);
            } catch (error: any) {
                setToast({
                    show: true,
                    variant: "error",
                    message: error.message || "Failed to load applications"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [recruitmentId]);

    // Filter and sort applications
    useEffect(() => {
        let filtered = [...applications];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.name.toLowerCase().includes(term) ||
                app.email.toLowerCase().includes(term) ||
                app.phone.includes(term)
            );
        }

        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'appliedAt':
                    aValue = new Date(a.appliedAt).getTime();
                    bValue = new Date(b.appliedAt).getTime();
                    break;
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredApplications(filtered);
    }, [applications, statusFilter, searchTerm, sortBy, sortOrder]);

    const handleStatusUpdate = async (
        applicationId: string,
        newStatus: ApplicationStatus
    ) => {
        try {
            setUpdatingStatus(applicationId);

            // Call API (status only)
            await updateApplicationStatus(applicationId, newStatus);

            // Update local state
            setApplications(prev =>
                prev.map(app =>
                    app._id === applicationId
                        ? {
                            ...app,
                            status: newStatus,
                        }
                        : app
                )
            );

            setToast({
                show: true,
                variant: "success",
                message: "Status updated successfully",
            });

            setShowStatusModal(false);
        } catch (error: any) {
            setToast({
                show: true,
                variant: "error",
                message: error.message || "Failed to update status",
            });
        } finally {
            setUpdatingStatus(null);
        }
    };

const handleViewResume = (resumePath: string) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

    const fullUrl = resumePath.startsWith("http")
        ? resumePath
        : `${BASE_URL}${resumePath}`;

    window.open(fullUrl, "_blank", "noopener,noreferrer");
};

    const openDetailsModal = (app: Applicant) => {
        setSelectedApplication(app);
        setActiveTab('overview');
        setShowDetailsModal(true);
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'reviewed': return 'info';
            case 'shortlisted': return 'success';
            case 'rejected': return 'danger';
            case 'accepted': return 'primary';
            default: return 'secondary';
        }
    };

    const getStatusBadgeClass = (status: ApplicationStatus) => {
        const color = getStatusColor(status);
        return `bg-${color} bg-opacity-25 text-${color} border border-${color} border-opacity-25`;
    };

    const getStatusDisplay = (status: ApplicationStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const statusOptions: Array<{ value: ApplicationStatus, label: string, color: string }> = [
        { value: 'pending', label: 'Pending', color: 'warning' },
        { value: 'reviewed', label: 'Reviewed', color: 'info' },
        { value: 'shortlisted', label: 'Shortlisted', color: 'success' },
        { value: 'rejected', label: 'Rejected', color: 'danger' },
        { value: 'accepted', label: 'Accepted', color: 'primary' }
    ];

    const totalApplications = applications.length;
    const pendingCount = applications.filter(a => a.status === 'pending').length;
    const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
    const acceptedCount = applications.filter(a => a.status === 'accepted').length;

    return (
        <AdminLayout
            active="Recruitment"
            loading={loading}
            toast={toast || undefined}
            onCloseToast={() => setToast(null)}
        >
            <style>{`
        /* --- 1. PAGE LAYOUT ANIMATIONS --- */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-enter {
            opacity: 0;
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .delay-0 { animation-delay: 0.05s; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.15s; }
        .delay-3 { animation-delay: 0.2s; }

        /* --- 2. MODAL & TAB ANIMATIONS --- */
        
        @keyframes springUp {
            0% { opacity: 0; transform: scale(0.95) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-glass {
          background: rgba(18, 18, 24, 0.98) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          animation: springUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* --- SMOOTH SLIDING TAB ANIMATION --- */
        @keyframes tabSlideIn {
            from { 
                opacity: 0; 
                transform: translateX(20px); /* Start slightly to the right */
            }
            to { 
                opacity: 1; 
                transform: translateX(0); 
            }
        }
        
        .tab-animate {
            /* Using a cubic-bezier for a "Fast Start, Slow End" sliding feel */
            animation: tabSlideIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* --- 3. UI POLISH & GLOWS --- */
        .glow-border {
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        .glow-border:hover {
             border-color: rgba(59, 130, 246, 0.4);
             box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
        }

        .glass-card {
          background: rgba(31, 41, 55, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .glass-card:hover {
            transform: translateY(-2px);
        }

        .detail-box {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.5rem;
          height: 100%;
          transition: all 0.3s ease;
        }
        .detail-box:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .mobile-content-wrapper { padding-top: 80px; }
          .mobile-stack { flex-direction: column !important; align-items: flex-start !important; }
        }

        /* Tabs Styling */
        .custom-tab-btn {
            background: transparent;
            border: none;
            color: #9ca3af;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease; /* Smooth transition for color */
            position: relative;
        }
        .custom-tab-btn:hover { color: #fff; }
        .custom-tab-btn.active { color: #60a5fa; }
        
        /* Sliding Underline Effect */
        .custom-tab-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 2px;
            background: #60a5fa;
            box-shadow: 0 -2px 10px #60a5fa;
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            transform: translateX(-50%);
        }
        .custom-tab-btn.active::after {
            width: 100%; /* Expands to full width when active */
        }

        .modal-backdrop.show { opacity: 0.85; background-color: #050505; }
        .icon-circle { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .pdf-frame { width: 100%; height: 80vh; border: none; background-color: #fff; border-radius: 8px; }
        .input-group-text { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
        .custom-table tr { transition: all 0.2s; }
        .custom-table tr:hover { background-color: rgba(255, 255, 255, 0.03) !important; }
      `}</style>

            <div className="mobile-content-wrapper">

                {/* --- Header Section --- */}
                <div className="mb-4 animate-enter delay-0">
                    <div className="mb-2">
                        <button
                            className="btn btn-link text-secondary text-decoration-none p-0 d-flex align-items-center gap-2"
                            style={{ fontSize: '0.9rem' }}
                            onClick={() => navigate('/admin/recruitments')}
                        >
                            <i className="bi bi-arrow-left"></i> Back to Recruitments
                        </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-end mobile-stack">
                        <div>
                            <h1 className="fw-bold text-white mb-2">Applications</h1>
                            {recruitment && (
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="text-primary mb-0">{recruitment.title}</h5>
                                    <span className="text-secondary">|</span>
                                    <span className="text-secondary small">
                                        <i className="bi bi-briefcase me-1"></i> {recruitment.role}
                                    </span>
                                    <span className={`badge ${recruitment.isOpen ? 'bg-success' : 'bg-secondary'} bg-opacity-75`}>
                                        {recruitment.isOpen ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Stats Overview --- */}
                <div className="row g-3 mb-4 animate-enter delay-1">
                    {[
                        { label: 'Total', count: totalApplications, color: 'text-white', bg: 'bg-dark' },
                        { label: 'Pending', count: pendingCount, color: 'text-warning', bg: 'bg-warning' },
                        { label: 'Shortlisted', count: shortlistedCount, color: 'text-success', bg: 'bg-success' },
                        { label: 'Accepted', count: acceptedCount, color: 'text-primary', bg: 'bg-primary' },
                    ].map((stat, idx) => (
                        <div className="col-6 col-md-3" key={idx}>
                            <div className="glass-card p-3 d-flex align-items-center justify-content-between">
                                <div>
                                    <div className={`fs-2 fw-bold ${stat.color}`}>{stat.count}</div>
                                    <div className="text-secondary small text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>{stat.label}</div>
                                </div>
                                <div className={`icon-circle ${stat.bg} bg-opacity-10`}>
                                    <i className={`bi bi-people ${stat.color}`}></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Filters --- */}
                <div className="glass-card p-3 mb-4 animate-enter delay-2">
                    <div className="row g-3">
                        <div className="col-12 col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent">
                                    <i className="bi bi-search text-white"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control bg-transparent text-white border-start-0 border-secondary"
                                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                    placeholder="Search applicants..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Filter by Status (All)</option>
                                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="col-12 col-md-3">
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select bg-dark text-white border-secondary"
                                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                >
                                    <option value="appliedAt">Date</option>
                                    <option value="name">Name</option>
                                    <option value="status">Status</option>
                                </select>
                                <button className="btn btn-outline-secondary" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                                    <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Applications Table --- */}
                <div className="glass-card overflow-hidden animate-enter delay-3">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="text-secondary mt-2">Loading applications...</p>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3">
                                <i className="bi bi-inbox display-4 text-secondary opacity-25"></i>
                            </div>
                            <h5 className="text-white">No applications found</h5>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0 custom-table bg-transparent">
                                <thead>
                                    <tr className="border-bottom border-secondary" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                                        <th className="bg-transparent border-0 ps-4 py-3 text-secondary text-uppercase small fw-bold">Applicant</th>
                                        <th className="bg-transparent border-0 py-3 text-secondary text-uppercase small fw-bold">Contact</th>
                                        <th className="bg-transparent border-0 py-3 text-secondary text-uppercase small fw-bold">Date</th>
                                        <th className="bg-transparent border-0 py-3 text-secondary text-uppercase small fw-bold">Status</th>
                                        <th className="bg-transparent border-0 text-end pe-4 py-3 text-secondary text-uppercase small fw-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApplications.map(application => (
                                        <tr key={application._id} className="align-middle border-bottom border-secondary" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                                            <td className="ps-4 py-3 bg-transparent">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="icon-circle bg-primary bg-opacity-25 text-primary fw-bold fs-5">
                                                        {application.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-white">{application.name}</div>
                                                        {application.coverLetter && <small className="text-info" style={{ fontSize: '0.75rem' }}>+ Cover Letter</small>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="bg-transparent">
                                                <div className="text-secondary small">
                                                    <div><i className="bi bi-envelope me-2"></i>{application.email}</div>
                                                    <div><i className="bi bi-telephone me-2"></i>{application.phone}</div>
                                                </div>
                                            </td>
                                            <td className="bg-transparent">
                                                <div className="text-secondary small">{formatDate(application.appliedAt)}</div>
                                            </td>
                                            <td className="bg-transparent">
                                                <span className={`badge rounded-pill fw-normal ${getStatusBadgeClass(application.status)}`}>
                                                    {getStatusDisplay(application.status)}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4 bg-transparent">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        className="btn btn-sm btn-dark border-secondary text-info"
                                                        onClick={() => openDetailsModal(application)}
                                                        title="View Details"
                                                    >
                                                        <i className="bi bi-eye-fill"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-dark border-secondary text-warning"
                                                        onClick={() => handleViewResume(application.resume)}
                                                        title="View Resume"
                                                    >
                                                        <i className="bi bi-file-earmark-pdf-fill"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-dark border-secondary text-primary"
                                                        onClick={() => {
                                                            setSelectedApplication(application);
                                                            setShowStatusModal(true);
                                                        }}
                                                        title="Change Status"
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* --- GLOWING DETAILS MODAL --- */}
            {showDetailsModal && selectedApplication && (
                <div className="modal fade show d-block" tabIndex={-1}>
                    <div className="modal-backdrop show"></div>
                    <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        style={{ zIndex: 1055, position: 'relative' }}
                    >
                        <div className="modal-content modal-glass glow-border rounded-4 overflow-hidden">

                            <div className="modal-header border-bottom border-secondary p-4 bg-black bg-opacity-20">
                                <div>
                                    <h4 className="modal-title text-white fw-bold">Application Details</h4>
                                    <p className="text-secondary small mb-0 font-monospace opacity-75">ID: {selectedApplication._id}</p>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDetailsModal(false)}></button>
                            </div>

                            <div className="border-bottom border-secondary px-4 d-flex gap-3 bg-black bg-opacity-10">
                                <button
                                    className={`custom-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`custom-tab-btn ${activeTab === 'questionnaire' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('questionnaire')}
                                >
                                    Questionnaire
                                    <span className="badge bg-secondary ms-2 text-dark bg-opacity-50">{selectedApplication.answers?.length || 0}</span>
                                </button>
                            </div>

                            <div className="modal-body p-4" style={{ minHeight: '400px' }}>
                                {/* SMOOTH TAB SWITCH WRAPPER */}
                                <div key={activeTab} className="tab-animate h-100">
                                    {activeTab === 'overview' ? (
                                        <div className="row g-4 h-100">
                                            <div className="col-md-7">
                                                <div className="detail-box">
                                                    <h6 className="text-uppercase text-secondary small fw-bold mb-4 tracking-wide">Candidate Profile</h6>
                                                    <div className="d-flex align-items-center gap-4 mb-4">
                                                        <div className="icon-circle bg-primary bg-gradient text-white fs-2 shadow-lg" style={{ width: 80, height: 80 }}>
                                                            {selectedApplication.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white mb-2 fw-bold">{selectedApplication.name}</h3>
                                                            <span className={`badge px-3 py-2 ${getStatusBadgeClass(selectedApplication.status)}`}>
                                                                {getStatusDisplay(selectedApplication.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <hr className="border-secondary opacity-25 my-4" />
                                                    <div className="row g-3">
                                                        <div className="col-6">
                                                            <label className="text-secondary small d-block mb-1">Email Address</label>
                                                            <div className="text-white fw-medium">{selectedApplication.email}</div>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="text-secondary small d-block mb-1">Phone Number</label>
                                                            <div className="text-white fw-medium">{selectedApplication.phone}</div>
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="text-secondary small d-block mb-1">Applied Date</label>
                                                            <div className="text-white fw-medium">{formatDate(selectedApplication.appliedAt)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-5">
                                                <div className="detail-box d-flex flex-column justify-content-between">
                                                    <div>
                                                        <h6 className="text-uppercase text-secondary small fw-bold mb-3">Documents</h6>
                                                        <div className="p-3 rounded-3 border border-secondary bg-dark bg-opacity-50 d-flex flex-column gap-2 hover-shadow">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="bg-danger bg-opacity-20 p-2 rounded text-danger">
                                                                    <i className="bi bi-file-earmark-pdf fs-4"></i>
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <div className="text-white fw-medium text-truncate">Resume.pdf</div>
                                                                    <div className="text-secondary small">Uploaded with application</div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="btn btn-sm btn-outline-primary w-100 mt-2"
                                                                onClick={() => handleViewResume(selectedApplication.resume)}
                                                            >
                                                                <i className="bi bi-eye me-2"></i> View Document
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <div className="alert alert-info bg-opacity-10 border-info border-opacity-25 text-info small mb-0">
                                                            <i className="bi bi-info-circle me-2"></i>
                                                            Review the questionnaire tab before making a decision.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-100">
                                            <div className="detail-box overflow-auto" style={{ maxHeight: '450px' }}>
                                                {selectedApplication.answers && selectedApplication.answers.length > 0 ? (
                                                    <div className="d-grid gap-3">
                                                        {selectedApplication.answers.map((ans, i) => (
                                                            <div key={i} className="p-3 rounded border border-secondary bg-black bg-opacity-20">
                                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                                    <span className="text-secondary text-uppercase small fw-bold">Question {i + 1}</span>
                                                                </div>
                                                                <div className="text-white-50 mb-2 fst-italic">{ans.question}</div>
                                                                <div className="text-white fw-medium ps-3 border-start border-3 border-primary">
                                                                    {Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-secondary py-5">
                                                        <i className="bi bi-chat-square-text display-4 mb-3 d-block opacity-25"></i>
                                                        No questionnaire responses found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer border-top border-secondary p-3 bg-black bg-opacity-25 justify-content-between">
                                <button className="btn btn-link text-secondary text-decoration-none" onClick={() => setShowDetailsModal(false)}>Cancel</button>
                                <button
                                    className="btn btn-primary px-4 shadow-lg"
                                    onClick={() => { setShowDetailsModal(false); setShowStatusModal(true); }}
                                >
                                    Update Applicant Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STATUS UPDATE MODAL --- */}
            {showStatusModal && selectedApplication && (
                <div className="modal fade show d-block" style={{ zIndex: 1070 }}>
                    <div className="modal-backdrop show"></div>
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ zIndex: 1080, position: 'relative' }}
                    >
                        <div className="modal-content modal-glass glow-border border-secondary">
                            <div className="modal-header border-bottom border-secondary">
                                <h5 className="modal-title text-white">Update Status</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowStatusModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <div className="mb-4">
                                    <div className="icon-circle bg-primary text-white mx-auto mb-3 fs-3 shadow-lg" style={{ width: 64, height: 64 }}>
                                        <i className="bi bi-pencil-fill text-white"></i>
                                    </div>
                                    <h4 className="text-white fw-bold">Change Applicant Status</h4>
                                    <p className="text-secondary">For {selectedApplication.name}</p>
                                </div>

                                <div className="d-grid gap-2">
                                    {statusOptions.map(option => (
                                        <button
                                            key={option.value}
                                            className={`btn p-3 text-start d-flex justify-content-between align-items-center ${selectedApplication.status === option.value
                                                ? `btn-${option.color} shadow-lg`
                                                : `btn-outline-secondary text-white border-secondary bg-dark bg-opacity-50`
                                                }`}
                                            onClick={() => handleStatusUpdate(selectedApplication._id, option.value)}
                                            disabled={updatingStatus === selectedApplication._id}
                                            style={{ transition: 'all 0.2s' }}
                                        >
                                            <span className="fw-medium">{option.label}</span>
                                            {selectedApplication.status === option.value && <i className="bi bi-check-circle-fill"></i>}
                                            {updatingStatus === selectedApplication._id && selectedApplication.status !== option.value && (
                                                <span className="opacity-0">.</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default RecruitmentApplications;