import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.disable("x-powered-by");

const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked for this origin"));
    },
    credentials: true,
  })
);

const limiterWindowMs = 15 * 60 * 1000;
const limiterMaxRequests = Number(process.env.RATE_LIMIT_MAX || 300);
const requestBuckets = new Map();

app.use((req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || now > bucket.expiresAt) {
    requestBuckets.set(key, { count: 1, expiresAt: now + limiterWindowMs });
    return next();
  }

  if (bucket.count >= limiterMaxRequests) {
    return res.status(429).json({
      message: "Too many requests, please try again later.",
      success: false,
    });
  }

  bucket.count += 1;
  return next();
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
    success: false,
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || "Internal server error",
    success: false,
  });
});

export default app;
