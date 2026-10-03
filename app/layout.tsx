import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galactic Notes",
  description: "A quiet corner of the cosmos for all your thoughts.",
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
