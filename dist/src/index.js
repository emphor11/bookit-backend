import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import experiencesRouter from "./routes/experiences.js";
import bookingRouter from "./routes/bookings.js";
import promoRouter from "./routes/promo.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.json({ ok: true, name: "BookIt API" }));
app.use("/api/experiences", experiencesRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/promo", promoRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map