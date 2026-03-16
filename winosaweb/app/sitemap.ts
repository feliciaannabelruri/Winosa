import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {

const baseUrl = "http://localhost:3000";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/custom-website`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/custom-uiux`,
      lastModified: new Date(),
    },
  ];
}