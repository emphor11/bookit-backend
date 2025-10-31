import { Router } from "express";
import prisma from "../prismaClient.js";
const router = Router();

// GET /api/experiences
router.get("/", async (req, res) => {
  const exps = await prisma.experience.findMany({
    select: {
      id: true,
      title: true,
      shortDescription: true,
      priceCents: true,
      coverImage: true
    },
    orderBy: { createdAt: "desc" }
  });
  res.json(exps);
});

// GET /api/experiences/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exp = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: true, // ✅ this must be here
      },
    });
    console.log(exp)

    if (!exp) return res.status(404).json({ error: "Experience not found" });
    res.json(exp);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch experience" });
  }
});


export default router;
