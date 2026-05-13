import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "AwareNet — Spread What Matters",
    template: "%s | AwareNet",
  },
  description:
    "An interactive awareness ecosystem. Spread consciousness through chain-reaction sharing, emotional storytelling, and community participation.",
  keywords: ["awareness", "social impact", "global issues", "education", "community"],
  authors: [{ name: "AwareNet" }],
  creator: "AwareNet",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://awarenet.io",
    title: "AwareNet — Spread What Matters",
    description: "An interactive awareness ecosystem for global change.",
    siteName: "AwareNet",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "AwareNet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AwareNet — Spread What Matters",
    description: "An interactive awareness ecosystem for global change.",
    images: ["/og-image.jpg"],
    creator: "@awarenet",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://awarenet.io"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#03050a" },
    { media: "(prefers-color-scheme: light)", color: "#03050a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-void-950 font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
