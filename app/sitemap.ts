import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nilemetrica.com";

  const routes = [
    "",
    "/country",
    "/governance",
    "/law",
    "/law/local-government-act",
    "/economy",
    "/society",
    "/environment",
    "/states",
    "/statistics",
    "/census",
    "/data",
    "/indicators",
    "/publications",
    "/methodology",
    "/about",
    "/contact",
    "/search",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}