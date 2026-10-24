import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galactic Notes",
  description: "Your thoughts, beyond the stars.",
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
