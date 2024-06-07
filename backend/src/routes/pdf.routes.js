import express from "express";
import { generateOfferLetter } from "../controllers/pdf.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/generate", generateOfferLetter);

export default router;
