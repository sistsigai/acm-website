import React, { useEffect, useState } from "react";
import { motion as m, type Variants } from "framer-motion";
import {
  getAllEvents,
  submitEventRegistration,
  type EventRegistrationPayload,
} from "../../services/website/webEventService";
import { GlobalLoader } from "../../components/GlobalLoader";
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
      } catch {
        setError("Failed to load events");
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
      setShowRegisterModal(false);
    } catch (err: any) {
      console.error("Registration failed", err);
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-page">
        <h1 className="text-gradient">
          SIGAI EVENTS
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

      <m.h1
        className="text-gradient"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        SIGAI EVENTS
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
      />
    </div>
  );
};

export default Events;