import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { charityId } = await req.json();
  if (!charityId) {
    return NextResponse.json({ error: "charityId required" }, { status: 400 });
  }

  const charity = await prisma.charity.findUnique({ where: { id: charityId } });
  if (!charity) {
    return NextResponse.json({ error: "Charity not found" }, { status: 404 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { charityId },
    select: { charityId: true },
  });

  return NextResponse.json(user);
}
