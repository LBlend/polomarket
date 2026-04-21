export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatRimcoins(amount: number) {
  return new Intl.NumberFormat("en").format(Math.floor(amount)) + " RC";
}

export function formatOdds(odds: number) {
  return `${odds.toFixed(2)}x`;
}

export const RIMCOIN_RATE = Number(process.env.RIMCOIN_RATE ?? 100);

export const CHARITIES = [
  {
    slug: "bla-kors",
    name: "Blå Kors",
    description: "Helping people affected by substance abuse",
    url: "https://blakors.no",
  },
  {
    slug: "leger-uten-grenser",
    name: "Leger uten grenser",
    description: "Medical emergency aid where it's needed most",
    url: "https://legerutengrenser.no",
  },
  {
    slug: "mental-helse-ungdom",
    name: "Mental Helse Ungdom",
    description: "For good mental health for all young people",
    url: "https://mentalhelse.no/om-oss/mental-helse-ungdom",
  },
];
