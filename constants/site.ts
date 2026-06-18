export const SITE = {
  name: "lovey page",
  tagline: "Mobile-first digital greeting cards and celebration microsites.",
  description:
    "Turn meaningful moments into unforgettable websites. Beautiful, personalized pages for the people who matter most.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://loveypage.com",
} as const;
