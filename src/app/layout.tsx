import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Evoc Companion | Meta Ads Launchpad",
  description: "Launch targeted Meta ad campaigns with AI-driven audience intelligence, creative assistance, and direct account setup by Evoc Labs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-[#fbfbfd] text-slate-900 selection:bg-slate-900 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
