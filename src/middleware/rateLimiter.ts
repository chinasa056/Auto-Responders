import rateLimit from "express-rate-limit";
import { ErrorCode } from "src/enum/error";

export const providerLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 50, 
  keyGenerator: (req) => {
    return `${req.query.integrationId || "anon"}-${req.query.provider || "unknown"}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      status: false,
      error: ErrorCode.RATE_LIMIT,
      message: "Too many requests, please try again later.",
    });
  },
});
