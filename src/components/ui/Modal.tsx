/** @format */

// ============================================
// MODAL COMPONENT - Base UI Component
// ============================================

"use client";

import { useEffect, useRef, HTMLAttributes } from "react";
import { useLockBodyScroll } from "../../hooks";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "right";
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-6xl",
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  position = "center",
  children,
  className = "",
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  // Close on escape key
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const isDrawer = position === "right";

  return (
    <div
      className={`
        fixed inset-0 z-50 flex
        ${isDrawer ? "items-stretch justify-end" : "items-center justify-center p-4"}
      `}
    >
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${isDrawer ? "bg-slate-900/40" : "bg-slate-900/60 backdrop-blur-sm"}
        `}
        onClick={onClose}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className={`
          relative flex flex-col bg-white shadow-2xl
          ${
            isDrawer
              ? "h-full w-full max-w-xl animate-slide-in-right border-l border-slate-200"
              : `w-full ${sizeStyles[size]} animate-scale-in rounded-2xl max-h-[90vh]`
          }
          ${className}
        `}
      >
        {/* Header */}
        {(title || subtitle) && (
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              {title && (
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
              aria-label="Yopish"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
