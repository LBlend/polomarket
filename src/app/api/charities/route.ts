import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const charities = await prisma.charity.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(charities);
}
