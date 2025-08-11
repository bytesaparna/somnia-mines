const STREAK_KEY = "mines_streak";
export const BONUS_THRESHOLD = 3; // Every 3 wins
export const BONUS_MULTIPLIER = 2;

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(STREAK_KEY) ?? "0", 10);
}
export function incrementStreak(): number {
  const streak = getStreak() + 1;
  localStorage.setItem(STREAK_KEY, streak.toString());
  return streak;
}
export function resetStreak() {
  localStorage.setItem(STREAK_KEY, "0");
}
export function checkBonus(streak: number): boolean {
  return streak > 0 && streak % BONUS_THRESHOLD === 0;
}
export function getBonusMultiplier(): number {
  return BONUS_MULTIPLIER;
}