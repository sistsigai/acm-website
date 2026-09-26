import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* ---------------- ADMIN PAGES ---------------- */
import Dashboard from "./pages/Admin/Dashboard";
import Members from "./pages/Admin/Members";
import EventManager from "./pages/Admin/EventManager";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminLogin from "./pages/Admin/AdminLogin";
import MobileScanner from "./pages/Admin/MobileScanner";

/* ---------------- WEBSITE PAGES ---------------- */
import Home from "./pages/Website/Home";
import About from "./pages/Website/AboutUs";
import Membership from "./pages/Website/Membership";
import OurRoots from "./pages/Website/OurRoots";
import JoinUs from "./pages/Website/JoinUs";
import Archives from "./pages/Website/Archives";
import Blogs from "./pages/Website/Blogs";
import Events from "./pages/Website/Events";

/* ---------------- COMPONENTS ---------------- */
import Nav from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import LogoLoading from "./components/LogoLoader";

/* ---------------- STYLES ---------------- */
import "./App.css";

/* ---------------- OTHERS ---------------- */
const ArchiveEventDetail = lazy(() => import("./pages/Website/ArchiveEventDetail"));

function App() {
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);

  /* -------- SHOW LOADER ON EVERY ROUTE CHANGE -------- */
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isScannerRoute =
    location.pathname === "/scanner" ||
    location.pathname === "/scan" ||
    location.pathname === "/admin/scanner";

  /* ---------------- PUBLIC ATTENDANCE SCANNER ---------------- */
  if (isScannerRoute) {
    return <MobileScanner />;
  }

  const isAdminRoute = location.pathname.startsWith("/admin");

  /* ---------------- ADMIN ROUTES ---------------- */
  if (isAdminRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/eventmanager"
          element={
            <ProtectedRoute>
              <EventManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        {/* Admin Catch-All */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  /* ---------------- WEBSITE ROUTES ---------------- */
  return (
    <>
      <Nav />

      <AnimatePresence mode="wait">
        {loading ? (
          <LogoLoading />
        ) : (
          <motion.div
            key={location.pathname}
            className="main-contentapp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/our-roots" element={<OurRoots />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/events" element={<Events />} />

              {/* Dynamic Archive Event Route */}
              <Route
                path="/archives/:eventId"
                element={
                  <Suspense fallback={<LogoLoading />}>
                    <ArchiveEventDetail />
                  </Suspense>
                }
              />

              {/* Website Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- ROOT WRAPPER ---------------- */
function Root() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <App />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default Root;