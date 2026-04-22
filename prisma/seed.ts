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
        { label: "Partly — last leg by transport", odds: 4.0 },
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
    { name: "Oslo", lat: 59.9139, lng: 10.7522, order: 0, visited: false },
    { name: "Legoland Billund", lat: 55.7359259130816, lng: 9.122471558414132, order: 1, visited: false },
    { name: "Prague", lat: 50.0755, lng: 14.4378, order: 2, visited: false },
    { name: "Budapest", lat: 47.4979, lng: 19.0402, order: 3, visited: false },
    { name: "Istanbul", lat: 41.0082, lng: 28.9784, order: 4, visited: false },
    { name: "Tbilisi", lat: 41.6938, lng: 44.8015, order: 5, visited: false },
    { name: "Tehran", lat: 35.6892, lng: 51.389, order: 6, visited: false },
    { name: "Ashgabat", lat: 37.9601, lng: 58.3261, order: 7, visited: false },
    { name: "Samarkand", lat: 39.6542, lng: 66.9597, order: 8, visited: false },
    { name: "Almaty", lat: 43.2551, lng: 76.9126, order: 9, visited: false },
    { name: "Ulaanbaatar", lat: 47.8864, lng: 106.9057, order: 10, visited: false },
  ];

  for (const wp of waypoints) {
    const exists = await prisma.waypoint.findFirst({ where: { name: wp.name } });
    if (!exists) {
      await prisma.waypoint.create({ data: wp });
    }
  }

  console.log(`Created ${waypoints.length} waypoints`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
