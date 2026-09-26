import React, { useEffect, useState } from "react";
import { motion as m, type Variants } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import {
    getAdminSettings,
    updateAdminSettings,
} from "../../services/admin/settingsService";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

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
                setLoading(false);
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

    /* ---------------- PHONE NUMBER HELPERS ---------------- */
    const rawPhoneNumber = (contact.phone || "").replace(/^\+91\s*/, "").replace(/\D/g, "").slice(0, 10);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
        setContact((prev) => ({
            ...prev,
            phone: digits ? `+91 ${digits}` : "",
        }));
    };

    return (
        <AdminLayout
            active="Settings"
            loading={loading}
            toast={toast ?? undefined}
            onCloseToast={() => setToast(null)}
        >
            <m.div
                className="mobile-offset pb-4"
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
                        <h2 className="fw-bold text-white mb-1">Admin Settings</h2>
                        <p className="text-secondary m-0">
                            Manage organization details and website information
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary px-4 py-2 fw-semibold shadow-lg d-flex align-items-center gap-2"
                        onClick={handleSave}
                        disabled={loading}
                        style={{ borderRadius: "12px" }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-save-fill"></i>
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </m.div>

                <div className="row g-4">
                    {/* ---------------- GENERAL ---------------- */}
                    <m.div className="col-12" variants={itemVariants}>
                        <div className="glass-panel rounded-4 p-4">
                            <h5 className="fw-bold text-white mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                                <i className="bi bi-building text-primary me-2"></i>
                                General Information
                            </h5>

                            {/* Organization Name */}
                            <div className="mb-4">
                                <label className="form-label text-secondary small fw-medium">
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
                                <label className="form-label text-secondary small fw-medium">
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
                                    <label className="form-label text-secondary small fw-medium">
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
                                    <label className="form-label text-secondary small fw-medium">
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
                                <label className="form-label text-secondary small fw-medium">
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
                    </m.div>

                    {/* ---------------- CONTACT INFO ---------------- */}
                    <m.div className="col-12 col-lg-6" variants={itemVariants}>
                        <div className="glass-panel rounded-4 p-4 h-100">
                            <h5 className="fw-bold text-white mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                                <i className="bi bi-telephone-fill text-primary me-2"></i>
                                Contact Information
                            </h5>

                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-medium">Location</label>
                                <input
                                    className="form-control form-control-glass"
                                    value={contact.location}
                                    onChange={(e) =>
                                        setContact({ ...contact, location: e.target.value })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-medium">Email</label>
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
                                <label className="form-label text-secondary small fw-medium">Phone</label>
                                <div className="input-group phone-input-group">
                                    <span className="input-group-text phone-prefix-glass">+91</span>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="7799350212"
                                        className="form-control form-control-glass phone-input-glass"
                                        value={rawPhoneNumber}
                                        onChange={handlePhoneChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </m.div>

                    {/* ---------------- SOCIAL LINKS ---------------- */}
                    <m.div className="col-12 col-lg-6" variants={itemVariants}>
                        <div className="glass-panel rounded-4 p-4 h-100">
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
                                    <label className="form-label text-secondary small fw-medium">{item.label}</label>
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
                    </m.div>
                </div>

                {/* BOTTOM SAVE BUTTON */}
                <m.div className="d-flex justify-content-end align-items-center mt-4 pt-2" variants={itemVariants}>
                    <button
                        type="button"
                        className="btn btn-primary px-5 py-2.5 fw-semibold shadow-lg d-flex align-items-center gap-2"
                        onClick={handleSave}
                        disabled={loading}
                        style={{ borderRadius: "12px" }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-save-fill"></i>
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </m.div>
            </m.div>
        </AdminLayout>
    );
};

export default AdminSettings;