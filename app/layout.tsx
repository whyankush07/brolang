import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import CustomHead from "@/components/custom-head";
import { metadata as siteMetadata } from "@/config/metadata";
import ProviderWrapper from "./provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
          'font-geist-sans antialiased',
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}
