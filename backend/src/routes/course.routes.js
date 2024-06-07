import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
} from "../controllers/course.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/get", getAllCourses);
router.get("/get/:id", getCourseById);
router.post("/add", createCourse);
router.put("/update/:id", updateCourseById);
router.delete("/delete/:id", deleteCourseById);

export default router;
