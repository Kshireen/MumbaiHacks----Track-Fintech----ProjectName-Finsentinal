import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinSentinel",
  description: "Voice-first, agentic fraud detection built for rural India",

  openGraph: {
    title: "FinSentinel — AI Fraud Detection for Rural Fintech",
    description:
      "Voice-first, agentic fraud detection for rural India — multilingual onboarding, transaction monitoring, and real-time fraud risk analysis powered by LangChain agents.",
    url: "https://mumbai-hacks-track-fintech-project.vercel.app",
    siteName: "FinSentinel",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
