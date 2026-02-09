/** @format */

// ============================================
// INPUT COMPONENT - Base UI Component
// ============================================

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className = "", ...props }, ref) => {
    const baseStyles =
      "w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-slate-400";

    const normalStyles =
      "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

    const errorStyles =
      "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-100";

    return (
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`
            ${baseStyles}
            ${error ? errorStyles : normalStyles}
            ${icon ? "pl-11" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
