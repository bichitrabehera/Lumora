import React from "react";
import Link from "next/link";
import { Button } from "./Button";

type EmptyStateProps = {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  const btn = actionLabel ? (
    actionHref ? (
      <Button as="a" href={actionHref}>{actionLabel}</Button>
    ) : (
      <Button onClick={onAction}>{actionLabel}</Button>
    )
  ) : null;

  return (
    <div className={`text-center py-20 px-10 border-2 border-dashed border-border rounded-md bg-background ${className}`}>
      {icon && <span className="text-5xl inline-block mb-5">{icon}</span>}
      <h3 className="text-2xl font-heading text-heading mb-2.5">{title}</h3>
      <p className="text-muted mb-6 text-base max-w-md mx-auto leading-relaxed">{message}</p>
      {btn}
    </div>
  );
}
