import siteConfig from '@/config/metadata';

export default function CustomHead() {
  return (
    <>
      <meta
        name="description"
        content="A fun programming language made for fun by Ankush written in Golang."
      />
      <meta name="application-name" content={siteConfig.name} />

      {/* PWA Meta Tags */}
      <link rel="manifest" href={`${siteConfig.url}/manifest.webmanifest`} />
      <meta name="theme-color" content={siteConfig.themeColor} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-title" content={siteConfig.name} />

      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:url" content="https://brolang.whyankush.wtf" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Home" />
      <meta property="og:description" content="A fun programming language made for fun by Ankush written in Golang." />
      <meta property="og:image" content="https://brolang.whyankush.wtf/landing.png" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="brolang.whyankush.wtf" />
      <meta property="twitter:url" content="https://brolang.whyankush.wtf" />
      <meta name="twitter:title" content="Home" />
      <meta name="twitter:description" content="A fun programming language made for fun by Ankush written in Golang." />
      <meta name="twitter:image" content="https://brolang.whyankush.wtf/landing.png" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href={siteConfig.profileImage} />

      {/* Additional Social Media Meta Tags */}
      <meta name="linkedin:title" content={siteConfig.name} />
      <meta name="linkedin:description" content="A fun programming language made for fun by Ankush written in Golang." />
      <meta name="linkedin:image" content={siteConfig.profileImage} />

      {/* Preload Critical Resources */}
      <link
        rel="preload"
        href={siteConfig.profileImage}
        as="image"
        type="image/png"
      />
    </>
  );
}