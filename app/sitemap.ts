import type { MetadataRoute } from "next";

const getSiteUrl = () =>
  (
    process.env.SYSTEM_ORIGIN ??
    "https://www.8clublagree.com"
  ).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const routes = [
    "",
    "/login",
    "/packages",
    "/bookings",
    "/credits",
    "/lagree-cebu",
    "/beginner-lagree-cebu",
    "/best-workouts-cebu-2026",
    "/lagree-vs-pilates-cebu",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority:
      route === ""
        ? 1
        : [
          "/lagree-vs-pilates-cebu",
          "/lagree-cebu",
          "/beginner-lagree-cebu",
          "/best-workouts-cebu-2026",
        ].includes(route)
          ? 0.9
          : 0.7,
  }));
}

