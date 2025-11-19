import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import { CodeProvider } from "@/context/CodeContext";
import { cn } from "@/lib/utils";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/toaster";
import OfflineNotification from "@/components/Offline-navigator";
import CustomHead from "@/components/custom-head";
import { metadata as siteMetadata } from "@/config/metadata";
import { ScrollBarProps } from "@/components/Scrollbar";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react"

const satoshi = localFont({
  display: 'swap',
  src: [
    {
      path: './fonts/satoshi.ttf',
    },
  ],
  variable: '--font-satoshi',
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CustomHead />
      </head>
      <body
        className={cn(
          'font-satoshi antialiased',
          satoshi.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CodeProvider>
            <ScrollBarProps >
              <NextTopLoader
                showSpinner={false}
              />
              <Header />
              <OfflineNotification />
              <Analytics />
              {children}
              <Toaster />
            </ScrollBarProps>
          </CodeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
