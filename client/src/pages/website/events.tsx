import React, { useEffect, useState } from "react";
import { motion as m, type Variants } from "framer-motion";
import {
  getAllEvents,
  submitEventRegistration,
  type EventRegistrationPayload,
} from "../../services/website/webeventService";
import { GlobalLoader } from "../../components/GlobalLoader";
import { FloatingOrb } from "../../components/StatusMessage";
import WebEventCard, { type ExtendedEventData } from "../../components/Website/Events/WebEventCard";
import WebEventDetailModal from "../../components/Website/Events/WebEventDetailModal";
import WebEventRegistrationModal from "../../components/Website/Events/WebEventRegistrationModal";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<ExtendedEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventData | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setGlobalLoading(true);
        const response = await getAllEvents();
        if (response?.success && Array.isArray(response.events)) {
          setEvents(response.events as ExtendedEventData[]);
        } else {
          setEvents([]);
        }
      } catch (err: any) {
        setError("Failed to load events");
        showToast("Failed to load events", "error");
      } finally {
        setGlobalLoading(false);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle registration submission
  const handleRegistrationSubmit = async (payload: EventRegistrationPayload) => {
    try {
      setIsSubmitting(true);
      setGlobalLoading(true);
      await submitEventRegistration(payload);
      showToast("Successfully registered for the event!", "success");
      setShowRegisterModal(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Registration failed";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-page">
        <h1 className="page-title">
          SIGAI <span className="highlight">EVENT</span>
        </h1>
        <div className="glitch-container">
          <div className="terminal-subtext">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="glitch-container">
          <div className="glitch-404">ERROR</div>
          <div className="error-msg">FAILED_TO_LOAD_EVENTS</div>
          <div className="terminal-subtext">
            <span>Please try refreshing the page</span>
            <span className="blink-cursor"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <GlobalLoader isLoading={globalLoading} />

      <FloatingOrb
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <m.h1
        className="page-title"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        SIGAI <span className="highlight">EVENTS</span>
      </m.h1>

      {events.length === 0 ? (
        <m.div className="glitch-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glitch-404">404</div>
          <div className="error-msg">EVENT_DATA_NOT_FOUND</div>
          <div className="terminal-subtext">
            <span>Stay Tuned for Events</span>
            <span className="blink-cursor"></span>
          </div>
        </m.div>
      ) : (
        <m.div
          className="events-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event) => (
            <WebEventCard
              key={event._id}
              event={event}
              onSelect={(ev) => setSelectedEvent(ev)}
            />
          ))}
        </m.div>
      )}

      {/* Details Split-View Modal */}
      <WebEventDetailModal
        selectedEvent={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegisterClick={() => setShowRegisterModal(true)}
      />

      {/* Registration Modal */}
      <WebEventRegistrationModal
        show={showRegisterModal}
        selectedEvent={selectedEvent}
        useDynamicForm={Boolean(selectedEvent?.customQuestions && selectedEvent.customQuestions.length > 0)}
        isSubmitting={isSubmitting}
        onClose={() => setShowRegisterModal(false)}
        onSubmit={handleRegistrationSubmit}
        showToast={showToast}
      />
    </div>
  );
};

export default Events;