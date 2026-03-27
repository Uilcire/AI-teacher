import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Teacher",
  description: "Interactive AI-powered teaching assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
