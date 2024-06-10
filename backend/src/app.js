import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// app.use(
//   cors({
//     // origin: process.env.CORS_ORIGIN,
//     origin: "https://offer-letter-generation.onrender.com",
//     credentials: true,
//   })
// );

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routers
import courseRouter from "./routes/course.routes.js";
import studentRouter from "./routes/student.routes.js";
import userRouter from "./routes/user.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
import lastIdRouter from "./routes/lastId.routes.js";

// Use routers
app.use("/api/courses", courseRouter);
app.use("/api/students", studentRouter);
app.use("/api/users", userRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/last-id", lastIdRouter);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export { app };
