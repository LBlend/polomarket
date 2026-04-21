import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { OwnTracksPayload } from "@/types";

// OwnTracks HTTP mode sends a POST with Basic Auth.
// Set OWNTRACKS_PASSWORD in your env; the username field is ignored.
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;
  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const password = decoded.split(":")[1] ?? decoded;
  return password === process.env.OWNTRACKS_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (process.env.OWNTRACKS_PASSWORD && !isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: OwnTracksPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body._type !== "location" || !body.lat || !body.lon) {
    // OwnTracks sends other event types; silently accept them
    return NextResponse.json({});
  }

  const timestamp = body.tst
    ? new Date(body.tst * 1000)
    : new Date();

  await prisma.location.create({
    data: {
      lat: body.lat,
      lng: body.lon,
      altitude: body.alt ?? null,
      speed: body.vel ?? null,
      accuracy: body.acc ?? null,
      battery: body.batt ?? null,
      tid: body.tid ?? null,
      timestamp,
    },
  });

  // Return empty object — OwnTracks accepts this as success
  return NextResponse.json({});
}
