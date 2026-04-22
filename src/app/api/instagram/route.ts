import { NextResponse } from "next/server";

const PLACEHOLDER_POSTS = [
  {
    id: "1",
    media_type: "IMAGE",
    media_url: "https://picsum.photos/seed/polo1/600/600",
    thumbnail_url: null,
    caption: "Tjukk Tuk is ready for adventure! We can't wait for the Mongol Rally 2026. Stay tuned! #mongolrally #polomarket",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    permalink: "https://instagram.com",
  },
  {
    id: "2",
    media_type: "IMAGE",
    media_url: "https://picsum.photos/seed/polo2/600/600",
    caption: "Packing in full swing! Who actually needs clothes when you have spare parts? #mongolrally #tjukktuk",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    permalink: "https://instagram.com",
  },
  {
    id: "3",
    media_type: "IMAGE",
    media_url: "https://picsum.photos/seed/polo3/600/600",
    caption: "Thank you to everyone who has supported us! Rimcoins are live! Place your bets now! #mongolrally #rimcoins",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    permalink: "https://instagram.com",
  },
  {
    id: "4",
    media_type: "IMAGE",
    media_url: "https://picsum.photos/seed/polo4/600/600",
    caption: "Route planning: Oslo → Europe → Caucasus → Central Asia → Mongolia. Simple. #mongolrally",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    permalink: "https://instagram.com",
  },
  {
    id: "5",
    media_type: "IMAGE",
    media_url: "https://picsum.photos/seed/polo5/600/600",
    caption: "Final service on Tjukk Tuk. The mechanic laughed. We left anyway. #mongolrally #polomarket",
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    permalink: "https://instagram.com",
  },
  {
    id: "6",
    media_type: "IMAGE",
    media_url: "https://picsum.photos/seed/polo6/600/600",
    caption: "We're driving for Blå Kors, Leger uten grenser and Mental Helse Ungdom. Pick your favourite and bet! #betforcharity",
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    permalink: "https://instagram.com",
  },
];

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(PLACEHOLDER_POSTS);
  }

  try {
    const fields = "id,media_type,media_url,thumbnail_url,caption,timestamp,permalink";
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=12`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error("Instagram API error");
    const data = await res.json();
    return NextResponse.json(data.data ?? []);
  } catch {
    return NextResponse.json(PLACEHOLDER_POSTS);
  }
}
