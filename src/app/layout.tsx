import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JARVIS.ID – Service HP Panggilan & Oprek Android | Cimahi & Bandung",
  description:
    "JARVIS.ID melayani service HP panggilan area Cimahi & Bandung, oprek Android, custom ROM, root, tanam Smali, hardware service, dan pengiriman unit dari luar daerah.",
  keywords: [
    "JARVIS.ID",
    "service HP Cimahi",
    "service HP Bandung",
    "service HP panggilan",
    "oprek Android",
    "custom ROM",
    "root Android",
    "hardware HP",
    "ganti LCD",
    "ganti baterai",
  ],
  authors: [{ name: "JARVIS.ID" }],
  metadataBase: new URL("http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JARVIS.ID – Service HP Panggilan & Oprek Android",
    description:
      "Service HP panggilan Cimahi & Bandung. Oprek Android, custom ROM, root, hardware service, dan pengiriman unit dari luar daerah.",
    url: "http://localhost:3000",
    siteName: "JARVIS.ID",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "JARVIS.ID – Service HP Panggilan & Oprek Android",
    description:
      "Service HP panggilan Cimahi & Bandung, oprek Android, custom ROM, root, dan hardware service.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="6N-Mfe4cyHyY-Fl9Fo4-iOUfmIVjc_IebHSCy8PsuRA"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
