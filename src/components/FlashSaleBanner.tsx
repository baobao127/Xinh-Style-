import React from "react";
import { useCountdown } from "../hooks/useCountdown";

interface FlashSaleBannerProps {
  endTime: Date;
}
const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({ endTime }) => {
  const timeLeft = useCountdown(endTime);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  if (timeLeft <= 0) {
    return (
      <div className="bg-gray-300 text-center py-2 rounded mb-4">
        <span className="font-bold text-lg text-gray-600">Flash Sale đã kết thúc</span>
      </div>
    );
  }

  return (
    <div className="bg-red-500 text-white text-center py-2 rounded mb-4">
      <span className="font-bold text-lg">🔥 FLASH SALE kết thúc sau: </span>
      <span className="font-mono">
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};
export default FlashSaleBanner;