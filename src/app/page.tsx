import TeamHero from "@/components/TeamHero";
import LiveMap from "@/components/LiveMap";
import InstagramFeed from "@/components/InstagramFeed";
import MarketTeaser from "@/components/MarketTeaser";

export default function Home() {
  return (
    <>
      <TeamHero />
      <LiveMap />
      <InstagramFeed />
      <MarketTeaser />
    </>
  );
}
