import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "City Nexa Networks",
    short_name: "City Nexa",
    description: "Your Trusted Real Estate Partner in Bangalore",
    start_url: "/",
    display: "standalone",
    theme_color: "#1b3a5c",
    background_color: "#faf8f5",
    icons: [
      {
        src: "/images/citynexa-logo.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/citynexa-logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
