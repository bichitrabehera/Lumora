"use client";
import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 h-11 rounded-md border border-border bg-white text-body text-base outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
