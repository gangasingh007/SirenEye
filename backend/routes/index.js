import express  from "express";
import authRouter from "./auth.js";
import reportRouter from "./report.js";

const router = express.Router();

router.use("/auth",authRouter);
router.use("/reports",reportRouter);

export default router;