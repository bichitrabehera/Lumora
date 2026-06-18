import React from "react";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-20 px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
