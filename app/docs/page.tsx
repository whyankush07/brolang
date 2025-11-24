import { Metadata } from "next";
import DocumentationPage from "./docs";

export const metadata = {
    title: "Docs - Brolang Programming Language Documentation",
    description: "Complete documentation and guides for Brolang programming language. Learn syntax, features, and best practices.",
    keywords: ["brolang", "programming language", "documentation", "tutorial", "guide"],
    authors: [{ name: "Brolang Team" }],
    openGraph: {
        title: "Brolang Documentation",
        description: "Complete documentation and guides for Brolang programming language",
        type: "website",
        siteName: "Brolang",
    },
    twitter: {
        card: "summary_large_image",
        title: "Brolang Documentation",
        description: "Complete documentation and guides for Brolang programming language",
    },
} satisfies Metadata;

export default function Page() {
    return (
        <div>
            <DocumentationPage />
        </div>
    )
}