import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion as m, AnimatePresence, type Variants } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaWhatsapp, FaUser, FaTimes, FaInfoCircle, FaClipboardCheck, FaPaperPlane, FaExclamationTriangle } from "react-icons/fa";
import { getAllEvents, submitEventRegistration, type EventData, type EventRegistrationPayload } from '../../services/website/webeventService';
import { GlobalLoader } from '../../components/GlobalLoader';
import { FloatingOrb } from '../../components/StatusMessage';

// --- TYPE EXTENSION ---
interface ExtendedEventData extends EventData {
    isClosed?: boolean | null;
}

// --- TYPES FOR VALIDATION ---
interface ValidationRule {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    custom?: (value: string) => boolean;
    errorMessage: string;
}
// --- VALIDATION RULES ---
const validationRules: Record<string, ValidationRule> = {
    'name': {
        required: true,
        minLength: 2,
        maxLength: 100,
        errorMessage: 'Name must be 2-100 characters'
    },
    'register': {
        pattern: /^\d{1,8}$/,
        required: true,
        errorMessage: 'Register number must be exactly 8 digits'
    },
    'year': {
        pattern: /^[1-4]$/,
        required: true,
        errorMessage: 'Year must be between 1-4'
    },
    'section': {
        pattern: /^[A-Z][1-9]$/,
        required: true,
        errorMessage: 'Section must be exactly one letter followed by one number (e.g. A1)'
    },
    'email': {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true,
        errorMessage: 'Enter a valid email address'
    },
    'phone': {
        pattern: /^\d{10}$/,
        required: true,
        errorMessage: 'Mobile number must be 10 digits'
    },
    'department': {
        required: true,
        minLength: 2,
        maxLength: 100,
        errorMessage: 'Department is required'
    }
};

// --- HELPER FUNCTIONS ---

/**
 * Enhanced date parsing with proper validation
 */
const parseEventDateTime = (dateStr: string, timeStr: string): Date | null => {
    try {
        // Parse date in YYYY-MM-DD format
        const dateParts = dateStr.split('-').map(Number);
        if (dateParts.length !== 3) {
            console.error('Invalid date format:', dateStr);
            return null;
        }

        const [year, month, day] = dateParts;

        // Validate date components
        if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
            console.error('Invalid date values:', { year, month, day });
            return null;
        }

        // Parse time with AM/PM
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!timeMatch) {
            console.error('Invalid time format:', timeStr);
            return null;
        }

        const [_, hoursStr, minutesStr, meridiem] = timeMatch;
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        // Validate time components
        if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
            console.error('Invalid time values:', { hours, minutes });
            return null;
        }

        // Convert 12-hour to 24-hour format
        if (meridiem.toUpperCase() === 'PM' && hours < 12) {
            hours += 12;
        }
        if (meridiem.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
        }

        // Create date in local timezone
        const date = new Date(year, month - 1, day, hours, minutes, 0);

        // Validate the date object
        if (isNaN(date.getTime())) {
            console.error('Invalid date object created');
            return null;
        }

        return date;
    } catch (error) {
        console.error('Error parsing date/time:', error);
        return null;
    }
};

/**
 * Calculate time left until target date
 */
const calculateInitialTimeLeft = (targetDate: Date) => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) return null;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
};

/**
 * Countdown Timer Component with proper cleanup
 */
const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState<string | null>(() => calculateInitialTimeLeft(targetDate));
    const [isClosed, setIsClosed] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setHasMounted(true);

        // Initial check
        const initialCheck = calculateInitialTimeLeft(targetDate);
        if (initialCheck === null) {
            setIsClosed(true);
            return;
        }

        setTimeLeft(initialCheck);

        // Set up interval
        intervalRef.current = window.setInterval(() => {
            const result = calculateInitialTimeLeft(targetDate);
            if (result === null) {
                setIsClosed(true);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            } else {
                setTimeLeft(result);
            }
        }, 1000);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [targetDate]);

    // Don't render on server to avoid hydration mismatch
    if (!hasMounted) {
        return (
            <div className="countdown-container">
                <span className="countdown-label">Registration closes in</span>
                <span className="countdown-timer">Loading...</span>
            </div>
        );
    }

    return (
        <div className="countdown-container">
            {isClosed ? (
                <span className="countdown-closed">Registration Closed</span>
            ) : (
                <>
                    <span className="countdown-label">Registration closes in</span>
                    <span className="countdown-timer">
                        {timeLeft || "00d 00h 00m 00s"}
                    </span>
                </>
            )}
        </div>
    );
};

/**
 * Input sanitization helper
 */
const sanitizeInput = (value: string, fieldType: string): string => {
    let sanitized = value.trim();

    switch (fieldType) {
        case 'name':
            // Remove excessive whitespace, allow letters, spaces, and basic punctuation
            sanitized = sanitized.replace(/\s+/g, ' ').replace(/[^a-zA-Z\s\-'.]/g, '');
            break;
        case 'email':
            sanitized = sanitized.toLowerCase().trim();
            break;
        case 'register':
        case 'phone':
            // Remove all non-digits
            sanitized = sanitized.replace(/\D/g, '');
            break;
        case 'section':
            sanitized = sanitized.toUpperCase().trim();
            break;
        case 'year':
            sanitized = sanitized.replace(/\D/g, ''); // Keep only digits
            break;
        case 'department':
            sanitized = sanitized.replace(/\s+/g, ' ').trim();
            break;
        default:
            // General sanitization for other fields
            sanitized = sanitized.replace(/\s+/g, ' ').trim();
            break;
    }

    return sanitized;
};

/**
 * Custom toast hook for better state management
 */
const useToast = () => {
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        type: "success" | "error";
    }>({
        visible: false,
        message: "",
        type: "success",
    });

    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        setToast({
            visible: true,
            message,
            type
        });

        // Auto-hide after 5 seconds
        const timer = window.setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, visible: false }));
    }, []);

    return { toast, showToast, hideToast };
};

const blockInvalidKeys = (
    e: React.KeyboardEvent<HTMLInputElement>,
    fieldType: string,
    currentValue: string
) => {
    const key = e.key;

    // Allow control keys
    if (
        key === "Backspace" ||
        key === "Delete" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "Tab"
    ) {
        return;
    }

    // REGISTER NUMBER → exactly 8 digits
    if (fieldType === "register") {
        if (!/^\d$/.test(key) || currentValue.length >= 8) {
            e.preventDefault();
        }
    }

    // PHONE NUMBER → exactly 10 digits
    if (fieldType === "phone") {
        if (!/^\d$/.test(key) || currentValue.length >= 10) {
            e.preventDefault();
        }
    }

    // SECTION → ONE letter + ONE digit
    if (fieldType === "section") {
        if (currentValue.length === 0 && !/^[a-zA-Z]$/.test(key)) {
            e.preventDefault();
        }
        if (currentValue.length === 1 && !/^\d$/.test(key)) {
            e.preventDefault();
        }
        if (currentValue.length >= 2) {
            e.preventDefault();
        }
    }

    // YEAR → ONLY ONE DIGIT (1–4)
    if (fieldType === "year") {
        if (!/^[1-4]$/.test(key) || currentValue.length >= 1) {
            e.preventDefault();
        }
    }
};


// --- STYLES (Enhanced with validation styles) ---
const styles = `
    :root {
        --primary-blue: #3b82f6;
        --primary-glow: rgba(59, 130, 246, 0.6);
        --neon-cyan: #06b6d4;
        --neon-glow: #00f0ff;
        --glass-bg: rgba(255, 255, 255, 0.03);
        --glass-border: rgba(255, 255, 255, 0.06);
        --whatsapp-green: #25D366;
        --dark-bg: #0b1121;
        --card-inner-bg: #111827;
        --glitch-red: #ff3333;
        --glitch-cyan: #00e5ff;
        --error-red: #ef4444;
        --success-green: #10b981;
    }

    .events-page {
        width: 100%;
        min-height: 100vh;
        background: var(--dark-bg);
        padding: 140px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: 'Poppins', sans-serif;
        position: relative;
        overflow-x: hidden;
    }

    /* --- TITLE --- */
    .page-title {
        font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; color: #fff;
        text-transform: uppercase; margin-bottom: 60px; text-align: center;
        letter-spacing: -2px; line-height: 1.1; z-index: 10;
    }
    .highlight {
        background: linear-gradient(135deg, #fff 30%, var(--primary-blue) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 25px var(--primary-glow));
    }

    /* --- GRID LAYOUT --- */
    .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 40px;
        width: 100%;
        max-width: 1400px;
        z-index: 2;
        padding-bottom: 50px;
    }

    /* --- CARD COMPONENT --- */
    .event-card {
        position: relative; background: transparent; border-radius: 20px;
        display: flex; flex-direction: column; justify-content: flex-start;
        padding: 3px; overflow: hidden; height: 100%; transition: transform 0.3s ease;
        z-index: 1;
        box-shadow: 0 10px 40px -10px rgba(0, 240, 255, 0.15), 0 0 20px rgba(59, 130, 246, 0.2);
    }
    .event-card:hover { transform: translateY(-10px); box-shadow: 0 20px 50px -10px rgba(0, 240, 255, 0.3), 0 0 30px rgba(59, 130, 246, 0.4); }

    .card-content-wrapper {
        background: var(--card-inner-bg); width: 100%; height: 100%; border-radius: 18px;
        padding: 25px; display: flex; flex-direction: column; position: relative; z-index: 2;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .event-card::before {
        content: ''; position: absolute; top: 50%; left: 50%; width: 250%; height: 250%;
        background: conic-gradient(transparent 0deg, transparent 270deg, var(--primary-blue) 300deg, var(--neon-glow) 360deg);
        transform: translate(-50%, -50%) rotate(0deg); z-index: 0; opacity: 1; 
        animation: border-spin 4s linear infinite;
    }
    @keyframes border-spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .card-title {
        font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1.2;
        margin-bottom: 20px; min-height: 3.9rem;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        transition: color 0.3s;
    }
    .event-card:hover .card-title { text-shadow: none; color: var(--neon-glow); }

    .card-meta { display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px; }
    .meta-item { display: flex; align-items: center; gap: 10px; color: #cbd5e1; font-size: 0.95rem; }
    .meta-icon { color: var(--primary-blue); min-width: 18px; }

    .countdown-container {
        background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 12px; padding: 12px; margin-top: auto; margin-bottom: 20px; text-align: center;
    }
    .countdown-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--primary-blue); font-weight: 700; display: block; }
    .countdown-timer { font-family: 'Courier New', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
    .countdown-closed { color: var(--error-red); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

    .btn-view-details {
        width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.05);
        color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
        font-weight: 600; font-size: 0.95rem; cursor: pointer;
        display: flex; align-items: center; justify-content: center; gap: 10px;
        transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;
    }
    .btn-view-details:hover { background: var(--primary-blue); border-color: var(--primary-blue); box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }

    /* --- EVENT DETAILS POPUP (Split View) --- */
    .modal-backdrop {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 100;
        display: flex; align-items: flex-start; justify-content: center;
        padding-top: 120px; padding-bottom: 40px; padding-left: 20px; padding-right: 20px;
    }

    .modal-content {
        width: 100%; max-width: 1200px;
        height: 80vh;
        background: #0f172a; border: 1px solid rgba(59, 130, 246, 0.3);
        border-top: 4px solid var(--primary-blue); border-radius: 20px;
        display: flex; flex-direction: column; position: relative; 
        box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.9); overflow: hidden;
    }

    .modal-close-btn {
        position: absolute; top: 20px; right: 25px;
        background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
        color: #94a3b8; width: 36px; height: 36px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: 0.3s; z-index: 20;
    }
    .modal-close-btn:hover { background: #ef4444; border-color: #ef4444; color: white; transform: rotate(90deg); }

    /* --- SPLIT BODY LAYOUT --- */
    .modal-body { display: flex; flex: 1; overflow: hidden; }
    .modal-left-pane { width: 35%; background: rgba(0, 0, 0, 0.2); border-right: 1px solid rgba(255, 255, 255, 0.05); padding: 40px 30px; display: flex; flex-direction: column; justify-content: center; overflow-y: auto; }
    .modal-right-pane { width: 65%; padding: 40px; overflow-y: auto; display: flex; flex-direction: column; }

    .modal-title { font-size: 2rem; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 30px; }
    .modal-grid-vertical { display: flex; flex-direction: column; gap: 20px; }
    .modal-meta-item { 
        background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2);
        padding: 15px; border-radius: 12px; display: flex; flex-direction: column; gap: 5px;
    }
    .modal-meta-label { font-size: 0.75rem; color: var(--primary-blue); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
    .modal-meta-value { font-size: 1rem; color: #fff; display: flex; align-items: center; gap: 10px; font-weight: 500;}
    .modal-section-title {
        font-size: 1rem; color: var(--neon-cyan); text-transform: uppercase; letter-spacing: 2px;
        margin: 0 0 15px 0; font-weight: 700; display: block; border-bottom: 1px solid rgba(6, 182, 212, 0.3); padding-bottom: 10px; width: 100%;
    }
    .modal-section { margin-bottom: 35px; }
    .modal-desc { color: #cbd5e1; line-height: 1.8; font-size: 1.05rem; white-space: pre-wrap; }
    .modal-info-box { 
        background: rgba(255,255,255,0.02); padding: 20px; border-radius: 16px; 
        display: flex; flex-wrap: wrap; gap: 30px; border: 1px solid rgba(255,255,255,0.05);
    }
    .contact-item { font-size: 1rem; color: #fff; display: flex; align-items: center; gap: 12px; }

    /* FOOTER */
    .modal-footer {
        padding: 20px 40px; background: #0b1121; border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex; justify-content: flex-end; align-items: center; gap: 20px; flex-shrink: 0;
    }

    .btn-register {
        padding: 16px 35px; border-radius: 12px; font-weight: 700; font-size: 1rem;
        display: flex; align-items: center; justify-content: center; gap: 12px;
        background: var(--primary-blue); color: #fff; border: none; cursor: pointer; transition: all 0.3s ease;
        text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
    }
    .btn-register:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.6); }
    .btn-register.disabled { background: rgba(148, 163, 184, 0.1); color: #64748b; cursor: not-allowed; box-shadow: none; border: 1px solid rgba(148, 163, 184, 0.2); }
    .btn-register.disabled:hover { transform: none; box-shadow: none; }

    .btn-whatsapp-modal {
        padding: 16px 35px; border-radius: 12px; font-weight: 700; text-decoration: none;
        display: flex; align-items: center; justify-content: center; gap: 12px;
        background: transparent; border: 1px solid var(--whatsapp-green); color: var(--whatsapp-green);
        transition: all 0.3s ease; font-size: 1rem;
    }
    .btn-whatsapp-modal:hover { background: rgba(37, 211, 102, 0.1); transform: translateY(-2px); box-shadow: 0 0 20px rgba(37, 211, 102, 0.2); }

    /* RESPONSIVE STACKING */
    @media (max-width: 900px) {
        .modal-body { flex-direction: column; overflow: visible; }
        .modal-left-pane { width: 100%; height: auto; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 30px; }
        .modal-right-pane { width: 100%; height: auto; padding: 30px; overflow-y: visible; }
        .modal-footer { padding: 20px; flex-direction: column-reverse; position: static; }
        .btn-register, .btn-whatsapp-modal { width: 100%; }
        .modal-title { font-size: 1.8rem; }
        .modal-content {
            height: auto;
            max-height: calc(100vh - 140px);
            overflow-y: auto;
        }
    }

    /* SCROLLBAR HIDING */
    .modal-left-pane::-webkit-scrollbar, .modal-right-pane::-webkit-scrollbar, .reg-modal-content::-webkit-scrollbar { display: none; }
    .modal-left-pane, .modal-right-pane, .reg-modal-content { scrollbar-width: none; -ms-overflow-style: none; }

    /* --- REGISTRATION POPUP --- */
    .reg-modal-backdrop {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(5px); z-index: 200; 
        display: flex; align-items: flex-start; justify-content: center;
        padding-top: 120px; 
        padding-bottom: 40px; 
    }
    .reg-modal-content {
        width: 100%; max-width: 600px; background: #111827; border: 1px solid var(--neon-cyan);
        border-radius: 20px; padding: 40px; box-shadow: 0 0 50px rgba(6, 182, 212, 0.3);
        position: relative; 
        max-height: calc(100vh - 160px); 
        overflow-y: auto;
    }
    .reg-title { font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 30px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
    .reg-form-group { margin-bottom: 20px; }
    .reg-label { display: block; color: #94a3b8; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600; }
    .reg-input {
        width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px; color: #fff; font-size: 1rem; transition: 0.3s;
    }
    .reg-input:focus { 
        outline: none; 
        border-color: var(--neon-cyan); 
        box-shadow: 0 0 15px rgba(6, 182, 212, 0.2); 
        background: rgba(6, 182, 212, 0.05); 
    }
    .reg-input-error {
        border-color: var(--error-red) !important;
        background: rgba(239, 68, 68, 0.05) !important;
    }
    .reg-input-error:focus {
        border-color: var(--error-red) !important;
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.2) !important;
    }
    
    .reg-error-message {
        color: var(--error-red);
        font-size: 0.8rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .btn-submit-reg {
        width: 100%; padding: 15px; margin-top: 20px; background: linear-gradient(135deg, var(--neon-cyan), var(--primary-blue));
        border: none; border-radius: 12px; color: #fff; font-weight: 700; font-size: 1.1rem;
        cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px;
        display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .btn-submit-reg:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(6, 182, 212, 0.4); }
    .btn-submit-reg:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    /* --- 404 & GLITCH (Preserved) --- */
.glitch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  width: 100%;
  position: relative;
  perspective: 1000px;
  margin-top: 40px;
}


    .scanline-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2)); background-size: 100% 4px; pointer-events: none; z-index: 1; mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); }
    .glitch-404 { font-size: clamp(6rem, 15vw, 10rem); font-weight: 900; color: #fff; position: relative; letter-spacing: -5px; line-height: 0.8; text-shadow: 4px 4px 0px rgba(0,0,0,0.5); }
    .glitch-404::before, .glitch-404::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--dark-bg); opacity: 0.8; }
    .glitch-404::before { color: var(--glitch-red); z-index: -1; animation: glitch-split-1 2.5s infinite linear alternate-reverse; }
    .glitch-404::after { color: var(--glitch-cyan); z-index: -2; animation: glitch-split-2 3s infinite linear alternate-reverse; }
    @keyframes glitch-split-1 { 0% { clip-path: inset(20% 0 80% 0); transform: translate(-4px, 2px); } 20% { clip-path: inset(60% 0 10% 0); transform: translate(4px, -2px); } 40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 4px); } 60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -4px); } 80% { clip-path: inset(10% 0 60% 0); transform: translate(-2px, 2px); } 100% { clip-path: inset(30% 0 30% 0); transform: translate(2px, -2px); } }
    @keyframes glitch-split-2 { 0% { clip-path: inset(10% 0 60% 0); transform: translate(4px, -2px); } 20% { clip-path: inset(30% 0 20% 0); transform: translate(-4px, 2px); } 40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -4px); } 60% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 4px); } 80% { clip-path: inset(50% 0 30% 0); transform: translate(4px, -2px); } 100% { clip-path: inset(5% 0 80% 0); transform: translate(-4px, 2px); } }
    .error-msg { font-family: 'Courier New', monospace; text-transform: uppercase; color: var(--primary-blue); letter-spacing: 4px; font-weight: 700; font-size: 1.2rem; margin-top: 20px; background: rgba(59, 130, 246, 0.1); padding: 5px 15px; border: 1px solid rgba(59, 130, 246, 0.3); }
    .terminal-subtext { margin-top: 15px; font-family: 'Courier New', monospace; color: #94a3b8; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; opacity: 0.8; }
    .blink-cursor { display: inline-block; width: 8px; height: 16px; background: var(--glitch-cyan); animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }

    /* Accessibility improvements */
    .modal-content:focus {
        outline: 2px solid var(--primary-blue);
        outline-offset: 2px;
    }
    
    /* Improved mobile modal */
    @media (max-width: 900px) {
        .modal-content {
            height: 90vh;
            max-height: 90vh;
            margin: 20px;
        }
        
        .reg-modal-content {
            max-height: 85vh;
            margin: 20px;
            padding: 25px;
        }
    }
`;

// --- MAIN COMPONENT ---
const Events: React.FC = () => {
    const [events, setEvents] = useState<ExtendedEventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<ExtendedEventData | null>(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [globalLoading, setGlobalLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use custom toast hook
    const { toast, showToast, hideToast } = useToast();

    // Fetch events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setGlobalLoading(true);
                const response = await getAllEvents();

                if (response?.success && Array.isArray(response.events)) {
                    setEvents(response.events as ExtendedEventData[]);
                } else {
                    setEvents([]);
                    showToast("No events found", "error");
                }
            } catch (err) {
                setError("Failed to load events");
                showToast("Failed to load events", "error");
            } finally {
                setGlobalLoading(false);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [showToast]);

    // Handle body overflow for modals with proper cleanup
    useEffect(() => {
        const shouldLockBody = loading || (!loading && events.length === 0) ||
            selectedEvent || showRegisterModal;

        if (shouldLockBody) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalOverflow || 'auto';
            };
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            // Cleanup on unmount
            document.body.style.overflow = 'auto';
        };
    }, [loading, events.length, selectedEvent, showRegisterModal]);

    // Field validation helper
    const validateField = (fieldName: string, value: string): string => {
        const lowerField = fieldName.toLowerCase();
        let rule: ValidationRule | undefined;

        // Find matching rule
        Object.entries(validationRules).forEach(([key, valRule]) => {
            if (lowerField.includes(key)) {
                rule = valRule;
            }
        });

        if (!rule) {
            // No specific rule, just check if required
            if (!value.trim() && /required/i.test(fieldName)) {
                return 'This field is required';
            }
            return '';
        }

        // Check required
        if (rule.required && !value.trim()) {
            return rule.errorMessage;
        }

        // Check pattern
        if (rule.pattern && value.trim() && !rule.pattern.test(value.trim())) {
            return rule.errorMessage;
        }

        // Check length
        if (rule.minLength && value.trim().length < rule.minLength) {
            return rule.errorMessage;
        }

        if (rule.maxLength && value.trim().length > rule.maxLength) {
            return rule.errorMessage;
        }

        // Custom validation
        if (rule.custom && !rule.custom(value.trim())) {
            return rule.errorMessage;
        }

        return '';
    };

    // Handle registration button click
    const handleRegisterClick = () => {
        if (selectedEvent && selectedEvent.registrationQuestions) {
            const initialData: Record<string, string> = {};
            selectedEvent.registrationQuestions.forEach(q => initialData[q] = '');
            setFormData(initialData);
            setFormErrors({});
            setTouchedFields(new Set());
            setShowRegisterModal(true);
        }
    };

    // Enhanced input change handler with sanitization
    const handleInputChange = (question: string, value: string) => {
        // Determine field type for sanitization
        const lowerQuestion = question.toLowerCase();
        let fieldType = 'text';
        if (lowerQuestion.includes('email')) fieldType = 'email';
        else if (lowerQuestion.includes('phone') || lowerQuestion.includes('mobile')) fieldType = 'phone';
        else if (lowerQuestion.includes('reg')) fieldType = 'register';
        else if (lowerQuestion.includes('section')) fieldType = 'section';
        else if (lowerQuestion.includes('year')) fieldType = 'year';
        else if (lowerQuestion.includes('name')) fieldType = 'name';
        else if (lowerQuestion.includes('department') || lowerQuestion.includes('dept')) fieldType = 'department';

        // Sanitize input
        const sanitizedValue = sanitizeInput(value, fieldType);

        // Update form data
        setFormData(prev => ({ ...prev, [question]: sanitizedValue }));

        // Validate if field has been touched
        if (touchedFields.has(question)) {
            const error = validateField(question, sanitizedValue);
            setFormErrors(prev => ({
                ...prev,
                [question]: error
            }));
        }
    };

    // Handle blur for validation
    const handleBlur = (question: string) => {
        setTouchedFields(prev => new Set(prev).add(question));

        const value = formData[question] || '';
        const error = validateField(question, value);
        setFormErrors(prev => ({
            ...prev,
            [question]: error
        }));
    };

    // Form validation
    const validateForm = (): boolean => {
        if (!selectedEvent?.registrationQuestions) return false;

        const errors: Record<string, string> = {};
        let isValid = true;

        selectedEvent.registrationQuestions.forEach(question => {
            const value = formData[question] || '';
            const error = validateField(question, value);
            if (error) {
                errors[question] = error;
                isValid = false;
            }
        });

        setFormErrors(errors);
        setTouchedFields(prev => {
            const newSet = new Set(prev);
            selectedEvent.registrationQuestions.forEach(q => newSet.add(q));
            return newSet;
        });

        return isValid;
    };

    // Handle form submission
    const handleSubmitRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEvent) return;

        // Validate form
        if (!validateForm()) {
            showToast("Please fix the errors in the form", "error");
            return;
        }

        try {
            setIsSubmitting(true);
            setGlobalLoading(true);

            // Construct payload matching EventRegistrationPayload type
            const payload: EventRegistrationPayload = {
                eventId: selectedEvent._id,
                name: formData["Name"] || formData["Full Name"] || "",
                registerNo: formData["Register Number"] || formData["Register No"] || "",
                dept: formData["Department"] || formData["Dept"] || "", // Empty string instead of undefined
                year: formData["Year"] || "",
                section: formData["Section"] || "",
                email: formData["Email"] || formData["Email ID"] || "",
                phone: formData["Mobile Number"] || formData["Phone"] || "",
                // Only NON-core questions go here
                answers: Object.fromEntries(
                    Object.entries(formData).filter(
                        ([key]) =>
                            ![
                                "Name",
                                "Full Name",
                                "Register Number",
                                "Register No",
                                "Department",
                                "Dept",
                                "Year",
                                "Section",
                                "Email",
                                "Email ID",
                                "Mobile Number",
                                "Phone",
                            ].includes(key)
                    )
                ),
            };

            // Validate required fields
            if (!payload.name || !payload.registerNo || !payload.email || !payload.phone) {
                throw new Error("Please fill all required fields");
            }

            await submitEventRegistration(payload);

            showToast("Successfully registered for the event!", "success");

            setShowRegisterModal(false);
            setFormData({});
            setFormErrors({});
            setTouchedFields(new Set());
        } catch (error: any) {
            // Axios backend error
            if (error?.response?.data) {
                const backendMessage = error.response.data.message;
                const backendErrors = error.response.data.errors;

                // Show main error toast
                showToast(backendMessage || "Registration failed", "error");

                // If backend sent field-level errors
                if (backendErrors && typeof backendErrors === "object") {
                    const mappedErrors: Record<string, string> = {};

                    Object.entries(backendErrors).forEach(([backendKey, msg]) => {
                        // Match backend field → frontend question
                        const matchedQuestion = Object.keys(formData).find(q =>
                            q.toLowerCase().includes(backendKey.toLowerCase())
                        );

                        if (matchedQuestion) {
                            mappedErrors[matchedQuestion] = msg as string;
                        }
                    });

                    // Inject backend errors into form
                    setFormErrors(prev => ({ ...prev, ...mappedErrors }));

                    // Mark those fields as touched
                    setTouchedFields(prev => {
                        const newSet = new Set(prev);
                        Object.keys(mappedErrors).forEach(q => newSet.add(q));
                        return newSet;
                    });
                }
            } else {
                showToast(error.message || "Registration failed. Please try again.", "error");
            }
        }
        finally {
            setIsSubmitting(false);
            setGlobalLoading(false);
        }
    };

    // Render registration form with validation
    const renderRegistrationForm = () => {
        if (!selectedEvent?.registrationQuestions) return null;

        return (
            <form
                onSubmit={handleSubmitRegistration}
                noValidate
                autoComplete="off"
            >
                {selectedEvent.registrationQuestions.map((question, idx) => {
                    const error = formErrors[question];
                    const isTouched = touchedFields.has(question);
                    const shouldShowError = isTouched && error;
                    const isRequired = Object.keys(validationRules).some(key =>
                        question.toLowerCase().includes(key) && validationRules[key].required
                    );

                    return (
                        <div key={idx} className="reg-form-group">
                            <label className="reg-label" htmlFor={`field-${idx}`}>
                                {question}
                                {isRequired && ' *'}
                            </label>
                            <input
                                id={`field-${idx}`}
                                type="text"
                                className={`reg-input ${shouldShowError ? 'reg-input-error' : ''}`}
                                value={formData[question] || ''}
                                onChange={(e) => handleInputChange(question, e.target.value)}
                                onBlur={() => handleBlur(question)}
                                onKeyDown={(e) => {
                                    const q = question.toLowerCase();

                                    if (q.includes("reg")) {
                                        blockInvalidKeys(e, "register", formData[question] || "");
                                    } else if (q.includes("phone") || q.includes("mobile")) {
                                        blockInvalidKeys(e, "phone", formData[question] || "");
                                    } else if (q.includes("section")) {
                                        blockInvalidKeys(e, "section", formData[question] || "");
                                    } else if (q.includes("year")) {
                                        blockInvalidKeys(e, "year", formData[question] || "");
                                    }
                                }}
                                inputMode={
                                    question.toLowerCase().includes("phone") ||
                                        question.toLowerCase().includes("reg")
                                        ? "numeric"
                                        : "text"
                                }
                                maxLength={
                                    question.toLowerCase().includes("reg")
                                        ? 8
                                        : question.toLowerCase().includes("phone")
                                            ? 10
                                            : question.toLowerCase().includes("section")
                                                ? 2
                                                : undefined
                                }
                            />
                            {shouldShowError && (
                                <div id={`error-${idx}`} className="reg-error-message" role="alert">
                                    <FaExclamationTriangle size={12} />
                                    {error}
                                </div>
                            )}
                        </div>
                    );
                })}
                <button
                    type="submit"
                    className="btn-submit-reg"
                    disabled={isSubmitting || globalLoading}
                >
                    <FaPaperPlane />
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
            </form>
        );
    };

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    // Loading state
    if (loading) {
        return (
            <div className="events-page">
                <style>{styles}</style>
                <m.h1 className="page-title">
                    SIGAI <span className="highlight">EVENT'S HUB</span>
                </m.h1>
                <div className="glitch-container">
                    <div className="terminal-subtext">Loading events...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="events-page">
                <style>{styles}</style>
                <div className="glitch-container">
                    <m.div className="glitch-404" data-text="ERROR">ERROR</m.div>
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

            <style>{styles}</style>

            {events.length > 0 && (
                <m.h1
                    className="page-title"
                    initial={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    SIGAI <span className="highlight">EVENT'S HUB</span>
                </m.h1>
            )}


            {!loading && events.length === 0 ? (
                <m.div className="glitch-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="scanline-overlay"></div>
                    <m.div className="glitch-404" data-text="404">404</m.div>
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
                    {events.map((event, index) => {
                        const eventDateObj = parseEventDateTime(event.date, event.time);
                        return (
                            <m.div key={index} className="event-card" variants={cardVariants}>
                                <div className="card-content-wrapper">
                                    <h2 className="card-title">{event.name}</h2>
                                    <div className="card-meta">
                                        <div className="meta-item">
                                            <FaCalendarAlt className="meta-icon" />
                                            {event.date}
                                        </div>
                                        <div className="meta-item">
                                            <FaClock className="meta-icon" />
                                            {event.time}
                                        </div>
                                        <div className="meta-item">
                                            <FaMapMarkerAlt className="meta-icon" />
                                            {event.venue}
                                        </div>
                                    </div>
                                    {eventDateObj && <CountdownTimer targetDate={eventDateObj} />}
                                    <button
                                        className="btn-view-details"
                                        onClick={() => setSelectedEvent(event)}
                                        aria-label={`View details for ${event.name}`}
                                    >
                                        <FaInfoCircle /> View Details
                                    </button>
                                </div>
                            </m.div>
                        );
                    })}
                </m.div>
            )}

            {/* --- EVENT DETAILS MODAL (Split View) --- */}
            <AnimatePresence>
                {selectedEvent && (
                    <m.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedEvent(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <m.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close-btn"
                                onClick={() => setSelectedEvent(null)}
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>

                            <div className="modal-body">
                                {/* LEFT PANE: Header Info */}
                                <div className="modal-left-pane">
                                    <h2 id="modal-title" className="modal-title">
                                        {selectedEvent.name}
                                    </h2>
                                    <div className="modal-grid-vertical">
                                        <div className="modal-meta-item">
                                            <span className="modal-meta-label">Date</span>
                                            <span className="modal-meta-value">
                                                <FaCalendarAlt color="#3b82f6" />
                                                {selectedEvent.date}
                                            </span>
                                        </div>
                                        <div className="modal-meta-item">
                                            <span className="modal-meta-label">Time</span>
                                            <span className="modal-meta-value">
                                                <FaClock color="#3b82f6" />
                                                {selectedEvent.time}
                                            </span>
                                        </div>
                                        <div className="modal-meta-item">
                                            <span className="modal-meta-label">Venue</span>
                                            <span className="modal-meta-value">
                                                <FaMapMarkerAlt color="#3b82f6" />
                                                {selectedEvent.venue}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT PANE: Details */}
                                <div className="modal-right-pane">
                                    <div className="modal-section">
                                        <span className="modal-section-title">About Event</span>
                                        <p className="modal-desc">{selectedEvent.description}</p>
                                    </div>

                                    {selectedEvent.contactPersons && selectedEvent.contactPersons.length > 0 && (
                                        <div className="modal-section">
                                            <span className="modal-section-title">Coordinators</span>
                                            <div className="modal-info-box">
                                                {selectedEvent.contactPersons.map((person, idx) => (
                                                    <div key={idx} className="contact-item">
                                                        <FaUser size={14} color="#3b82f6" />
                                                        <span>{person.name} {person.phone ? `(${person.phone})` : ''}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FIXED FOOTER */}
                            <div className="modal-footer">
                                {selectedEvent.whatsappGroupLink && (
                                    <a
                                        href={selectedEvent.whatsappGroupLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp-modal"
                                        aria-label="Join WhatsApp group"
                                    >
                                        <FaWhatsapp size={22} /> Join Group
                                    </a>
                                )}
                                {(() => {
                                    const eventDate = parseEventDateTime(selectedEvent.date, selectedEvent.time);
                                    const isClosed = (selectedEvent.isClosed ?? false) ||
                                        (!!eventDate && new Date() > eventDate);

                                    return (
                                        <button
                                            className={`btn-register ${isClosed ? 'disabled' : ''}`}
                                            onClick={isClosed ? undefined : handleRegisterClick}
                                            disabled={isClosed}
                                            aria-label={isClosed ? "Registration closed" : "Register for event"}
                                        >
                                            {isClosed ? <FaTimes size={18} /> : <FaClipboardCheck size={20} />}
                                            {isClosed ? "Registration Closed" : "Register Now"}
                                        </button>
                                    );
                                })()}
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* --- REGISTRATION MODAL --- */}
            <AnimatePresence>
                {showRegisterModal && selectedEvent && (
                    <m.div
                        className="reg-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reg-title"
                    >
                        <m.div
                            className="reg-modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <button
                                className="modal-close-btn"
                                onClick={() => setShowRegisterModal(false)}
                                aria-label="Close registration form"
                            >
                                <FaTimes />
                            </button>
                            <h2 id="reg-title" className="reg-title">Event Registration</h2>
                            {renderRegistrationForm()}
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;