const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message:
    "Bạn đã yêu cầu quá quá 10 lần trong 5 giây, vui lòng thử lại sau 1 phút",
});

const verifyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message:
    "Bạn đã yêu cầu quá quá 3 lần trong 5 giây, vui lòng thử lại sau 1 phút",
});

module.exports = {
  apiLimiter,
  verifyLimiter,
};
