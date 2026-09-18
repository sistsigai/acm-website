import React, { type FormEvent, useEffect, useState } from 'react';
import { motion as m, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane, FaExclamationCircle } from 'react-icons/fa';
import { submitContactForm, type ContactFormData } from '../services/website/Homeservice';

// Validation types
interface FormErrors {
  Firstname?: string;
  Lastname?: string;
  Email?: string;
  Mobile?: string;
  Message?: string;
}

interface FormTouched {
  Firstname?: boolean;
  Lastname?: boolean;
  Email?: boolean;
  Mobile?: boolean;
  Message?: boolean;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onLoading: (isLoading: boolean) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSuccess, onError, onLoading }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    Firstname: '',
    Lastname: '',
    Email: '',
    Mobile: '',
    Message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validateField = (name: keyof ContactFormData, value: string): string => {
    switch (name) {
      case 'Firstname':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (value.length > 50) return 'First name must be less than 50 characters';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'First name can only contain letters and spaces';
        return '';
      case 'Lastname':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (value.length > 50) return 'Last name must be less than 50 characters';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Last name can only contain letters and spaces';
        return '';
      case 'Email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        if (value.length > 100) return 'Email must be less than 100 characters';
        return '';
      case 'Mobile':
        if (!value.trim()) return 'Mobile number is required';
        if (!/^[0-9]{10}$/.test(value)) return 'Please enter a valid 10-digit mobile number';
        return '';
      case 'Message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        if (value.length > 1000) return 'Message must be less than 1000 characters';
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof ContactFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const fieldName = name as keyof ContactFormData;
    const error = validateField(fieldName, formData[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'Mobile') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (!touched[name as keyof FormTouched] && errors[name as keyof FormErrors]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const resetForm = () => {
    setFormData({
      Firstname: '',
      Lastname: '',
      Email: '',
      Mobile: '',
      Message: ''
    });
    setErrors({});
    setTouched({});
    setIsFormValid(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof FormTouched] = true;
      return acc;
    }, {} as FormTouched);
    setTouched(allTouched);

    if (!validateForm()) {
      onError("Please fix the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);
    onLoading(true);

    try {
      const result = await submitContactForm(formData);
      onSuccess(result.message || "Message sent successfully!");
      onClose();
    } catch (error: any) {
      console.error("Form submission error:", error);

      if (error?.errors && typeof error.errors === "object") {
        setErrors(error.errors);
        const touchedFields: FormTouched = {};
        Object.keys(error.errors).forEach((key) => {
          touchedFields[key as keyof FormTouched] = true;
        });
        setTouched(prev => ({ ...prev, ...touchedFields }));
        onError(error.message || "Please correct the highlighted fields.");
        return;
      }

      onError(error?.message || "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
      onLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          {/* Modal Scoped Styles */}
          <style>{`
            .modal-overlay {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(0, 0, 0, 0.7);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              display: flex; justify-content: center; 
              align-items: flex-start; /* Fixes alignment to ensure gap at top */
              padding: 100px 20px 40px 20px; /* 100px top padding guarantees gap under navbar */
              z-index: 10000;
              overflow-y: auto; /* Allows natural scrolling if modal is tall */
            }

            .modal-content-styled {
              background: linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(10, 15, 30, 0.95));
              padding: 50px 40px; width: 100%; max-width: 750px;
              border-radius: 24px; position: relative;
              border: 1px solid rgba(255, 255, 255, 0.08);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
              color: #fff; margin-bottom: 20px;
            }

            .close-modal {
              position: absolute; top: 24px; right: 24px;
              background: rgba(255,255,255,0.05); width: 40px; height: 40px;
              border-radius: 50%; border: none; font-size: 1.2rem;
              cursor: pointer; color: #a1a1aa;
              display: flex; align-items: center; justify-content: center;
              transition: all 0.3s ease; z-index: 10;
            }
            .close-modal:hover {
              background: rgba(239, 68, 68, 0.1); color: #ef4444; transform: rotate(90deg);
            }

            .modal-title {
              text-align: center; margin-bottom: 40px;
              font-size: 2.2rem; font-weight: 800; letter-spacing: 1px;
            }
            .hero-highlight {
              background: linear-gradient(135deg, #fff 0%, #3b82f6 100%);
              -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }

            .formBx {
              display: grid; grid-template-columns: 1fr 1fr; gap: 35px 25px; width: 100%;
            }
            .full-width { grid-column: span 2; }

            /* --- STRICT INPUT WRAPPER --- */
            .input-group {
              width: 100%; display: flex; flex-direction: column;
            }
            
            .input-field-container {
              position: relative; width: 100%; margin-top: 15px; /* Space for label floating */
            }

            .line-input {
              display: block; width: 100%; padding: 10px 0; font-size: 1rem; color: #fff;
              background: transparent; border: none;
              border-bottom: 2px solid rgba(255, 255, 255, 0.15);
              outline: none; transition: border-color 0.3s ease;
              font-family: inherit; border-radius: 0;
            }
            textarea.line-input {
              resize: none; min-height: 80px;
            }

            /* Floating Label Core */
            .line-label {
              position: absolute; top: 10px; left: 0; font-size: 1rem;
              color: rgba(255, 255, 255, 0.4); pointer-events: none;
              transition: 0.3s ease all; font-weight: 400;
            }

            /* Highlight Line Animation */
            .focus-border {
              position: absolute; bottom: 0; left: 50%; width: 0; height: 2px;
              background: #3b82f6; transition: all 0.4s ease; transform: translateX(-50%);
            }

            /* --- FOCUS & HAS-VALUE STATES --- */
            .line-input:focus ~ .focus-border, 
            .line-input.has-value ~ .focus-border {
              width: 100%;
            }
            
            .line-input:focus ~ .line-label, 
            .line-input.has-value ~ .line-label {
              top: -18px; font-size: 0.8rem; color: #3b82f6; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
            }

            /* --- ERROR STATES --- */
            .input-field-container.has-error .line-input {
              border-bottom-color: rgba(239, 68, 68, 0.3);
            }
            .input-field-container.has-error .focus-border {
              width: 100%; background: #ef4444;
            }
            .input-field-container.has-error .line-label {
              color: #ef4444;
            }

            /* Error Message completely decoupled from input border */
            .error-message {
              color: #ef4444; font-size: 0.8rem; margin-top: 8px;
              display: flex; align-items: center; gap: 5px;
              animation: fadeIn 0.3s ease;
            }
            .error-icon { font-size: 0.9rem; }

            .character-count {
              font-size: 0.75rem; color: rgba(255, 255, 255, 0.3);
            }
            .character-count.warning { color: #f59e0b; }
            .character-count.error { color: #ef4444; }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-5px); }
              to { opacity: 1; transform: translateY(0); }
            }

            /* --- SUBMIT BUTTON FIX --- */
            .submit-btn {
              background: linear-gradient(135deg, #2563eb, #3b82f6);
              color: #fff; padding: 16px; border: none; border-radius: 12px;
              font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
              cursor: pointer; width: 100%; margin-top: 20px;
              display: flex; justify-content: center; align-items: center; gap: 10px;
              transition: filter 0.3s ease, box-shadow 0.3s ease; /* Excluded transform to stop glitch */
              transform: translateZ(0); /* Hardware accelerate to stop subpixel text twitches */
              box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.5);
            }
            .submit-btn:hover:not(:disabled) {
              /* Replaced translateY with brightness to stop layout shifts on hover */
              filter: brightness(1.15); 
              box-shadow: 0 12px 25px -10px rgba(59, 130, 246, 0.8);
            }
            .submit-btn:disabled {
              opacity: 0.6; cursor: not-allowed; filter: grayscale(50%); box-shadow: none;
            }

            @media (max-width: 600px) {
              .formBx { grid-template-columns: 1fr; gap: 30px; }
              .full-width { grid-column: span 1; }
              .modal-content-styled { padding: 40px 20px; }
              .modal-title { font-size: 1.8rem; }
            }
          `}</style>

          <m.div
            className="modal-content-styled"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button type="button" className="close-modal" onClick={onClose}><FaTimes /></button>

            <h3 className="modal-title">
              Send <span className="hero-highlight">your Query</span>
            </h3>

            <form className="form" onSubmit={submitForm} noValidate>
              <div className='formBx'>
                
                {/* First Name */}
                <div className="input-group">
                  <div className={`input-field-container ${errors.Firstname && touched.Firstname ? 'has-error' : ''}`}>
                    <input
                      type='text'
                      name='Firstname'
                      className={`line-input ${formData.Firstname ? 'has-value' : ''}`}
                      value={formData.Firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      disabled={isSubmitting}
                      autoComplete='off'
                      maxLength={50}
                    />
                    <label className="line-label">First Name</label>
                    <span className="focus-border"></span>
                  </div>
                  {errors.Firstname && touched.Firstname && (
                    <div className="error-message">
                      <FaExclamationCircle className="error-icon" /> {errors.Firstname}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="input-group">
                  <div className={`input-field-container ${errors.Lastname && touched.Lastname ? 'has-error' : ''}`}>
                    <input
                      type='text'
                      name='Lastname'
                      className={`line-input ${formData.Lastname ? 'has-value' : ''}`}
                      value={formData.Lastname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete='off'
                      disabled={isSubmitting}
                      maxLength={50}
                    />
                    <label className="line-label">Last Name</label>
                    <span className="focus-border"></span>
                  </div>
                  {errors.Lastname && touched.Lastname && (
                    <div className="error-message">
                      <FaExclamationCircle className="error-icon" /> {errors.Lastname}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="input-group">
                  <div className={`input-field-container ${errors.Email && touched.Email ? 'has-error' : ''}`}>
                    <input
                      type='email'
                      name='Email'
                      className={`line-input ${formData.Email ? 'has-value' : ''}`}
                      value={formData.Email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete='off'
                      disabled={isSubmitting}
                      maxLength={100}
                    />
                    <label className="line-label">Email Address</label>
                    <span className="focus-border"></span>
                  </div>
                  {errors.Email && touched.Email && (
                    <div className="error-message">
                      <FaExclamationCircle className="error-icon" /> {errors.Email}
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div className="input-group">
                  <div className={`input-field-container ${errors.Mobile && touched.Mobile ? 'has-error' : ''}`}>
                    <input
                      type='tel'
                      name='Mobile'
                      className={`line-input ${formData.Mobile ? 'has-value' : ''}`}
                      value={formData.Mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      pattern="[0-9]{10}"
                      autoComplete='off'
                      inputMode="numeric"
                      required
                      disabled={isSubmitting}
                      maxLength={10}
                    />
                    <label className="line-label">Mobile Number</label>
                    <span className="focus-border"></span>
                  </div>
                  {errors.Mobile && touched.Mobile && (
                    <div className="error-message">
                      <FaExclamationCircle className="error-icon" /> {errors.Mobile}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="input-group full-width">
                  <div className={`input-field-container ${errors.Message && touched.Message ? 'has-error' : ''}`}>
                    <textarea
                      name='Message'
                      className={`line-input ${formData.Message ? 'has-value' : ''}`}
                      value={formData.Message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete='off'
                      required
                      disabled={isSubmitting}
                      maxLength={1000}
                    ></textarea>
                    <label className="line-label">Your Message</label>
                    <span className="focus-border"></span>
                  </div>
                  
                  {/* Clean row for error and character count under the textarea */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '8px' }}>
                    <div>
                      {errors.Message && touched.Message && (
                        <div className="error-message" style={{ marginTop: 0 }}>
                          <FaExclamationCircle className="error-icon" /> {errors.Message}
                        </div>
                      )}
                    </div>
                    <div className={`character-count ${formData.Message.length > 900 ? 'error' : formData.Message.length > 800 ? 'warning' : ''}`}>
                      {formData.Message.length}/1000
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className='input-group full-width'>
                  <button
                    type='submit'
                    className="submit-btn"
                    disabled={isSubmitting || (!isFormValid && Object.keys(touched).length > 0)}
                  >
                    {isSubmitting ? "TRANSMITTING..." : "Send Query"} <FaPaperPlane />
                  </button>
                </div>
              </div>
            </form>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;