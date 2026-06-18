"use client";
import React from "react";
import { Button } from "./Button";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`text-center py-20 px-10 border-2 border-dashed border-error-text/30 rounded-md bg-error-bg ${className}`}>
      <span className="text-5xl inline-block mb-5">&#x26A0;</span>
      <h3 className="text-2xl font-heading text-heading mb-2.5">Error</h3>
      <p className="text-body text-base leading-relaxed mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try Again</Button>}
    </div>
  );
}
