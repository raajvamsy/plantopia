import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PlantopiaThemeProvider } from "@/lib/theme";
import { SupabaseAuthProvider } from "@/lib/auth/supabase-auth";
import { LoadingProvider, NavigationLoader } from "@/lib/loading";
import { ToastProvider } from "@/components/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plantopia - Grow plants, grow together",
  description: "AI-powered plant care made easy. Track your plants, get personalized care plans, and connect with fellow plant lovers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plantopia",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Plantopia",
    title: "Plantopia - Your Plant Care Companion",
    description: "AI-powered plant care made easy. Track your plants, get personalized care plans, and connect with fellow plant lovers.",
  },
  twitter: {
    card: "summary",
    title: "Plantopia - Your Plant Care Companion",
    description: "AI-powered plant care made easy. Track your plants, get personalized care plans, and connect with fellow plant lovers.",
  },
};

export function generateViewport() {
  return {
    themeColor: "#38e07b",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle chunk loading errors
              window.addEventListener('error', function(event) {
                if (event.message && event.message.includes('Loading chunk')) {
                  console.warn('Chunk loading error detected, attempting reload...');
                  window.location.reload();
                }
              });
              
              // Handle unhandled promise rejections (including chunk loading failures)
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && event.reason.message && event.reason.message.includes('Loading chunk')) {
                  console.warn('Chunk loading promise rejection detected, attempting reload...');
                  event.preventDefault();
                  window.location.reload();
                }
              });
              
              // Service Worker registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlantopiaThemeProvider defaultMode="light">
          <LoadingProvider>
            <SupabaseAuthProvider>
              <ToastProvider>
                <NavigationLoader />
                {children}
              </ToastProvider>
            </SupabaseAuthProvider>
          </LoadingProvider>
        </PlantopiaThemeProvider>
      </body>
    </html>
  );
}
