import { Router } from "express";
import authRoutes from "./auth.js";
import playerRoutes from "./players.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Freagent Server!");
});

router.use("/", authRoutes);
router.use("/players", playerRoutes);

export default router;
