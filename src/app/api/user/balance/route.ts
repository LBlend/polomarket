import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      rimcoins: true,
      charityId: true,
      charity: { select: { name: true, slug: true } },
    },
  });

  return NextResponse.json(user);
}

// Placeholder deposit endpoint — payment integration not built yet
export async function POST() {
  return NextResponse.json(
    { error: "Deposits are not yet available. Stay tuned!" },
    { status: 501 }
  );
}
