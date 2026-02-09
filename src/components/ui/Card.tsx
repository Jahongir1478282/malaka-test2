/** @format */

// ============================================
// CARD COMPONENT - Base UI Component
// ============================================

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const variantStyles = {
  default: "bg-white border border-slate-200",
  elevated: "bg-white shadow-xl shadow-slate-200/50 border border-slate-100",
  outlined: "bg-white/50 border-2 border-dashed border-slate-300",
  glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hover = false,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = "rounded-2xl transition-all duration-300";
    const hoverStyles = hover
      ? "hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hoverStyles}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
