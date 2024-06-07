import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
    origin: "https://offer-letter-generation.onrender.com",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import courseRouter from "./routes/course.routes.js";
import studentRouter from "./routes/student.routes.js";
import userRouter from "./routes/user.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
import lastIdRouter from "./routes/lastId.routes.js";

app.use("/api/courses", courseRouter);
app.use("/api/students", studentRouter);
app.use("/api/users", userRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/last-id", lastIdRouter);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(notFound);
app.use(errorHandler);

export { app };
