import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 yêu cầu mỗi IP
  message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
});

app.use("/api", limiter); // Áp dụng middleware rate limiting cho tất cả các route API