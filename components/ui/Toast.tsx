"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };

type ToastContextType = { addToast: (message: string, type?: ToastType) => void };

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() { return useContext(ToastContext); }

const iconMap: Record<ToastType, string> = {
  success: "\u2713",
  error: "\u2717",
  info: "i",
};

const styleMap: Record<ToastType, string> = {
  success: "bg-success-text border-success-text/20",
  error: "bg-error-text border-error-text/20",
  info: "bg-primary border-primary/20",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-modal flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-md text-white text-base font-medium border animate-[fadeInUp_0.3s_ease] ${styleMap[toast.type]}`}
          >
            <span className="text-lg font-bold leading-none">{iconMap[toast.type]}</span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
