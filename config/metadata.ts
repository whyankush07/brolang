import type { Metadata } from "next";

export const siteConfig = {
    name: "Brolang",
    short_description: "A fun programming language for all brothers!",
    description: "Learn and experiment with Brolang, a fun programming language written in Golang. Try our online playground, customize syntax, and explore programming concepts in an engaging way.",
    url: "https://brolang.whyankush.wtf",
    ogImage: "https://brolang.whyankush.wtf/landing.png",
    profileImage: "https://brolang.whyankush.wtf/favicon-32x32.png",
    twitter: "@whyankush07",
    themeColor: "#FDFDF9"
};

export const metadata = {
    title: {
        default: `${siteConfig.name} - Learn Programming with Fun!`,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
        "Brolang",
        "programming language",
        "fun programming",
        "toy language",
        "Golang",
        "online playground",
        "code editor",
        "syntax customization",
        "programming tutorial",
        "learn coding",
        "Ankush Singh",
        "Ankush Singh Tech",
        "educational tool",
        "interactive coding",
        "compiler",
        "interpreter"
    ],
    authors: [{ name: "Ankush Singh", url: "https://whyankush.wtf" }],
    creator: "Ankush Singh",
    publisher: "Ankush Singh",

    metadataBase: new URL(siteConfig.url),
    alternates: {
        canonical: "/",
        languages: {
            'en-US': '/',
        },
    },

    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: `${siteConfig.name} - Learn Programming with Fun!`,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [{
            url: siteConfig.ogImage,
            width: 1200,
            height: 627,
            alt: `${siteConfig.name} - Fun Programming Language Playground`,
            type: "image/png",
        }],
        videos: [],
    },

    twitter: {
        card: "summary_large_image",
        site: siteConfig.twitter,
        creator: siteConfig.twitter,
        title: `${siteConfig.name} - Learn Programming with Fun!`,
        description: siteConfig.description,
        images: [{
            url: siteConfig.ogImage,
            width: 1200,
            height: 627,
            alt: `${siteConfig.name} - Fun Programming Language Playground`,
        }],
    },

    manifest: "/manifest.webmanifest",

    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // verification: {
    //     google: "your-google-verification-code",
    //     yandex: "your-yandex-verification-code",
    //     bing: "your-bing-verification-code",
    // },

    other: {
        "application/ld+json": JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": siteConfig.name,
            "description": siteConfig.description,
            "url": siteConfig.url,
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web Browser",
            "author": {
                "@type": "Person",
                "name": "Ankush Singh",
                "url": "https://whyankush.wtf"
            },
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
            },
            "featureList": [
                "Online Code Playground",
                "Syntax Customization",
                "Real-time Compilation",
                "Educational Programming Tool"
            ]
        }),
    },

} satisfies Metadata;

export default siteConfig;