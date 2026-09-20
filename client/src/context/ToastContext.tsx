import React, { createContext, useContext, useState, useCallback } from "react";
import Message from "../components/Message";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  title?: string;
  duration?: number;
}

interface ToastState {
  show: boolean;
  message: string;
  variant: ToastVariant;
  title?: string;
}

interface ToastContextType {
  showToast: (options: ToastOptions | string, variant?: ToastVariant) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    variant: "info",
  });

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const showToast = useCallback((options: ToastOptions | string, variant: ToastVariant = "info") => {
    if (typeof options === "string") {
      setToast({
        show: true,
        message: options,
        variant,
      });
    } else {
      setToast({
        show: true,
        message: options.message,
        variant: options.variant || "info",
        title: options.title,
      });
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.show && (
        <Message
          show={toast.show}
          variant={toast.variant}
          title={toast.title}
          onClose={hideToast}
        >
          {toast.message}
        </Message>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
