import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* ---------------- ADMIN PAGES (Lazy-loaded) ---------------- */
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Members = lazy(() => import("./pages/Admin/Members"));
const EventManager = lazy(() => import("./pages/Admin/EventManager"));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const MobileScanner = lazy(() => import("./pages/Admin/MobileScanner"));

/* ---------------- WEBSITE PAGES (Lazy-loaded) ---------------- */
const Home = lazy(() => import("./pages/Website/Home"));
const About = lazy(() => import("./pages/Website/AboutUs"));
const Membership = lazy(() => import("./pages/Website/Membership"));
const OurRoots = lazy(() => import("./pages/Website/OurRoots"));
const JoinUs = lazy(() => import("./pages/Website/JoinUs"));
const Archives = lazy(() => import("./pages/Website/Archives"));
const Blogs = lazy(() => import("./pages/Website/Blogs"));
const Events = lazy(() => import("./pages/Website/Events"));
const ArchiveEventDetail = lazy(() => import("./pages/Website/ArchiveEventDetail"));
const NotFound = lazy(() => import("./pages/Website/NotFound"));

/* ---------------- COMPONENTS ---------------- */
import Nav from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import LogoLoading from "./components/LogoLoader";

/* ---------------- STYLES ---------------- */
import "./App.css";

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
    return (
      <Suspense fallback={<LogoLoading />}>
        <MobileScanner />
      </Suspense>
    );
  }

  const isAdminRoute = location.pathname.startsWith("/admin");

  /* ---------------- ADMIN ROUTES ---------------- */
  if (isAdminRoute) {
    return (
      <Suspense fallback={<LogoLoading />}>
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
      </Suspense>
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
            <Suspense fallback={<LogoLoading />}>
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
                <Route path="/archives/:eventId" element={<ArchiveEventDetail />} />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
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