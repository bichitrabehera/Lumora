"use client";
import React, { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-4 h-11 rounded-md border border-border bg-white text-body text-base outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
