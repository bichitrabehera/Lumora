import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const styles: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary border border-border",
  success: "bg-success-bg text-success-text border border-success-text/20",
  warning: "bg-warning-bg text-warning-text border border-warning-text/20",
  error: "bg-error-bg text-error-text border border-error-text/20",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
