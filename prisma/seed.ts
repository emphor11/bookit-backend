import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // clear
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.promo.deleteMany();

  const experiences = [
    {
      title: "Sunset Kayaking",
      shortDescription: "Explore mangroves at sunset",
      longDescription: "Paddle through serene waters and watch the sunset.",
      priceCents: 2500,
      durationMinutes: 120,
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
    },
    {
      title: "City Food Walk",
      shortDescription: "Taste the city's best bites",
      longDescription: "Walk with a local guide sampling iconic dishes.",
      priceCents: 1800,
      durationMinutes: 150,
      coverImage: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9"
    },
    {
      title: "Mountain Sunrise Hike",
      shortDescription: "Catch sunrise from the peak",
      longDescription: "Challenging hike rewarded with a breathtaking sunrise.",
      priceCents: 3000,
      durationMinutes: 240,
      coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    }
  ];

  for (const exp of experiences) {
    const created = await prisma.experience.create({
      data: { ...exp }
    });

    // create 3 slots each
    const dates = [
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
    ];

    for (const d of dates) {
      await prisma.slot.create({
        data: {
          experienceId: created.id,
          slotDate: d,
          slotTime: "17:00",
          capacity: 6,
          bookedCount: Math.floor(Math.random() * 3)
        }
      });
    }
  }

  // sample promos
  await prisma.promo.createMany({
    data: [
      { code: "SAVE10", type: "percent", value: 10, validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { code: "FLAT100", type: "flat", value: 100, validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    ]
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
