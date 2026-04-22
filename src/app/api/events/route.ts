import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const events = await prisma.bettingEvent.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "asc" },
    include: {
      options: {
        include: {
          bets: { select: { amount: true } },
        },
      },
    },
  });

  const userBets = session?.user?.id
    ? await prisma.bet.findMany({
        where: { userId: session.user.id },
        select: { eventId: true, optionId: true, amount: true, status: true, id: true, payout: true, createdAt: true },
      })
    : [];

  const userBetMap = new Map(userBets.map((b) => [b.eventId, b]));

  const result = events.map((event) => {
    // Total rimcoins in the pool across all options
    const totalPool = event.options.reduce(
      (sum, opt) => sum + opt.bets.reduce((s, b) => s + b.amount, 0),
      0
    );

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      resolvedAt: event.resolvedAt,
      totalPool,
      options: event.options.map((opt) => {
        const optionTotal = opt.bets.reduce((s, b) => s + b.amount, 0);
        // Parimutuel implied odds: totalPool / optionTotal
        // null means no bets placed on this option yet
        const impliedOdds = optionTotal > 0 ? totalPool / optionTotal : null;
        return {
          id: opt.id,
          label: opt.label,
          impliedOdds,
          isWinner: opt.isWinner,
          betCount: opt.bets.length,
          totalAmount: optionTotal,
        };
      }),
      userBet: userBetMap.get(event.id) ?? null,
    };
  });

  return NextResponse.json(result);
}

// Admin only: create a new event
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, options } = await req.json();
  if (!title || !options?.length) {
    return NextResponse.json({ error: "title and options required" }, { status: 400 });
  }

  const event = await prisma.bettingEvent.create({
    data: {
      title,
      description,
      options: {
        create: options.map((o: { label: string }) => ({ label: o.label, odds: 1 })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json(event, { status: 201 });
}

// Admin only: close or resolve an event
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status, winnerOptionId } = await req.json();

  const event = await prisma.bettingEvent.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : undefined,
      options: winnerOptionId
        ? {
            updateMany: [
              { where: { eventId: id }, data: { isWinner: false } },
              { where: { id: winnerOptionId }, data: { isWinner: true } },
            ],
          }
        : undefined,
    },
  });

  // Parimutuel payout: winners split the entire pool proportional to their stake
  if (status === "RESOLVED" && winnerOptionId) {
    const allBets = await prisma.bet.findMany({ where: { eventId: id } });
    const totalPool = allBets.reduce((sum, b) => sum + b.amount, 0);
    const winningBets = allBets.filter((b) => b.optionId === winnerOptionId);
    const totalWinningStake = winningBets.reduce((sum, b) => sum + b.amount, 0);

    for (const bet of winningBets) {
      const payout = totalWinningStake > 0
        ? (bet.amount / totalWinningStake) * totalPool
        : 0;
      await prisma.bet.update({ where: { id: bet.id }, data: { status: "WON", payout } });
      await prisma.user.update({
        where: { id: bet.userId },
        data: { rimcoins: { increment: payout } },
      });
    }
    await prisma.bet.updateMany({
      where: { eventId: id, optionId: { not: winnerOptionId } },
      data: { status: "LOST" },
    });
  }

  return NextResponse.json(event);
}
