import TeamHero from "@/components/TeamHero";
import LiveMap from "@/components/LiveMap";
import TwitchStream from "@/components/TwitchStream";
import SocialLinks from "@/components/SocialLinks";
import MarketTeaser from "@/components/MarketTeaser";

export default function Home() {
  return (
    <>
      <TeamHero />
      <LiveMap />
      <TwitchStream />
      <SocialLinks />
      <MarketTeaser />
    </>
  );
}
