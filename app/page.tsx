import LandingPage from "@/components/layout/Landing";
import { Metadata } from "next";
import Head from "next/head";
import { siteConfig } from "@/config/metadata";

export const metadata = {
  title: "Brolang",
  description: "A fun programming language made for fun by Ankush written in Golang.",
} satisfies Metadata;

export default function Page() {
  return (
    <div>
      <LandingPage />
    </div>
  )
}
