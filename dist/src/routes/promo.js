import { Router } from "express";
import prisma from "../prismaClient.js";
const router = Router();
// POST /api/promo/validate
router.post("/validate", async (req, res) => {
    const { code } = req.body;
    if (!code)
        return res.status(400).json({ valid: false, reason: "missing_code" });
    const promo = await prisma.promo.findUnique({ where: { code } });
    if (!promo)
        return res.status(404).json({ valid: false, reason: "not_found" });
    if (promo.validUntil && promo.validUntil < new Date()) {
        return res.status(400).json({ valid: false, reason: "expired" });
    }
    res.json({ valid: true, type: promo.type, value: promo.value });
});
export default router;
//# sourceMappingURL=promo.js.map