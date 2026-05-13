import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://awarenet.io";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/categories", "/category/", "/awareness/"],
        disallow: ["/dashboard", "/profile", "/impact", "/settings", "/onboarding", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
