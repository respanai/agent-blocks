import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://agent-architect.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://agent-architect.vercel.app/login",
      lastModified: new Date(),
    },
  ];
}
