import React from "react";
import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "event";
  structuredData?: Record<string, any>;
}

const defaultDescription = "Sathyabama Institute of Science and Technology - ACM SIGAI Student Chapter. Fostering innovation, AI research, workshops, hackathons, and student excellence.";
const defaultImage = "https://raw.githubusercontent.com/Bersinberz/acm-website/main/client/src/assets/acm-logo.png";
const siteTitle = "SIST ACM SIGAI";

export const SEO: React.FC<SEOProps> = ({
  title,
  description = defaultDescription,
  keywords = "ACM, SIGAI, Sathyabama, Artificial Intelligence, Machine Learning, Student Chapter, Hackathons, Workshops",
  image = defaultImage,
  url = "https://sistsigai.acm.org",
  type = "website",
  structuredData,
}) => {
  const fullTitle = title ? `${title} | ${siteTitle}` : "SIST ACM SIGAI | Official Student Chapter";

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook / LinkedIn / Discord */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sistsigai" />
      <meta name="twitter:creator" content="@sistsigai" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
