import React, { useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { archivesRegistry } from "../../data/archivesData";
import "./ArchiveEventDetail.css";

interface ArchiveEventDetailProps {
  eventId?: string;
}

const ArchiveEventDetail: React.FC<ArchiveEventDetailProps> = ({ eventId: propEventId }) => {
  const { eventId: paramEventId } = useParams<{ eventId: string }>();
  const activeSlug = (propEventId || paramEventId || "").toLowerCase();

  const eventConfig = useMemo(() => {
    if (!activeSlug) return null;
    // Direct match or lowercase match
    if (archivesRegistry[activeSlug]) {
      return archivesRegistry[activeSlug];
    }
    const foundKey = Object.keys(archivesRegistry).find(
      (k) => k.toLowerCase() === activeSlug
    );
    return foundKey ? archivesRegistry[foundKey] : null;
  }, [activeSlug]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSlug]);

  if (!eventConfig) {
    return <Navigate to="/archives" replace />;
  }

  const bgStyle: React.CSSProperties = eventConfig.bgImage
    ? {
        background: `linear-gradient(rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.88)), url(${eventConfig.bgImage})`,
      }
    : {
        background: "linear-gradient(rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.92))",
      };

  return (
    <div className="archive-detail-page" style={bgStyle}>
      {eventConfig.render()}
    </div>
  );
};

export default ArchiveEventDetail;
