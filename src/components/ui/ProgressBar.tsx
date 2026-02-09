/** @format */

// ============================================
// PROGRESS BAR COMPONENT - Base UI Component
// ============================================

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const variantStyles = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-500",
  success: "bg-gradient-to-r from-emerald-600 to-emerald-500",
  warning: "bg-gradient-to-r from-amber-500 to-amber-400",
  danger: "bg-gradient-to-r from-rose-600 to-rose-500",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      <div
        className={`w-full rounded-full bg-slate-200 overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`
            ${sizeStyles[size]} rounded-full transition-all duration-500 ease-out
            ${variantStyles[variant]}
            ${animated ? "animate-pulse-subtle" : ""}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-xs font-medium text-slate-600 text-right">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
}
