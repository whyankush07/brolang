import { Metadata } from "next";
import CodePlaygroundPage from "./playground";

export const metadata = {
  title: "Brolang Playground - Interactive Code Editor | Brolang",
  description: "Try Brolang online with our interactive playground. Write, test, and experiment with Brolang code directly in your browser.",
  keywords: ["brolang", "playground", "code editor", "interactive", "online compiler"],
  openGraph: {
    title: "Brolang Playground - Interactive Code Editor",
    description: "Try Brolang online with our interactive playground. Write, test, and experiment with Brolang code directly in your browser.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brolang Playground - Interactive Code Editor",
    description: "Try Brolang online with our interactive playground. Write, test, and experiment with Brolang code directly in your browser.",
  },
} satisfies Metadata;

export default function Page() {
  return <CodePlaygroundPage />
}