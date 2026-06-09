import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "CineStream - Movie Stream and Downloader",
  description: "An OTT-style movie streaming-and-downloading hub featuring Gemini-powered interactive movie selection, dynamic video players, quality settings, and clean Hindi/English accessibility.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
