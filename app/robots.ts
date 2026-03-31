import type { MetadataRoute } from "next";

const getSiteUrl = () =>
  (
    process.env.SYSTEM_ORIGIN ??
    "https://www.8clublagree.com"
  ).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

