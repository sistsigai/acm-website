import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import { deleteMessage, getMessages, sendAutoReply, toggleMessageRead } from "../../services/admin/contactService";

/* ---------------- TYPES ---------------- */
interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

/* ---------------- COMPONENT ---------------- */
const Query: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"all" | "unread">("all");

    // Modal States
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

    const [toast, setToast] = useState<{
        show: boolean;
        variant: "success" | "error" | "info";
        message: string;
    } | null>(null);

    /* ---------------- LOAD DATA ---------------- */
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const data = await getMessages();
                const sorted = data.sort((a: ContactMessage, b: ContactMessage) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setMessages(sorted);
            } catch (error) {
                setToast({ show: true, variant: "error", message: "Failed to load messages" });
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    /* ---------------- HELPERS ---------------- */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => {
            const matchesSearch =
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.subject.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = filterType === "all" ? true : !msg.isRead;

            return matchesSearch && matchesType;
        });
    }, [messages, searchTerm, filterType]);

    const toggleReadById = async (id: string) => {
        const res = await toggleMessageRead(id);
        setMessages(prev =>
            prev.map(m =>
                m._id === id ? { ...m, isRead: res.isRead } : m
            )
        );
    };

    /* ---------------- ACTIONS ---------------- */
    const handleOpenMessage = async (msg: ContactMessage) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            try {
                await toggleReadById(msg._id);
            } catch (err) {
                console.error("Failed to mark as read");
            }
        }
    };

    const handleAutoReply = async (msg: ContactMessage) => {
        try {
            setLoading(true);
            const res = await sendAutoReply(msg._id);
            setToast({ show: true, variant: "success", message: res.message });
        } catch (error: any) {
            setToast({ show: true, variant: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!messageToDelete) return;
        try {
            setLoading(true);
            const res = await deleteMessage(messageToDelete._id);
            setMessages(prev => prev.filter(m => m._id !== messageToDelete._id));
            setToast({ show: true, variant: "success", message: res.message });
            setShowDeleteModal(false);
            if (selectedMessage?._id === messageToDelete._id) {
                setSelectedMessage(null);
            }
        } catch (error: any) {
            setToast({ show: true, variant: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRead = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            const res = await toggleMessageRead(id);
            setMessages(prev =>
                prev.map(m =>
                    m._id === id ? { ...m, isRead: res.isRead } : m
                )
            );
            setToast({ show: true, variant: "success", message: res.message });
        } catch (error: any) {
            setToast({ show: true, variant: "error", message: error.message });
        }
    };

    return (
        <AdminLayout
            active="Messages"
            loading={loading}
            toast={toast || undefined}
            onCloseToast={() => setToast(null)}
        >
            <div className="mobile-offset p-2">

                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-5 gap-3 animate-up" style={{ animationDelay: '0ms' }}>
                    <div>
                        <h1 className="fw-bold text-white mb-2" style={{ letterSpacing: '-1px' }}>Inbox</h1>
                        <p className="text-secondary m-0">
                            Manage inquiries from the contact form.
                            <span className="badge bg-primary bg-opacity-20 text-info ms-2 rounded-pill">
                                {messages.filter(m => !m.isRead).length} Unread
                            </span>
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="d-flex filters-row justify-content-between align-items-center mb-4 animate-up" style={{ animationDelay: '100ms' }}>
                    <div className="d-flex gap-3 w-100 align-items-center filters-row">
                        <div className="admin-search-bar flex-grow-1">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                className="admin-search-input"
                                placeholder="Search by name, email or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    className="search-clear-btn"
                                    onClick={() => setSearchTerm("")}
                                    title="Clear search"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>

                        {/* Animated Toggle Switch */}
                        <div className="filter-container" data-active={filterType}>
                            <div className="filter-bg"></div>
                            <button
                                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterType('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${filterType === 'unread' ? 'active' : ''}`}
                                onClick={() => setFilterType('unread')}
                            >
                                Unread
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className="d-flex flex-column gap-3">
                    {filteredMessages.length === 0 && !loading ? (
                        <div className="text-center py-5 animate-up" style={{ animationDelay: '200ms' }}>
                            <i className="bi bi-inbox display-1 text-secondary opacity-25 d-block mb-3"></i>
                            <h4 className="text-secondary">No messages found</h4>
                        </div>
                    ) : (
                        filteredMessages.map((msg, index) => (
                            <div
                                key={msg._id}
                                className={`message-card p-3 p-md-4 d-flex align-items-start gap-3 animate-up ${!msg.isRead ? 'unread' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => handleOpenMessage(msg)}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="avatar-placeholder shadow-lg">
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow-1 overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <h6 className={`mb-0 text-truncate ${!msg.isRead ? 'text-white fw-bold' : 'text-light'}`}>
                                            {msg.name}
                                            {!msg.isRead && <span className="badge bg-primary ms-2" style={{ fontSize: '0.6rem', verticalAlign: 'middle' }}>NEW</span>}
                                        </h6>
                                        <small className="text-secondary text-nowrap ms-2">{formatDate(msg.createdAt)}</small>
                                    </div>

                                    <div className="text-info small mb-1 text-truncate">{msg.email}</div>
                                    <div className={`text-truncate mb-1 ${!msg.isRead ? 'text-white' : 'text-secondary'}`}>
                                        {msg.subject}
                                    </div>
                                    <p className="text-secondary small text-truncate m-0 opacity-75">
                                        {msg.message}
                                    </p>
                                </div>

                                {/* CORRECTED ACTIONS ALIGNMENT */}
                                <div className="d-flex flex-column gap-2 ms-2 align-items-center">
                                    <button
                                        className="btn btn-icon text-secondary hover-text-primary"
                                        title={msg.isRead ? "Mark as Unread" : "Mark as Read"}
                                        onClick={(e) => handleToggleRead(e, msg._id)}
                                    >
                                        <i
                                            className={`bi ${msg.isRead
                                                ? "bi-envelope-open"
                                                : "bi-envelope-fill text-primary"
                                                } fs-5`}
                                        />
                                    </button>
                                    
                                    <button
                                        className="btn btn-icon text-secondary hover-text-danger"
                                        title="Delete"
                                        onClick={(e) => { e.stopPropagation(); setMessageToDelete(msg); setShowDeleteModal(true); }}
                                    >
                                        <i className="bi bi-trash fs-5"></i>
                                    </button>

                                    <button
                                        className="btn btn-icon text-secondary hover-text-success"
                                        title="Send automated reply"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAutoReply(msg);
                                        }}
                                    >
                                        <i className="bi bi-envelope-paper fs-5"></i>
                                    </button>
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* --- View Message Modal --- */}
            {selectedMessage && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: 'blur(5px)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content modal-content-glass text-light border-0">

                            <div className="modal-header border-bottom border-secondary border-opacity-25 px-4 py-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="avatar-placeholder" style={{ width: 40, height: 40, fontSize: '1rem' }}>
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">{selectedMessage.name}</h5>
                                        <small className="text-secondary">{selectedMessage.email}</small>
                                    </div>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedMessage(null)}></button>
                            </div>

                            <div className="modal-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="badge bg-dark border border-secondary text-secondary rounded-pill px-3">
                                        <i className="bi bi-clock me-2"></i>
                                        {formatDate(selectedMessage.createdAt)}
                                    </span>
                                    <div className="d-flex gap-2">
                                        <a
                                            href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                            className="btn btn-primary rounded-pill px-4 btn-sm fw-medium"
                                        >
                                            <i className="bi bi-reply-fill me-2"></i>Reply
                                        </a>
                                        <button
                                            className="btn btn-outline-danger rounded-pill px-3 btn-sm"
                                            onClick={() => { setMessageToDelete(selectedMessage); setShowDeleteModal(true); }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-2 text-secondary small text-uppercase fw-bold">Subject</div>
                                <h5 className="text-white mb-4">{selectedMessage.subject}</h5>

                                <div className="mb-2 text-secondary small text-uppercase fw-bold">Message</div>
                                <div className="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 text-light" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {selectedMessage.message}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* --- Delete Confirmation Modal --- */}
            {showDeleteModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-content-glass rounded-4 p-4 text-center">
                            <div className="modal-body">
                                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
                                    <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                                </div>
                                <h4 className="fw-bold mb-2 text-white">Delete Message?</h4>
                                <p className="text-secondary mb-4">
                                    This action cannot be undone.
                                </p>

                                <div className="d-flex gap-2 justify-content-center">
                                    <button
                                        className="btn btn-outline-light rounded-pill px-4"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-danger rounded-pill px-4 fw-bold"
                                        onClick={handleDelete}
                                    >
                                        Delete
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

export default Query;