import React from "react";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`w-full mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6 pb-12 ${className}`}>
      {children}
    </div>
  );
}
