"use client";

import { usePathname } from "next/navigation";

export default function Announcement() {
  const pathname = usePathname();
  if (pathname?.startsWith("/p/")) return null;

  return (
    <div className="announcement-bar" role="status" aria-live="polite">
      New templates added weekly ✨ — <a href="/editor" className="announcement-link">Create yours</a>
    </div>
  );
}
