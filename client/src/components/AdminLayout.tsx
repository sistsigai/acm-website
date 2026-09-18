import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";

interface AdminLayoutProps {
    active: string;
    loading?: boolean;
    toast?: {
        show: boolean;
        variant: "success" | "error" | "info" | "warning";
        message: string;
        title?: string;
    };
    onCloseToast?: () => void;
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    active,
    loading = false,
    toast,
    onCloseToast,
    children,
}) => {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex vh-100"
            style={{
                background: "#111827",
                color: "#e5e7eb",
                overflow: "visible",
            }}
        >
            {/* Sidebar */}
            <Sidebar
                active={active}
                onLogout={() => navigate("/admin/login")}
            />

            {/* Loader (global) */}
            <Loader
                loading={loading}
                variant="orbit"
                fullscreen
                theme="dark"
            />

            {/* Message / Toast (global) */}
            {toast && (
                <Message
                    show={toast.show}
                    variant={toast.variant}
                    title={toast.title}
                    onClose={onCloseToast}
                >
                    {toast.message}
                </Message>
            )}

            {/* Page Content */}
            <div
                className="flex-grow-1 p-4 p-md-5"
                style={{ overflowY: "auto" }}
            >
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
