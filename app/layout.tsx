import type { Metadata } from "next";
import "./globals.css";
import Announcement from "../components/announcement";

export const metadata: Metadata = {
  title: "lovey page | Make a gift page that feels personal",
  description:
    "A cinematic landing page for custom celebration websites, inspired by heartfelt one-page gifts and microsites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Announcement />
        <div className="page-content">{children}</div>
      </body>
    </html>
  );
}
