import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;
  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const password = decoded.split(":")[1] ?? decoded;
  return password === process.env.OWNTRACKS_PASSWORD;
}

export async function GET() {
  const waypoints = await prisma.waypoint.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(waypoints);
}

export async function POST(req: NextRequest) {
  if (!process.env.OWNTRACKS_PASSWORD) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const waypoint = await prisma.waypoint.create({ data: body });
  return NextResponse.json(waypoint);
}
