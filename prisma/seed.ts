import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const waypoints = [
    { name: "Chateau Neuf, Oslo", lat: 59.9139, lng: 10.7522, order: 0, visited: false },
    { name: "Legoland, Billund", lat: 55.7359259130816, lng: 9.122471558414132, order: 1, visited: false },
    { name: "Hamburg", lat: 53.5511, lng: 9.9937, order: 2, visited: false },
    { name: "Junktown", lat: 50.05875, lng: 14.011, order: 3, visited: false },
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
    { name: "Samarkand", lat: 39.6542, lng: 66.9597, order: 19, visited: false },
    { name: "Tashkent", lat: 41.2995, lng: 69.2401, order: 20, visited: false },
    { name: "Dushanbe", lat: 38.5598, lng: 68.787, order: 21, visited: false },
    { name: "M41", lat: 38.1671, lng: 73.9686, order: 22, visited: false },
    { name: "Bishkek", lat: 42.8746, lng: 74.5698, order: 23, visited: false },
    { name: "Almaty", lat: 43.2551, lng: 76.9126, order: 24, visited: false },
    { name: "Metallurgov Palace of Culture", lat: 49.974115, lng: 82.590248, order: 25, visited: false },
  ];

  await prisma.waypoint.deleteMany();
  await prisma.waypoint.createMany({ data: waypoints });

  console.log(`Created ${waypoints.length} waypoints`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
