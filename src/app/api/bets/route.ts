import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bets = await prisma.bet.findMany({
    where: { userId: session.user.id },
    include: {
      event: { select: { title: true, status: true } },
      option: { select: { label: true, odds: true } },
      charity: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId, optionId, amount } = await req.json();
  if (!eventId || !optionId || !amount || amount <= 0) {
    return NextResponse.json(
      { error: "eventId, optionId and a positive amount are required" },
      { status: 400 }
    );
  }

  // Verify event is still open
  const event = await prisma.bettingEvent.findUnique({ where: { id: eventId } });
  if (!event || event.status !== "OPEN") {
    return NextResponse.json({ error: "Event is not open for betting" }, { status: 400 });
  }

  // Check user hasn't already bet on this event
  const existing = await prisma.bet.findFirst({
    where: { userId: session.user.id, eventId },
  });
  if (existing) {
    return NextResponse.json({ error: "You already placed a bet on this event" }, { status: 400 });
  }

  // Check balance
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { rimcoins: true, charityId: true },
  });
  if (!user || user.rimcoins < amount) {
    return NextResponse.json({ error: "Insufficient rimcoins" }, { status: 400 });
  }

  // Deduct rimcoins and create bet in a transaction
  const [bet] = await prisma.$transaction([
    prisma.bet.create({
      data: {
        userId: session.user.id,
        eventId,
        optionId,
        amount,
        charityId: user.charityId ?? undefined,
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { rimcoins: { decrement: amount } },
    }),
  ]);

  return NextResponse.json(bet, { status: 201 });
}
