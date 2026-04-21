import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 2000), 5000);
  const since = searchParams.get("since");

  const locations = await prisma.location.findMany({
    where: since ? { timestamp: { gte: new Date(since) } } : undefined,
    orderBy: { timestamp: "asc" },
    take: limit,
    select: {
      id: true,
      lat: true,
      lng: true,
      altitude: true,
      speed: true,
      accuracy: true,
      battery: true,
      timestamp: true,
    },
  });

  return NextResponse.json(locations);
}
