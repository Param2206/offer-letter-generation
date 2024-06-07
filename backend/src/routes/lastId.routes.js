import express from "express";
import { getLastId, updateLastId } from "../controllers/lastId.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/get", getLastId);
router.put("/update", updateLastId);

export default router;
