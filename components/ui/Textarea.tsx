"use client";
import React, { forwardRef } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 rounded-md border border-border bg-white text-body text-base outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
