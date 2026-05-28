import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luma Letters | Make a gift page that feels personal",
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
      <body>{children}</body>
    </html>
  );
}
