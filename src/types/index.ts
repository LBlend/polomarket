import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rimcoins: number;
      charityId: string | null;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    rimcoins: number;
    charityId: string | null;
    isAdmin: boolean;
  }
}

export interface LocationPoint {
  id: string;
  lat: number;
  lng: number;
  altitude?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  battery?: number | null;
  timestamp: string;
}

export interface WaypointData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description?: string | null;
  order: number;
  visited: boolean;
}

export interface BettingEventData {
  id: string;
  title: string;
  description?: string | null;
  status: "OPEN" | "CLOSED" | "RESOLVED";
  options: BettingOptionData[];
  totalBets?: number;
  userBet?: BetData | null;
}

export interface BettingOptionData {
  id: string;
  label: string;
  odds: number;
  isWinner: boolean;
  betCount?: number;
  totalAmount?: number;
}

export interface BetData {
  id: string;
  amount: number;
  payout?: number | null;
  status: "PENDING" | "WON" | "LOST";
  optionId: string;
  createdAt: string;
}

export interface CharityData {
  id: string;
  name: string;
  slug: string;
  url?: string | null;
}

export interface OwnTracksPayload {
  _type: string;
  lat?: number;
  lon?: number;
  alt?: number;
  vel?: number;
  acc?: number;
  batt?: number;
  tid?: string;
  tst?: number;
}
