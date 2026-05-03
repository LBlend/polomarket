import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const waypoints = await prisma.waypoint.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(waypoints);
}
