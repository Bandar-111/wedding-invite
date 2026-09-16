import type { MetadataRoute } from "next";

// Guest invitation links are private — keep them out of search engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
