import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
} & React.HTMLAttributes<HTMLDivElement>;

export function Card({
  children,
  className = "",
  as: Component = "div",
  ...props
}: CardProps) {
  return (
    <Component
      className={`bg-white border border-border rounded-md p-6 ${className}`}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Component>
  );
}
