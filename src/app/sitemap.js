import { siteConfig } from "../data/siteConfig";

export default function sitemap() {
  const baseUrl = "https://servisjar-id.vercel.app";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}