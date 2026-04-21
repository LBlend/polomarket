import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const waypoints = await prisma.waypoint.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(waypoints);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { lat, lng, name, description, order } = await req.json();
  if (!lat || !lng || !name) {
    return NextResponse.json(
      { error: "lat, lng and name are required" },
      { status: 400 }
    );
  }

  const waypoint = await prisma.waypoint.create({
    data: { lat, lng, name, description, order: order ?? 0 },
  });
  return NextResponse.json(waypoint, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, ...data } = await req.json();
  const waypoint = await prisma.waypoint.update({
    where: { id },
    data,
  });
  return NextResponse.json(waypoint);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();
  await prisma.waypoint.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
