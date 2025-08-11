import React from "react";
import { getStreak } from "../lib/streak";

export default function StreakInfo() {
  const [streak, setStreak] = React.useState(0);
  React.useEffect(() => {
    setStreak(getStreak());
    const interval = setInterval(() => setStreak(getStreak()), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-2">
      <span className="font-semibold text-lg">Your Current Win Streak is</span>{" "}
      <span className="text-blue-600 text-xl font-extrabold">{streak}</span>
    </div>
  );
}