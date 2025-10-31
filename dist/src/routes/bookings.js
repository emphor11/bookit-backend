import { Router } from "express";
import prisma from "../prismaClient.js";
import { z } from "zod";
const router = Router();
const bookingSchema = z.object({
    experienceId: z.string(),
    slotId: z.string(),
    name: z.string().min(1),
    email: z.string().email(),
    seats: z.number().int().min(1),
    promoCode: z.string().optional()
});
// POST /api/bookings
router.post("/", async (req, res) => {
    const parse = bookingSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: "INVALID_PAYLOAD", details: parse.error.format() });
    const { experienceId, slotId, name, email, seats, promoCode } = parse.data;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const slot = await tx.slot.findUnique({ where: { id: slotId } });
            if (!slot)
                throw new Error("SLOT_NOT_FOUND");
            if (slot.capacity - slot.bookedCount < seats) {
                throw new Error("NOT_ENOUGH_SEATS");
            }
            // compute price
            const experience = await tx.experience.findUnique({ where: { id: experienceId } });
            if (!experience)
                throw new Error("EXPERIENCE_NOT_FOUND");
            let finalPrice = experience.priceCents * seats;
            if (promoCode) {
                const promo = await tx.promo.findUnique({ where: { code: promoCode } });
                if (promo && (!promo.validUntil || promo.validUntil > new Date())) {
                    if (promo.type === "percent") {
                        finalPrice = Math.max(0, Math.round(finalPrice * (100 - promo.value) / 100));
                    }
                    else if (promo.type === "flat") {
                        finalPrice = Math.max(0, finalPrice - promo.value);
                    }
                }
            }
            // increment booked_count
            await tx.slot.update({
                where: { id: slotId },
                data: { bookedCount: { increment: seats } }
            });
            const booking = await tx.booking.create({
                data: {
                    experienceId,
                    slotId,
                    customerName: name,
                    customerEmail: email,
                    seats,
                    finalPriceCents: finalPrice,
                    promoCode: promoCode ?? null
                }
            });
            return booking;
        });
        res.status(201).json({ bookingId: result.id, status: result.status, finalPriceCents: result.finalPriceCents });
    }
    catch (err) {
        if (err.message === "NOT_ENOUGH_SEATS")
            return res.status(409).json({ error: "NOT_ENOUGH_SEATS" });
        if (err.message === "SLOT_NOT_FOUND")
            return res.status(404).json({ error: "SLOT_NOT_FOUND" });
        console.error(err);
        res.status(500).json({ error: "SERVER_ERROR", details: err.message });
    }
});
export default router;
//# sourceMappingURL=bookings.js.map