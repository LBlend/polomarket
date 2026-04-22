import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STARTING_RIMCOINS = 100;

async function main() {
  console.log("Seeding database...");

  // Grant starting balance to any existing users who have none
  const { count } = await prisma.user.updateMany({
    where: { rimcoins: { lt: STARTING_RIMCOINS } },
    data: { rimcoins: STARTING_RIMCOINS },
  });
  if (count > 0) console.log(`  Granted ${STARTING_RIMCOINS} starting rimcoins to ${count} user(s)`);

  // Charities
  const charities = await Promise.all([
    prisma.charity.upsert({
      where: { slug: "cool-earth" },
      update: {},
      create: {
        name: "Cool Earth",
        slug: "cool-earth",
        url: "https://www.coolearth.org",
      },
    }),
    prisma.charity.upsert({
      where: { slug: "bla-kors" },
      update: {},
      create: {
        name: "Blå Kors",
        slug: "bla-kors",
        url: "https://blakors.no",
      },
    }),
    prisma.charity.upsert({
      where: { slug: "leger-uten-grenser" },
      update: {},
      create: {
        name: "Leger uten grenser",
        slug: "leger-uten-grenser",
        url: "https://legerutengrenser.no",
      },
    }),
    prisma.charity.upsert({
      where: { slug: "mental-helse-ungdom" },
      update: {},
      create: {
        name: "Mental Helse Ungdom",
        slug: "mental-helse-ungdom",
        url: "https://mentalhelse.no/om-oss/mental-helse-ungdom",
      },
    }),
  ]);

  console.log(`Created ${charities.length} charities`);

  // Betting events
  const events = [
    {
      title: "Will Tjukk Tuk reach Mongolia?",
      description: "Can the team drive all the way from Oslo to Ulaanbaatar without giving up?",
      options: [
        { label: "Yes, they make it!", odds: 1.8 },
        { label: "No, they stop along the way", odds: 2.5 },
        { label: "Partly. Last leg by transport", odds: 4.0 },
      ],
    },
    {
      title: "What will be Tjukk Tuk's biggest problem?",
      description: "Which type of issue will trouble the team the most on the journey?",
      options: [
        { label: "Tyre trouble", odds: 2.0 },
        { label: "Engine failure", odds: 2.5 },
        { label: "Navigation errors", odds: 3.0 },
        { label: "Visa issues", odds: 3.5 },
        { label: "No problems at all!", odds: 8.0 },
      ],
    },
    {
      title: "Will any team member fly home?",
      description: "Does anyone from the 3-person team give up and take a flight home?",
      options: [
        { label: "No, everyone drives the whole way", odds: 1.7 },
        { label: "Yes, one person flies home", odds: 3.0 },
        { label: "Yes, two or more fly home", odds: 7.0 },
      ],
    },
    {
      title: "How many days will the trip take?",
      description: "The rally is expected to take 3–6 weeks. What's your guess?",
      options: [
        { label: "Fewer than 25 days", odds: 3.0 },
        { label: "25–35 days", odds: 1.6 },
        { label: "36–45 days", odds: 2.2 },
        { label: "More than 45 days", odds: 4.0 },
      ],
    },
    {
      title: "Will Tjukk Tuk need an engine replacement?",
      description: "Does the team have to replace the engine due to a breakdown?",
      options: [
        { label: "No, original engine all the way", odds: 1.5 },
        { label: "Yes, one engine swap", odds: 3.5 },
        { label: "Yes, two or more", odds: 10.0 },
      ],
    },
    {
      title: "Will the team manage without a mechanic?",
      description: "Can the team handle all repairs themselves without outside help?",
      options: [
        { label: "Yes, fully self-sufficient", odds: 2.5 },
        { label: "No, they need help along the way", odds: 1.6 },
      ],
    },
    {
      title: "Which country will cause the most trouble?",
      description: "In which country will the team experience the most problems?",
      options: [
        { label: "Turkey", odds: 3.5 },
        { label: "Iran", odds: 3.0 },
        { label: "Turkmenistan", odds: 4.0 },
        { label: "Uzbekistan", odds: 4.5 },
        { label: "Kazakhstan", odds: 3.5 },
        { label: "Mongolia", odds: 2.5 },
      ],
    },
    {
      title: "Will the team get a speeding ticket?",
      description: "Will anyone in the team receive a traffic fine from police?",
      options: [
        { label: "Yes", odds: 1.9 },
        { label: "No", odds: 2.0 },
      ],
    },
  ];

  for (const event of events) {
    const exists = await prisma.bettingEvent.findFirst({
      where: { title: event.title },
    });
    if (exists) continue;

    await prisma.bettingEvent.create({
      data: {
        title: event.title,
        description: event.description,
        options: {
          create: event.options,
        },
      },
    });
    console.log(`  Created event: ${event.title}`);
  }

  // Route waypoints (classic Mongol Rally route)
  const waypoints = [
    { name: "Chateau Neuf, Oslo", lat: 59.9139, lng: 10.7522, order: 0, visited: false },
    { name: "Legoland, Billund", lat: 55.7359259130816, lng: 9.122471558414132, order: 1, visited: false },
    { name: "Hamburg", lat: 53.5511, lng: 9.9937, order: 2, visited: false },
    { name: "Prague", lat: 50.0755, lng: 14.4378, order: 3, visited: false },
    { name: "Lake Bled", lat: 46.3638, lng: 14.0934, order: 4, visited: false },
    { name: "Budapest", lat: 47.4979, lng: 19.0402, order: 5, visited: false },
    { name: "Belgrade", lat: 44.7866, lng: 20.4489, order: 6, visited: false },
    { name: "Sarajevo", lat: 43.8563, lng: 18.4131, order: 7, visited: false },
    { name: "Podgorica", lat: 42.4304, lng: 19.2594, order: 8, visited: false },
    { name: "Tirana", lat: 41.3275, lng: 19.8187, order: 9, visited: false },
    { name: "Skopje", lat: 41.9981, lng: 21.4254, order: 10, visited: false },
    { name: "Sofia", lat: 42.6977, lng: 23.3219, order: 11, visited: false },
    { name: "Bucharest", lat: 44.4268, lng: 26.1025, order: 12, visited: false },
    { name: "Istanbul", lat: 41.0082, lng: 28.9784, order: 13, visited: false },
    { name: "Batman", lat: 37.8812, lng: 41.1351, order: 14, visited: false },
    { name: "Batumi", lat: 41.6418, lng: 41.6415, order: 15, visited: false },
    { name: "Tbilisi", lat: 41.6938, lng: 44.8015, order: 16, visited: false },
    { name: "Baku", lat: 40.4093, lng: 49.8671, order: 17, visited: false },
    { name: "Aktau", lat: 43.6535, lng: 51.1727, order: 18, visited: false },
    { name: "Ashgabat", lat: 37.9601, lng: 58.3261, order: 19, visited: false },
    { name: "Samarkand", lat: 39.6542, lng: 66.9597, order: 20, visited: false },
    { name: "Tashkent", lat: 41.2995, lng: 69.2401, order: 21, visited: false },
    { name: "Dushanbe", lat: 38.5598, lng: 68.787, order: 22, visited: false },
    { name: "M41", lat: 38.1671, lng: 73.9686, order: 23, visited: false },
    { name: "Bishkek", lat: 42.8746, lng: 74.5698, order: 24, visited: false },
    { name: "Almaty", lat: 43.2551, lng: 76.9126, order: 25, visited: false },
    { name: "Ulaanbaatar", lat: 47.8864, lng: 106.9057, order: 26, visited: false },
  ];

  await prisma.waypoint.deleteMany();
  await prisma.waypoint.createMany({ data: waypoints });

  console.log(`Created ${waypoints.length} waypoints`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
