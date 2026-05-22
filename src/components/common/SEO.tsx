import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}

export default function SEO({ 
  title = "Language World | Best German Language Institute & IELTS Prep in Karachi | Pakistan's First German AI Tutor", 
  description = "Learn with expert instructors and Pakistan's first AI-powered German tutor. Prepare for IELTS, PTE, LanguageCert, and professional communication — online and in-person across Pakistan.", 
  keywords = "German language Pakistan, IELTS preparation Pakistan, PTE coaching, LanguageCert, Business English, AI German tutor, online language courses Pakistan, Best German language institute in Karachi, German A1 course Karachi, IELTS preparation Karachi, PTE center Karachi, Study in Germany Pakistan, Language World Karachi, Learn German in Gulshan-e-Iqbal",
  url = "https://thelanguageworld.com",
  image = "/globe-logo.svg"
}: SEOProps) {
  const fullTitle = title.includes("Language World") ? title : `${title} | Language World`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org markup for Educational Institute */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LanguageSchool",
          "name": "Language World",
          "alternateName": "Language World Pakistan",
          "url": "https://thelanguageworld.com",
          "logo": "https://thelanguageworld.com/globe-logo.svg",
          "image": "https://thelanguageworld.com/og-image.jpg",
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Office 1 FL 4 / 14 Block 5 Gulshan E Iqbal",
            "addressLocality": "Karachi",
            "addressRegion": "Sindh",
            "postalCode": "75300",
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "24.9192",
            "longitude": "67.0984"
          },
          "hasMap": "https://www.google.com/maps?q=Language+World+Karachi+Nipa",
          "telephone": "+923007007699",
          "priceRange": "$$",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              "opens": "11:00",
              "closes": "20:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Sunday",
              "opens": "13:00",
              "closes": "17:00"
            }
          ]
        })}
      </script>
    </Helmet>
  );
}
