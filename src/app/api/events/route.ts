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
          _count: { select: { bets: true } },
        },
      },
      _count: { select: { bets: true } },
    },
  });

  // Attach user's existing bet per event if logged in
  const userBets = session?.user?.id
    ? await prisma.bet.findMany({
        where: { userId: session.user.id },
        select: { eventId: true, optionId: true, amount: true, status: true, id: true, payout: true, createdAt: true },
      })
    : [];

  const userBetMap = new Map(userBets.map((b) => [b.eventId, b]));

  const result = events.map((event) => {
    const totalBetted = event.options.reduce((sum, opt) => {
      return sum + (opt._count?.bets ?? 0);
    }, 0);

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      resolvedAt: event.resolvedAt,
      totalBets: totalBetted,
      options: event.options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        odds: opt.odds,
        isWinner: opt.isWinner,
        betCount: opt._count?.bets ?? 0,
      })),
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
        create: options.map((o: { label: string; odds: number }) => ({
          label: o.label,
          odds: o.odds,
        })),
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
    include: { options: true },
  });

  // Pay out winning bets
  if (status === "RESOLVED" && winnerOptionId) {
    const winningOption = event.options.find((o) => o.id === winnerOptionId);
    if (winningOption) {
      const winningBets = await prisma.bet.findMany({
        where: { eventId: id, optionId: winnerOptionId },
      });
      for (const bet of winningBets) {
        const payout = bet.amount * winningOption.odds;
        await prisma.bet.update({
          where: { id: bet.id },
          data: { status: "WON", payout },
        });
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
  }

  return NextResponse.json(event);
}
