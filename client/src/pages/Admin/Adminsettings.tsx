import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
    getAdminSettings,
    updateAdminSettings,
} from "../../services/admin/settingsService";

/* ---------------- COMPONENT ---------------- */
const AdminSettings: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{
        show: boolean;
        variant: "success" | "error" | "info" | "warning";
        message: string;
        title?: string;
    } | null>(null);

    /* ---------------- STATE ---------------- */
    const [orgName, setOrgName] = useState("");

    const [contact, setContact] = useState({
        location: "",
        email: "",
        phone: "",
    });

    const [socials, setSocials] = useState({
        instagram: "",
        linkedin: "",
        twitter: "",
    });

    const [about, setAbout] = useState("");
    const [mission, setMission] = useState("");
    const [vision, setVision] = useState("");
    const [ideology, setIdeology] = useState("");

    /* ---------------- LOAD SETTINGS ---------------- */
    useEffect(() => {
        const loadSettings = async () => {
            const start = Date.now();

            try {
                setLoading(true);

                const data = await getAdminSettings();

                setOrgName(data.orgName);
                setContact(data.contact);
                setSocials({
                    instagram: data.socials?.instagram ?? "",
                    linkedin: data.socials?.linkedin ?? "",
                    twitter: data.socials?.twitter ?? "",
                });
                setAbout(data.about ?? "");
                setMission(data.mission ?? "");
                setVision(data.vision ?? "");
                setIdeology(data.ideology ?? "");
            } catch {
                setToast({
                    show: true,
                    variant: "error",
                    title: "Error",
                    message: "Failed to load settings",
                });
            } finally {
                const elapsed = Date.now() - start;
                const MIN_LOADING_TIME = 500; // ms

                if (elapsed < MIN_LOADING_TIME) {
                    setTimeout(() => setLoading(false), MIN_LOADING_TIME - elapsed);
                } else {
                    setLoading(false);
                }
            }
        };

        loadSettings();
    }, []);


    /* ---------------- SAVE HANDLER ---------------- */
    const handleSave = async () => {
        try {
            setLoading(true);

            await updateAdminSettings({
                orgName,
                about,
                mission,
                vision,
                ideology,
                contact,
                socials,
            });
            setToast({
                show: true,
                variant: "success",
                title: "Saved",
                message: "Settings updated successfully",
            });
        } catch {
            setToast({
                show: true,
                variant: "error",
                title: "Error",
                message: "Failed to save settings",
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- STYLES ---------------- */
    const styles = `
    /* --- Glass Panel (Card Layout) --- */
    .glass-panel {
        background: rgba(31, 41, 55, 0.7);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        height: 100%; /* Ensures equal height in grid */
    }

    /* --- Input Styling --- */
    .form-control-glass {
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        color: white !important;
        border-radius: 8px;
        padding: 12px;
        transition: all 0.2s ease;
    }
    
    .form-control-glass:focus {
        background-color: rgba(0, 0, 0, 0.5) !important;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
    }

    .form-label {
        color: #9ca3af; 
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }

    /* --- Mobile Specifics --- */
    @media (max-width: 768px) {
        .mobile-offset {
            padding-top: 85px !important;
        }
        
        .save-btn-container {
            width: 100%;
            justify-content: center !important;
        }

        .save-btn {
            width: 100%;
        }
    }
    `;

    return (
        <AdminLayout
            active="Settings"
            loading={loading}
            toast={toast ?? undefined}
            onCloseToast={() => setToast(null)}
        >
            <style>{styles}</style>

            <div className="mobile-offset p-2 pb-5">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="fw-bold text-white mb-1 display-6" style={{ letterSpacing: '-1px' }}>Admin Settings</h1>
                    <p className="text-secondary">
                        Manage organization details and website information.
                    </p>
                </div>

                <div className="row g-4">
                    {/* ---------------- GENERAL ---------------- */}
                    <div className="col-12">
                        <div className="glass-panel p-4">
                            <h5 className="fw-bold text-white mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                                <i className="bi bi-building text-primary me-2"></i>
                                General Information
                            </h5>

                            {/* Organization Name */}
                            <div className="mb-4">
                                <label className="form-label">
                                    Organization Name
                                </label>
                                <input
                                    className="form-control form-control-glass"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                />
                            </div>

                            {/* ABOUT */}
                            <div className="mb-4">
                                <label className="form-label">
                                    About SIST ACM SIGAI
                                </label>
                                <textarea
                                    rows={6}
                                    className="form-control form-control-glass"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                />
                            </div>

                            <div className="row g-4">
                                <div className="col-12 col-md-6">
                                    <label className="form-label">
                                        Our Mission
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="form-control form-control-glass"
                                        value={mission}
                                        onChange={(e) => setMission(e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label">
                                        Our Vision
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="form-control form-control-glass"
                                        value={vision}
                                        onChange={(e) => setVision(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* IDEOLOGY */}
                            <div className="mt-4">
                                <label className="form-label">
                                    Our Ideology
                                </label>
                                <textarea
                                    rows={4}
                                    className="form-control form-control-glass"
                                    value={ideology}
                                    onChange={(e) => setIdeology(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>


                    {/* ---------------- CONTACT INFO ---------------- */}
                    <div className="col-12 col-lg-6">
                        <div className="glass-panel p-4">
                            <h5 className="fw-bold text-white mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                                <i className="bi bi-telephone-fill text-primary me-2"></i>
                                Contact Information
                            </h5>

                            <div className="mb-3">
                                <label className="form-label">Location</label>
                                <input
                                    className="form-control form-control-glass"
                                    value={contact.location}
                                    onChange={(e) =>
                                        setContact({ ...contact, location: e.target.value })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control form-control-glass"
                                    value={contact.email}
                                    onChange={(e) =>
                                        setContact({ ...contact, email: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="form-label">Phone</label>
                                <input
                                    className="form-control form-control-glass"
                                    value={contact.phone}
                                    onChange={(e) =>
                                        setContact({ ...contact, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---------------- SOCIAL LINKS ---------------- */}
                    <div className="col-12 col-lg-6">
                        <div className="glass-panel p-4">
                            <h5 className="fw-bold text-white mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                                <i className="bi bi-share-fill text-primary me-2"></i>
                                Social Media Links
                            </h5>

                            {[
                                { key: "instagram", label: "Instagram" },
                                { key: "linkedin", label: "LinkedIn" },
                                { key: "twitter", label: "Twitter / X" },
                            ].map((item) => (
                                <div className="mb-3" key={item.key}>
                                    <label className="form-label">{item.label}</label>
                                    <input
                                        className="form-control form-control-glass"
                                        value={(socials as any)[item.key]}
                                        onChange={(e) =>
                                            setSocials({
                                                ...socials,
                                                [item.key]: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SAVE BUTTON - Standard Positioning (Not Floating) */}
                <div className="d-flex justify-content-end align-items-center mt-4 pt-2 save-btn-container">
                    <button
                        className="btn save-btn px-5 py-3 fw-bold"
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                            color: "#ffffff",
                            border: "none",
                            boxShadow: "0 8px 20px rgba(59,130,246,0.45)",
                            borderRadius: "50px",
                            fontSize: "1rem"
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-save me-2"></i>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;